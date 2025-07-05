export const errorMessages = {
  NoSuchBucket: 'El bucket especificado no existe.',
  NoSuchKey: 'La clave especificada no existe.',
  InvalidJWT: 'El token JWT proporcionado es inválido.',
  InvalidRequest: 'La solicitud no está correctamente formada.',
  EntityTooLarge: 'El archivo que intentas subir es demasiado grande.',
  InternalError: 'Ocurrió un error interno en el servidor.',
  ResourceAlreadyExists: 'El recurso especificado ya existe.',
  InvalidBucketName: 'El nombre del bucket especificado es inválido.',
  'Invalid login credentials': 'Las credenciales de inicio de sesión son incorrectas.',
  'Email not confirmed': 'La dirección de correo electrónico no ha sido confirmada.',
  'User already registered': 'El usuario ya está registrado.',
  'Invalid OTP': 'El código OTP es inválido o ha expirado.',
  'User not found': 'No se encontró un usuario con las credenciales proporcionadas.',
  'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres.',
  'Invalid JWT': 'El token JWT es inválido o ha expirado.',
  'Access denied': 'Acceso denegado al recurso solicitado.',
  'Invalid request': 'La solicitud es inválida o está malformada.',
  'Internal server error': 'Ocurrió un error interno en el servidor.',
  'Email link is invalid or has expired':
    'El enlace de restablecimiento de contraseña es inválido o ha expirado.',
  'New password should be different from the old password.':
    'La nueva contraseña debe ser diferente a la anterior.'
}

export function translateError(errorMessage: string) {
  return errorMessages[errorMessage] || 'Ocurrió un error inesperado'
}

/**
 * Traduce errores de Supabase al español
 * @param errorMessage - Mensaje de error en inglés
 * @returns Mensaje de error traducido al español
 */
export const translateSupabaseError = (errorMessage: string): string => {
  const errorTranslations: Record<string, string> = {
    'Invalid login credentials': 'Credenciales de inicio de sesión inválidas',
    'Email not confirmed': 'Email no confirmado',
    'User not found': 'Usuario no encontrado',
    'Invalid email or password': 'Email o contraseña inválidos',
    'Too many requests': 'Demasiadas solicitudes. Intenta nuevamente en unos minutos',
    'Email already registered': 'Este email ya está registrado',
    'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
    'Unable to validate email address: invalid format': 'Formato de email inválido',
    'User already registered': 'Usuario ya registrado',
    'Signup is disabled': 'El registro está deshabilitado',
    'Account not found': 'Cuenta no encontrada',
    'Invalid recovery token': 'Token de recuperación inválido',
    'Token has expired': 'El token ha expirado',
    'New password should be different from the old password':
      'La nueva contraseña debe ser diferente a la anterior',
    'Password should be at least 8 characters': 'La contraseña debe tener al menos 8 caracteres'
  }

  // Buscar traducción exacta
  if (errorTranslations[errorMessage]) {
    return errorTranslations[errorMessage]
  }

  // Si no hay traducción exacta, buscar por palabras clave
  const lowerError = errorMessage.toLowerCase()

  if (lowerError.includes('invalid login credentials')) {
    return 'Credenciales de inicio de sesión inválidas'
  }

  if (lowerError.includes('email not confirmed')) {
    return 'Email no confirmado'
  }

  if (lowerError.includes('user not found')) {
    return 'Usuario no encontrado'
  }

  if (lowerError.includes('invalid email') || lowerError.includes('invalid password')) {
    return 'Email o contraseña inválidos'
  }

  if (lowerError.includes('too many requests')) {
    return 'Demasiadas solicitudes. Intenta nuevamente en unos minutos'
  }

  if (lowerError.includes('already registered')) {
    return 'Este email ya está registrado'
  }

  // Si no se encuentra traducción, devolver el mensaje original
  return errorMessage
}
