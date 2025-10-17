/**
 * Secure Error Handler - OWASP MSTG-STORAGE-3 Compliance
 * Prevents sensitive information disclosure through error messages
 */
export class SecureErrorHandler {
  
  /**
   * Handle Firebase Authentication errors securely
   * @param error - Firebase Auth error object
   * @param context - Context where error occurred (for logging)
   * @returns User-friendly error message
   */
  static handleAuthError(error: any, context: string = 'AUTH'): string {
    // Log detailed error only in development
    if (__DEV__) {
      console.log(`[${context}] Auth error details:`, {
        code: error.code,
        message: error.message,
        timestamp: new Date().toISOString(),
        stack: error.stack
      });
    }

    // Return generic user-friendly messages based on error code
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
      case 'auth/invalid-email':
        return 'Credenciales incorrectas. Verifica tu email y contraseña.';
      
      case 'auth/user-disabled':
        return 'Esta cuenta ha sido deshabilitada. Contacta al administrador.';
      
      case 'auth/too-many-requests':
        return 'Demasiados intentos fallidos. Intenta nuevamente en unos minutos.';
      
      case 'auth/network-request-failed':
        return 'Error de conexión. Verifica tu conexión a internet.';
      
      case 'auth/email-already-in-use':
        return 'Este email ya está registrado. Intenta iniciar sesión.';
      
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres.';
      
      case 'auth/operation-not-allowed':
        return 'Operación no permitida. Contacta al administrador.';
      
      case 'auth/requires-recent-login':
        return 'Por seguridad, inicia sesión nuevamente para continuar.';
      
      default:
        return 'Error de autenticación. Intenta nuevamente.';
    }
  }

  /**
   * Handle Firestore database errors securely
   * @param error - Firestore error object
   * @param context - Context where error occurred
   * @returns User-friendly error message
   */
  static handleFirestoreError(error: any, context: string = 'FIRESTORE'): string {
    if (__DEV__) {
      console.log(`[${context}] Firestore error details:`, {
        code: error.code,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }

    switch (error.code) {
      case 'permission-denied':
        return 'No tienes permisos para realizar esta acción.';
      
      case 'unavailable':
        return 'Servicio temporalmente no disponible. Intenta más tarde.';
      
      case 'deadline-exceeded':
        return 'La operación tardó demasiado. Verifica tu conexión.';
      
      case 'not-found':
        return 'La información solicitada no fue encontrada.';
      
      case 'already-exists':
        return 'Esta información ya existe en el sistema.';
      
      case 'invalid-argument':
        return 'Datos inválidos. Verifica la información ingresada.';
      
      case 'failed-precondition':
        return 'No se puede completar la operación en este momento.';
      
      case 'unauthenticated':
        return 'Sesión expirada. Inicia sesión nuevamente.';
      
      default:
        return 'Error al procesar la solicitud. Intenta nuevamente.';
    }
  }

  /**
   * Handle general application errors
   * @param error - Any error object
   * @param context - Context where error occurred
   * @returns User-friendly error message
   */
  static handleGeneralError(error: any, context: string = 'APP'): string {
    if (__DEV__) {
      console.log(`[${context}] General error details:`, {
        name: error.name,
        message: error.message,
        timestamp: new Date().toISOString(),
        stack: error.stack
      });
    }

    // Check for network-related errors
    if (error.message?.includes('Network') || error.message?.includes('fetch')) {
      return 'Error de conexión. Verifica tu internet e intenta nuevamente.';
    }

    // Check for validation errors
    if (error.message?.includes('validation') || error.message?.includes('invalid')) {
      return 'Datos inválidos. Verifica la información ingresada.';
    }

    // Default generic message
    return 'Ocurrió un error inesperado. Intenta nuevamente.';
  }

  /**
   * Handle Cloud Functions errors
   * @param error - Functions error object
   * @param context - Context where error occurred
   * @returns User-friendly error message
   */
  static handleFunctionsError(error: any, context: string = 'FUNCTIONS'): string {
    if (__DEV__) {
      console.log(`[${context}] Functions error details:`, {
        code: error.code,
        message: error.message,
        details: error.details,
        timestamp: new Date().toISOString()
      });
    }

    switch (error.code) {
      case 'functions/deadline-exceeded':
        return 'La operación tardó demasiado. Intenta nuevamente.';
      
      case 'functions/permission-denied':
        return 'No tienes permisos para esta función.';
      
      case 'functions/unauthenticated':
        return 'Sesión expirada. Inicia sesión nuevamente.';
      
      case 'functions/unavailable':
        return 'Servicio no disponible. Intenta más tarde.';
      
      case 'functions/invalid-argument':
        return 'Datos inválidos en la solicitud.';
      
      default:
        return 'Error en el servidor. Intenta nuevamente.';
    }
  }

  /**
   * Log security events (for audit trails)
   * @param event - Security event type
   * @param details - Event details
   */
  static logSecurityEvent(event: string, details: any): void {
    const securityLog = {
      event,
      details,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent || 'Unknown',
      sessionId: this.getSessionId()
    };

    if (__DEV__) {
      console.log('[SECURITY]', securityLog);
    }

    // In production, this would be sent to a secure logging service
    // For now, we'll store it locally for debugging
    this.storeSecurityLog(securityLog);
  }

  /**
   * Get current session ID for tracking
   */
  private static getSessionId(): string {
    // Generate or retrieve session ID
    let sessionId = sessionStorage.getItem('bamx_session_id');
    if (!sessionId) {
      sessionId = this.generateSessionId();
      sessionStorage.setItem('bamx_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Generate unique session ID
   */
  private static generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Store security log locally
   * @param log - Security log entry
   */
  private static storeSecurityLog(log: any): void {
    try {
      const existingLogs = JSON.parse(localStorage.getItem('bamx_security_logs') || '[]');
      existingLogs.push(log);
      
      // Keep only last 100 logs
      if (existingLogs.length > 100) {
        existingLogs.splice(0, existingLogs.length - 100);
      }
      
      localStorage.setItem('bamx_security_logs', JSON.stringify(existingLogs));
    } catch (error) {
      console.warn('Failed to store security log:', error);
    }
  }
}