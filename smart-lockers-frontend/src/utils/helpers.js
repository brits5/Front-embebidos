export const generateRandomRfid = () => {
  return Math.random().toString(36).substring(2, 12).toUpperCase();
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[+]?[1-9][\d\s\-()]+$/;
  return re.test(phone) && phone.length >= 10;
};

export const getLockerStatusIcon = (status) => {
  switch (status) {
    case 'available':
      return '🟢';
    case 'occupied':
      return '🔴';
    case 'reserved':
      return '🟡';
    case 'maintenance':
      return '🔧';
    default:
      return '❓';
  }
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};