// src/components/Common/StatusBadge.jsx
import React from 'react';
import { LOCKER_STATUS_COLORS, LOCKER_STATUS_LABELS } from '../../utils/constants';

const StatusBadge = ({ status, size = 'medium' }) => {
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

export default StatusBadge;