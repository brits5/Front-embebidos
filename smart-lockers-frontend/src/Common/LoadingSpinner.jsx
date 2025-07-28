import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}></div>
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;

// src/components/Common/StatusBadge.jsx
import React from 'react';
import { LOCKER_STATUS_COLORS, LOCKER_STATUS_LABELS } from '../../utils/constants';

export const StatusBadge = ({ status, size = 'medium' }) => {
  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-2 text-base'
  };

  const colorClass = LOCKER_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  const label = LOCKER_STATUS_LABELS[status] || status;

  return (
    <span className={`inline-flex items-center rounded-full font-medium border ${colorClass} ${sizeClasses[size]}`}>
      {label}
    </span>
  );
};
