//frontend\src\utils\errorHandler.ts

/**
 * Manejador de errores seguro - Cumplimiento OWASP MSTG-STORAGE-3
 * Evita la divulgación de información sensible mediante mensajes de error
 */
export class SecureErrorHandler {
  // Manejador de errores de autenticación
  static handleAuthError(error: any, context: string = "AUTH"): string {
    if (__DEV__) {
      console.log(`[${context}] Auth error details:`, {
        code: error.code,
        message: error.message,
        timestamp: new Date().toISOString(),
        stack: error.stack,
      });
    }

    //regresa mensajes amigables al usuario sin detalles técnicos
    switch (error.code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
      case "auth/invalid-email":
        return "Credenciales incorrectas. Verifica tu email y contraseña.";

      case "auth/user-disabled":
        return "Esta cuenta ha sido deshabilitada. Contacta al administrador.";

      case "auth/too-many-requests":
        return "Demasiados intentos fallidos. Intenta nuevamente en unos minutos.";

      case "auth/network-request-failed":
        return "Error de conexión. Verifica tu conexión a internet.";

      case "auth/email-already-in-use":
        return "Este email ya está registrado. Intenta iniciar sesión.";

      case "auth/weak-password":
        return "La contraseña debe tener al menos 6 caracteres.";

      case "auth/operation-not-allowed":
        return "Operación no permitida. Contacta al administrador.";

      case "auth/requires-recent-login":
        return "Por seguridad, inicia sesión nuevamente para continuar.";

      default:
        return "Error de autenticación. Intenta nuevamente.";
    }
  }

  // Manejador de errores de Firestore
  static handleFirestoreError(
    error: any,
    context: string = "FIRESTORE"
  ): string {
    if (__DEV__) {
      console.log(`[${context}] Firestore error details:`, {
        code: error.code,
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }

    switch (error.code) {
      case "permission-denied":
        return "No tienes permisos para realizar esta acción.";

      case "unavailable":
        return "Servicio temporalmente no disponible. Intenta más tarde.";

      case "deadline-exceeded":
        return "La operación tardó demasiado. Verifica tu conexión.";

      case "not-found":
        return "La información solicitada no fue encontrada.";

      case "already-exists":
        return "Esta información ya existe en el sistema.";

      case "invalid-argument":
        return "Datos inválidos. Verifica la información ingresada.";

      case "failed-precondition":
        return "No se puede completar la operación en este momento.";

      case "unauthenticated":
        return "Sesión expirada. Inicia sesión nuevamente.";

      default:
        return "Error al procesar la solicitud. Intenta nuevamente.";
    }
  }

  // Manejador de errores generales
  static handleGeneralError(error: any, context: string = "APP"): string {
    if (__DEV__) {
      console.log(`[${context}] General error details:`, {
        name: error.name,
        message: error.message,
        timestamp: new Date().toISOString(),
        stack: error.stack,
      });
    }

    // revisa errores de red
    if (
      error.message?.includes("Network") ||
      error.message?.includes("fetch")
    ) {
      return "Error de conexión. Verifica tu internet e intenta nuevamente.";
    }

    // revisa errores de validación
    if (
      error.message?.includes("validation") ||
      error.message?.includes("invalid")
    ) {
      return "Datos inválidos. Verifica la información ingresada.";
    }

    // Mensaje genérico por defecto
    return "Ocurrió un error inesperado. Intenta nuevamente.";
  }

  // Manejador de errores de Cloud Functions
  static handleFunctionsError(
    error: any,
    context: string = "FUNCTIONS"
  ): string {
    if (__DEV__) {
      console.log(`[${context}] Functions error details:`, {
        code: error.code,
        message: error.message,
        details: error.details,
        timestamp: new Date().toISOString(),
      });
    }

    switch (error.code) {
      case "functions/deadline-exceeded":
        return "La operación tardó demasiado. Intenta nuevamente.";

      case "functions/permission-denied":
        return "No tienes permisos para esta función.";

      case "functions/unauthenticated":
        return "Sesión expirada. Inicia sesión nuevamente.";

      case "functions/unavailable":
        return "Servicio no disponible. Intenta más tarde.";

      case "functions/invalid-argument":
        return "Datos inválidos en la solicitud.";

      default:
        return "Error en el servidor. Intenta nuevamente.";
    }
  }

  // Registro de eventos de seguridad
  static logSecurityEvent(event: string, details: any): void {
    const securityLog = {
      event,
      details,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent || "Unknown",
      sessionId: this.getSessionId(),
    };

    if (__DEV__) {
      console.log("[SECURITY]", securityLog);
    }

    this.storeSecurityLog(securityLog);
  }

  private static getSessionId(): string {
    let sessionId = sessionStorage.getItem("bamx_session_id");
    if (!sessionId) {
      sessionId = this.generateSessionId();
      sessionStorage.setItem("bamx_session_id", sessionId);
    }
    return sessionId;
  }

  // Genera un ID de sesión único
  private static generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Almacena los logs de seguridad en el almacenamiento local
  private static storeSecurityLog(log: any): void {
    try {
      const existingLogs = JSON.parse(
        localStorage.getItem("bamx_security_logs") || "[]"
      );
      existingLogs.push(log);

      // Mantiene solo los últimos 100 logs
      if (existingLogs.length > 100) {
        existingLogs.splice(0, existingLogs.length - 100);
      }

      localStorage.setItem("bamx_security_logs", JSON.stringify(existingLogs));
    } catch (error) {
      console.warn("Failed to store security log:", error);
    }
  }
}
