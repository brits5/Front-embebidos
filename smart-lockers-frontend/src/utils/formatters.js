import { format, formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (date) => {
  if (!date) return 'N/A';
  try {
    return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: es });
  } catch (error) {
    return 'Fecha inválida';
  }
};

export const formatDateShort = (date) => {
  if (!date) return 'N/A';
  try {
    return format(new Date(date), 'dd/MM/yyyy', { locale: es });
  } catch (error) {
    return 'Fecha inválida';
  }
};

export const formatTimeAgo = (date) => {
  if (!date) return 'N/A';
  try {
    return formatDistance(new Date(date), new Date(), { 
      addSuffix: true, 
      locale: es 
    });
  } catch (error) {
    return 'Tiempo inválido';
  }
};

export const formatWeight = (weight) => {
  if (weight === null || weight === undefined) return '0g';
  return `${Number(weight).toFixed(1)}g`;
};

export const formatPercentage = (value, total) => {
  if (!total || total === 0) return '0%';
  return `${((value / total) * 100).toFixed(1)}%`;
};