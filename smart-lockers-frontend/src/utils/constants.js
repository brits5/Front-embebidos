export const LOCKER_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  RESERVED: 'reserved',
  MAINTENANCE: 'maintenance'
};

export const LOCKER_STATUS_COLORS = {
  [LOCKER_STATUS.AVAILABLE]: 'bg-green-100 text-green-800 border-green-200',
  [LOCKER_STATUS.OCCUPIED]: 'bg-red-100 text-red-800 border-red-200',
  [LOCKER_STATUS.RESERVED]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [LOCKER_STATUS.MAINTENANCE]: 'bg-gray-100 text-gray-800 border-gray-200'
};

export const LOCKER_STATUS_LABELS = {
  [LOCKER_STATUS.AVAILABLE]: 'Disponible',
  [LOCKER_STATUS.OCCUPIED]: 'Ocupado',
  [LOCKER_STATUS.RESERVED]: 'Reservado',
  [LOCKER_STATUS.MAINTENANCE]: 'Mantenimiento'
};

export const USER_ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin'
};

export const USER_ROLE_LABELS = {
  [USER_ROLES.STUDENT]: 'Estudiante',
  [USER_ROLES.TEACHER]: 'Profesor',
  [USER_ROLES.ADMIN]: 'Administrador'
};