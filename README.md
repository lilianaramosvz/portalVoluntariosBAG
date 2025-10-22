# 🧡 Portal de Voluntarios BAG

**Portal de Voluntarios BAG** es una aplicación móvil desarrollada en **React Native (Expo)** con backend en **Firebase**, diseñada para optimizar la **gestión integral de voluntarios** del **Banco de Alimentos de Guadalajara (BAG)**.  
El sistema digitaliza y centraliza los procesos de registro, aprobación, control de accesos y seguimiento de voluntarios, contribuyendo a una operación más eficiente y segura.

---

## 🎯 Objetivo del proyecto

El Banco de Alimentos de Guadalajara enfrenta procesos manuales y poco trazables en la gestión de voluntarios.  
Con este portal se busca:

- Automatizar el **registro y control de asistencias** mediante códigos QR.  
- Facilitar la **coordinación entre administradores, guardias y voluntarios**.  
- Centralizar toda la información en un solo sistema digital.  
- Aumentar la **seguridad y confiabilidad de los registros**.  

---

## 👥 Roles de usuario

La aplicación contempla **tres tipos de usuarios**, cada uno con funcionalidades específicas:

| Rol | Descripción |
|-----|--------------|
| **Voluntario** | Se registra, envía documentación, visualiza su estado de aprobación y genera su QR para acceso. |
| **Administrador** | Supervisa y aprueba solicitudes, consulta historial y gestión de voluntarios. |
| **Guardia** | Escanea y valida QR de acceso, registrando entradas. |

---

## 📱 Funcionalidades principales

- **Autenticación por roles (Firebase Auth).**  
- **Flujo de registro con documentos (Storage).**  
- **Aprobación y rechazo de solicitudes** (Firestore).
- **Escaneo y validación de QR en tiempo real.**  
- **Historial de asistencias por usuario.**  
- **Paneles adaptados a cada rol** (Voluntario, Guardia, Admin).
- **Gestión centralizada y segura de datos**.

---

## 🛠️ Arquitectura del sistema

### Frontend (Expo / React Native + TypeScript)
- Navegación diferenciada por roles.  
- Contexto de autenticación (AuthContext) con control de sesión.  
- Vistas principales:
  - `Dashboard`, `Historial`, `QR`, `Solicitudes`, `Administración`.  
- Subida de documentos (INE, comprobantes) a **Firebase Storage**.

### Backend (Firebase)
- **Firestore** → Almacenamiento estructurado por colecciones:  
  - `Usuarios` (voluntarios aprobados).  
  - `voluntariosPendientes`.  
  - `RegistroAsistencias`.  
- **Cloud Functions (Node/TypeScript)** → Generación y validación de QR, envío de correos automáticos.

---


## 🧪 Flujo funcional

1. **Registro del voluntario:**  
   Crea cuenta → sube documentos → pasa a revisión (colección `voluntariosPendientes`).

2. **Aprobación o rechazo:**  
   El administrador aprueba la solicitud → se mueve a `Usuarios` con rol `voluntario`.  
   Si se rechaza, se elimina y pierde acceso.

3. **Ingreso al BAG:**  
   El guardia escanea el QR → se valida y se registra asistencia.

4. **Consulta de historial:**  
   Voluntarios y administradores visualizan los registros previos.

---

## ⚙️ Estructura del repositorio

```
frontend/
  App.tsx
  src/
    context/AuthContext.tsx
    navigation/{Auth,Admin,Guardia,Voluntario}Navigator.tsx
    screens/{auth,voluntario,admin,guardia}/
    services/{firebaseConfig, api, qrFunctions, secureStorage}.ts
    styles/{colors, typography, screens/**}
    components/{headerTitle, QrDisplay}.tsx
  .env

backend/
  functions/
    index.ts
    src/{QrGeneration.js, QrRedemption.js}
  firebase.json
  .firebaserc
```

---

## 🚀 Instalación y ejecución

### Requisitos
- Node LTS  
- Firebase CLI (`npm i -g firebase-tools`)  
- Android Studio (opcional para compilación local)

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npx expo start
```

### Backend (Funciones de Firebase)
```bash
cd backend/functions
npm install
firebase login
firebase use <tu-proyecto>
firebase deploy --only functions
```

---

## 🌐 Variables de entorno

Archivo `.env` (frontend):

```
EXPO_PUBLIC_API_KEY=
EXPO_PUBLIC_AUTH_DOMAIN=
EXPO_PUBLIC_PROJECT_ID=
EXPO_PUBLIC_STORAGE_BUCKET=
EXPO_PUBLIC_MESSAGING_SENDER_ID=
EXPO_PUBLIC_APP_ID=
EXPO_PUBLIC_EMAILJS_SERVICE_ID=
EXPO_PUBLIC_EMAILJS_TEMPLATE_ID=
EXPO_PUBLIC_EMAILJS_PUBLIC_KEY=
```

---

## 💡 Impacto en el Banco de Alimentos

- ✅ **Acceso seguro y trazable** a las instalaciones.  
- 🧾 **Centralización de información** en un solo sistema.  
- 🔒 **Mayor seguridad** en manejo de datos y accesos.  
- ⚙️ **Digitalización de procesos**, reduciendo errores manuales.  

---

## 📂 Enlaces

- 🎨 **Diseño Figma:** [Voluntarios BAG](https://www.figma.com/design/o3xswDdbZTUB9iBMVT6WwG/Voluntarios-BAG?node-id=54-242&t=TAvfK4nk959H7x5s-1)  
- 🧾 **Repositorio en GitHub:** [Portal de Voluntarios BAG](https://github.com/lilianaramosvz/portalVoluntariosBAG.git)  
