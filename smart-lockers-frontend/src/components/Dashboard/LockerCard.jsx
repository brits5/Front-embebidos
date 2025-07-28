import React from 'react';
import { User, Scale, Lock, Unlock } from 'lucide-react';
import StatusBadge from '../Common/StatusBadge';
import { formatWeight, formatTimeAgo } from '../../utils/formatters';
import { useLockers } from '../../hooks/useLockers';

const LockerCard = ({ locker, isSelected, onClick }) => {
  const { releaseLocker, emergencyOpen } = useLockers();

  const handleRelease = async (e) => {
    e.stopPropagation();
    if (window.confirm(`¿Confirmar liberación del locker ${locker.locker_number}?`)) {
      try {
        await releaseLocker(locker.id, true);
      } catch (error) {
        console.error('Error liberando locker:', error);
      }
    }
  };

  const handleEmergency = async (e) => {
    e.stopPropagation();
    if (window.confirm(`¿Confirmar apertura de emergencia del locker ${locker.locker_number}?`)) {
      try {
        await emergencyOpen(locker.id);
      } catch (error) {
        console.error('Error en apertura de emergencia:', error);
      }
    }
  };

  return (
    <div 
      className={`bg-white border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200'
      }`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">{locker.locker_number}</h3>
        <div className="flex items-center">
          {locker.is_locked ? (
            <Lock className="w-4 h-4 text-red-500" />
          ) : (
            <Unlock className="w-4 h-4 text-green-500" />
          )}
        </div>
      </div>

      {/* Status */}
      <div className="mb-3">
        <StatusBadge status={locker.status} size="small" />
      </div>

      {/* User Info */}
      {locker.current_user && (
        <div className="flex items-center mb-2 text-sm text-gray-600">
          <User className="w-4 h-4 mr-1" />
          <span className="truncate">{locker.current_user.name}</span>
        </div>
      )}

      {/* Location */}
      {locker.location && (
        <div className="text-xs text-gray-500 mb-2">
          📍 {locker.location}
        </div>
      )}

      {/* Weight */}
      <div className="flex items-center mb-2 text-sm text-gray-600">
        <Scale className="w-4 h-4 mr-1" />
        <span>{formatWeight(locker.current_weight)}</span>
      </div>

      {/* Assigned time */}
      {locker.assigned_at && (
        <div className="text-xs text-gray-500 mb-3">
          Asignado: {formatTimeAgo(locker.assigned_at)}
        </div>
      )}

      {/* Actions */}
      {locker.current_user && (
        <div className="flex space-x-1">
          <button
            onClick={handleRelease}
            className="flex-1 px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
          >
            Liberar
          </button>
          <button
            onClick={handleEmergency}
            className="flex-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
          >
            Emergencia
          </button>
        </div>
      )}
    </div>
  );
};

export default LockerCard;