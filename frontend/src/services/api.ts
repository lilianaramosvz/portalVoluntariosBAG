// frontend/src/services/api.ts

import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from './firebaseConfig';

const db = getFirestore(app);
const functions = getFunctions(app);

export interface UserData {
  id: string;
  email: string;
  name: string;
  rol?: 'voluntario' | 'admin' | 'guardia' | 'superadmin'; // Opcional, ya que el rol viene del token
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
    console.log(`Buscando en colección: "Usuarios"`); // Cambiado de "users" a "Usuarios"
    console.log(`Documento ID: "${uid}"`);
    
    // Intentar obtener el documento del usuario - CORREGIDO: usar "Usuarios" en lugar de "users"
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
        // rol: el rol ahora viene del token JWT (customClaims), no de Firestore
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
      console.log(`No se encontró documento con ID: "${uid}" en la colección "Usuarios"`); // Cambiado de "users"
      
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
    await setDoc(doc(db, 'Usuarios', uid), { rol: newRole }, { merge: true }); // Cambiado de "users" a "Usuarios"
    console.log(`Rol actualizado para usuario ${uid}: ${newRole}`);
  } catch (error) {
    console.error('Error actualizando rol del usuario:', error);
    throw error;
  }
};

// Obtener el rol actual del usuario desde customClaims
export const getCurrentUserRole = async (): Promise<string | null> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      return null;
    }
    
    const idTokenResult = await user.getIdTokenResult();
    return idTokenResult.claims.role as string || null;
  } catch (error) {
    console.error('Error obteniendo rol del usuario:', error);
    return null;
  }
};

// Función para solicitar cambio de rol (usa Cloud Function)
export const requestRoleChange = async (
  targetUserId: string, 
  newRole: 'voluntario' | 'admin' | 'guardia' | 'superadmin'
): Promise<{ success: boolean; message: string }> => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      return { success: false, message: 'Usuario no autenticado' };
    }
    
    // Llamar a la Cloud Function
    const setUserRole = httpsCallable(functions, 'setUserRole');
    const result = await setUserRole({
      targetUserId,
      newRole
    });
    
    const data = result.data as { success: boolean; message: string };
    
    return { 
      success: true, 
      message: data.message || `Rol ${newRole} asignado correctamente` 
    };
  } catch (error: any) {
    console.error('Error solicitando cambio de rol:', error);
    
    let message = 'Error interno al cambiar rol';
    if (error.code === 'functions/permission-denied') {
      message = 'No tienes permisos para realizar esta acción';
    } else if (error.code === 'functions/invalid-argument') {
      message = 'Datos inválidos proporcionados';
    } else if (error.code === 'functions/unauthenticated') {
      message = 'Debes estar autenticado para realizar esta acción';
    } else if (error.message) {
      message = error.message;
    }
    
    return { success: false, message };
  }
};

// Refrescar el token para obtener los customClaims actualizados
export const refreshUserToken = async (): Promise<boolean> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      return false;
    }
    
    // Forzar refresh del token para obtener customClaims actualizados
    await user.getIdToken(true);
    return true;
  } catch (error) {
    console.error('Error refrescando token:', error);
    return false;
  }
};

// Obtener información detallada de un usuario (para admins)
export const getDetailedUserInfo = async (targetUserId: string): Promise<any> => {
  try {
    const getUserInfo = httpsCallable(functions, 'getUserInfo');
    const result = await getUserInfo({ targetUserId });
    
    return result.data;
  } catch (error: any) {
    console.error('Error obteniendo información del usuario:', error);
    throw new Error(error.message || 'Error al obtener información del usuario');
  }
};

// Listar todos los usuarios (para admins)
export const listAllUsers = async (maxResults: number = 100, nextPageToken?: string): Promise<any> => {
  try {
    const listUsers = httpsCallable(functions, 'listUsers');
    const result = await listUsers({ maxResults, nextPageToken });
    
    return result.data;
  } catch (error: any) {
    console.error('Error listando usuarios:', error);
    throw new Error(error.message || 'Error al listar usuarios');
  }
};
