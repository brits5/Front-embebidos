import { useState, useEffect, useCallback } from 'react';
import { lockerService } from '../services/lockerService';
import { useSocket } from './useSocket';
import { toast } from 'react-toastify';

export const useLockers = () => {
  const [lockers, setLockers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    occupied: 0,
    reserved: 0,
    maintenance: 0,
    utilization: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { on, off } = useSocket();

  // Cargar lockers iniciales
  const fetchLockers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [lockersData, statsData] = await Promise.all([
        lockerService.getLockers(),
        lockerService.getLockerStats()
      ]);
      setLockers(lockersData);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
      toast.error('Error al cargar lockers: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar locker específico
  const updateLocker = useCallback((updatedLocker) => {
    setLockers(prev => 
      prev.map(locker => 
        locker.id === updatedLocker.id ? updatedLocker : locker
      )
    );
  }, []);

  // Asignar locker
  const assignLocker = useCallback(async (userId, lockerId = null) => {
    try {
      const result = await lockerService.assignLocker(userId, lockerId);
      updateLocker(result);
      toast.success(`Locker ${result.locker_number} asignado correctamente`);
      return result;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  }, [updateLocker]);

  // Liberar locker
  const releaseLocker = useCallback(async (lockerId, adminRelease = false) => {
    try {
      const result = await lockerService.releaseLocker(lockerId, adminRelease);
      updateLocker(result);
      toast.success(`Locker ${result.locker_number} liberado correctamente`);
      return result;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  }, [updateLocker]);

  // Actualizar peso
  const updateWeight = useCallback(async (lockerId, weight) => {
    try {
      const result = await lockerService.updateWeight(lockerId, weight);
      updateLocker(result);
      return result;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  }, [updateLocker]);

  // Apertura de emergencia
  const emergencyOpen = useCallback(async (lockerId) => {
    try {
      const result = await lockerService.emergencyOpen(lockerId);
      updateLocker(result);
      toast.warning(`Apertura de emergencia activada en ${result.locker_number}`);
      return result;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  }, [updateLocker]);

  // Efectos para WebSocket
  useEffect(() => {
    const handleLockerUpdate = (updatedLocker) => {
      updateLocker(updatedLocker);
    };

    const handleRfidResult = (result) => {
      if (result.success) {
        toast.success(`RFID procesado: ${result.user_name} - ${result.locker_number}`);
        // Refrescar datos después de procesamiento RFID
        fetchLockers();
      } else {
        toast.error(`Error RFID: ${result.message}`);
      }
    };

    on('locker_updated', handleLockerUpdate);
    on('rfid_scan_result', handleRfidResult);

    return () => {
      off('locker_updated', handleLockerUpdate);
      off('rfid_scan_result', handleRfidResult);
    };
  }, [on, off, updateLocker, fetchLockers]);

  // Cargar datos iniciales
  useEffect(() => {
    fetchLockers();
  }, [fetchLockers]);

  // Refrescar estadísticas periódicamente
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const newStats = await lockerService.getLockerStats();
        setStats(newStats);
      } catch (err) {
        console.error('Error actualizando estadísticas:', err);
      }
    }, 30000); // Cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  return {
    lockers,
    stats,
    loading,
    error,
    fetchLockers,
    assignLocker,
    releaseLocker,
    updateWeight,
    emergencyOpen,
    updateLocker
  };
};
