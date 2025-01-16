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
  'Email link is invalid or has expired': 'El enlace de restablecimiento de contraseña es inválido o ha expirado.',
}

export function translateError(errorMessage: string) {
  return errorMessages[errorMessage] || 'Ocurrió un error inesperado'
}
