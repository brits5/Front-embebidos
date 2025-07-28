import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Weight, Clock, Activity, Lock, Unlock, AlertTriangle } from 'lucide-react';
import { lockerService } from '../../services/lockerService';
import { useLockers } from '../../hooks/useLockers';
import StatusBadge from '../Common/StatusBadge';
import LoadingSpinner from '../Common/LoadingSpinner';
import { formatDate, formatWeight, formatTimeAgo } from '../../utils/formatters';

const LockerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { releaseLocker, emergencyOpen } = useLockers();
  const [locker, setLocker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocker = async () => {
      try {
        setLoading(true);
        const lockerData = await lockerService.getLockerById(parseInt(id));
        setLocker(lockerData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLocker();
    }
  }, [id]);

  const handleRelease = async () => {
    if (window.confirm(`¿Confirmar liberación del locker ${locker.locker_number}?`)) {
      try {
        await releaseLocker(locker.id, true);
        // Refrescar datos
        const updatedLocker = await lockerService.getLockerById(locker.id);
        setLocker(updatedLocker);
      } catch (error) {
        console.error('Error liberando locker:', error);
      }
    }
  };

  const handleEmergency = async () => {
    if (window.confirm(`¿Confirmar apertura de emergencia del locker ${locker.locker_number}?`)) {
      try {
        await emergencyOpen(locker.id);
        // Refrescar datos
        const updatedLocker = await lockerService.getLockerById(locker.id);
        setLocker(updatedLocker);
      } catch (error) {
        console.error('Error en apertura de emergencia:', error);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner size="large" text="Cargando detalles del locker..." />;
  }

  if (error || !locker) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium">Error al cargar locker</div>
        <div className="text-gray-600 mt-2">{error || 'Locker no encontrado'}</div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="mt-4 btn-primary"
        >
          Volver al Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Locker {locker.locker_number}
            </h1>
            <p className="text-gray-600">Detalles y gestión del locker</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {locker.is_locked ? (
            <Lock className="w-5 h-5 text-red-500" />
          ) : (
            <Unlock className="w-5 h-5 text-green-500" />
          )}
          <StatusBadge status={locker.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold">Información Básica</h2>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Número</label>
                  <p className="text-lg font-semibold">{locker.locker_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Estado</label>
                  <div className="mt-1">
                    <StatusBadge status={locker.status} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Ubicación</label>
                  <p className="text-gray-900">{locker.location || 'No especificada'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Peso Actual</label>
                  <div className="flex items-center">
                    <Weight className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-gray-900">{formatWeight(locker.current_weight)}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Umbral de Peso</label>
                  <p className="text-gray-900">{formatWeight(locker.weight_threshold)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Bloqueado</label>
                  <p className={`font-medium ${locker.is_locked ? 'text-red-600' : 'text-green-600'}`}>
                    {locker.is_locked ? 'Sí' : 'No'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* User Info Card */}
          {locker.current_user && (
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Usuario Asignado
                </h2>
              </div>
              <div className="card-body">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium text-lg">
                      {locker.current_user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{locker.current_user.name}</h3>
                    <p className="text-gray-600">{locker.current_user.email}</p>
                    <p className="text-sm text-gray-500">RFID: {locker.current_user.rfid_uid}</p>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Teléfono</label>
                    <p className="text-gray-900">{locker.current_user.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Rol</label>
                    <p className="text-gray-900 capitalize">{locker.current_user.role}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Asignado</label>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-gray-900">{formatTimeAgo(locker.assigned_at)}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Último Escaneo</label>
                    <p className="text-gray-900 font-mono text-sm">{locker.last_rfid_scan || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activity Logs */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Actividad Reciente
              </h2>
            </div>
            <div className="card-body">
              {locker.logs && locker.logs.length > 0 ? (
                <div className="space-y-3">
                  {locker.logs.slice(0, 10).map((log, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {log.action.replace('_', ' ')}
                        </p>
                        {log.user && (
                          <p className="text-xs text-gray-500">{log.user.name}</p>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTimeAgo(log.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Sin actividad registrada</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold">Acciones Rápidas</h2>
            </div>
            <div className="card-body space-y-3">
              {locker.current_user && (
                <button
                  onClick={handleRelease}
                  className="w-full btn-primary"
                >
                  Liberar Locker
                </button>
              )}
              
              <button
                onClick={handleEmergency}
                className="w-full flex items-center justify-center btn-danger"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Apertura de Emergencia
              </button>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold">Estado del Sistema</h2>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Conexión</span>
                  <span className="text-sm font-medium text-green-600">Conectado</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sensor de Peso</span>
                  <span className="text-sm font-medium text-green-600">Activo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">RFID</span>
                  <span className="text-sm font-medium text-green-600">Funcionando</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">LED Matrix</span>
                  <span className="text-sm font-medium text-green-600">OK</span>
                </div>
              </div>
            </div>
          </div>

          {/* Information */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold">Información</h2>
            </div>
            <div className="card-body">
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Creado:</span> {formatDate(locker.created_at)}
                </div>
                <div>
                  <span className="font-medium">Actualizado:</span> {formatDate(locker.updated_at)}
                </div>
                <div>
                  <span className="font-medium">ID:</span> {locker.id}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockerDetails;
