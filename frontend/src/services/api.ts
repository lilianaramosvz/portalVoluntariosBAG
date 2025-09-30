// frontend/src/services/api.ts

import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { app } from './firebaseConfig';

const db = getFirestore(app);

export interface UserData {
  id: string;
  email: string;
  name: string;
  rol: 'voluntario' | 'admin' | 'guardia' | 'superadmin';
  // Campos opcionales para voluntarios
  contactoEmergencia?: string;
  isActive?: boolean;
  curp?: string;
  discapacidad?: string;
  documentos?: {
    comprobanteDomicilio?: string;
    ine?: string;
  };
  empresa?: string;
  fechaNacimiento?: string;
  fechaRegistro?: any; // Firebase Timestamp
  genero?: string;
  numeroIne?: string;
}

export const getUserData = async (uid: string, userEmail?: string): Promise<UserData | null> => {
  try {
    console.log(`=== INICIO getUserData ===`);
    console.log(`UID recibido: "${uid}"`);
    console.log(`Email recibido: "${userEmail}"`);
    console.log(`Buscando en colección: "users"`);
    console.log(`Documento ID: "${uid}"`);
    
    // Intentar obtener el documento del usuario
    const docRef = doc(db, 'Usuarios', uid);
    console.log('Referencia del documento creada:', docRef.path);
    
    const userDoc = await getDoc(docRef);
    console.log('Documento obtenido, existe?:', userDoc.exists());
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      console.log('=== DATOS ENCONTRADOS ===');
      console.log('Datos completos del documento:', JSON.stringify(data, null, 2));
      
      // Verificar campos específicos
      console.log('Campo "nombre":', data.nombre);
      console.log('Campo "email":', data.email);
      console.log('Campo "rol":', data.rol);
      
      // Crear el objeto UserData con todos los campos disponibles
      const userData: UserData = {
        id: uid,
        email: data.email || userEmail || '',
        name: data.nombre || data.name || 'Usuario', // Tu estructura usa 'nombre'
        rol: data.rol || data.role || 'voluntario',
        // Campos opcionales para voluntarios (no afectará a admins que no los tengan)
        contactoEmergencia: data.contactoEmergencia,
        curp: data.curp,
        discapacidad: data.discapacidad,
        documentos: data.documentos,
        empresa: data.empresa,
        fechaNacimiento: data.fechaNacimiento,
        fechaRegistro: data.fechaRegistro,
        genero: data.genero,
        numeroIne: data.numeroIne,
      };
      
      console.log('=== USERDATA CREADO ===');
      console.log('UserData final:', JSON.stringify(userData, null, 2));
      return userData;
    } else {
      console.log('=== DOCUMENTO NO ENCONTRADO ===');
      console.log(`No se encontró documento con ID: "${uid}" en la colección "users"`);
      
      // Intentar listar algunos documentos para debug
      console.log('Verificando conexión a Firestore...');
      return null;
    }
  } catch (error) {
    console.error('=== ERROR EN getUserData ===');
    console.error('Error completo:', error);
    console.error('Tipo de error:', typeof error);
    console.error('Mensaje:', error instanceof Error ? error.message : 'Error desconocido');
    throw error;
  }
};

// Función para actualizar el rol de un usuario (por si la necesitas más adelante)
export const updateUserRole = async (uid: string, newRole: 'voluntario' | 'admin' | 'guardia' | 'superadmin'): Promise<void> => {
  try {
    await setDoc(doc(db, 'Usuarios', uid), { rol: newRole }, { merge: true });
    console.log(`Rol actualizado para usuario ${uid}: ${newRole}`);
  } catch (error) {
    console.error('Error actualizando rol del usuario:', error);
    throw error;
  }
};
