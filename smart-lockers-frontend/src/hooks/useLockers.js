// src/hooks/useLockers.js
import { useState, useEffect, useCallback } from 'react';
import { lockerService } from '../services/lockerService';
import { useSocket } from './useSocket';

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
      console.log('🔄 Cargando lockers...');
      
      const [lockersData, statsData] = await Promise.all([
        lockerService.getLockers(),
        lockerService.getLockerStats()
      ]);
      
      console.log('✅ Lockers cargados:', lockersData);
      console.log('✅ Stats cargadas:', statsData);
      
      setLockers(lockersData || []);
      setStats(statsData || {
        total: 0,
        available: 0,
        occupied: 0,
        reserved: 0,
        maintenance: 0,
        utilization: 0
      });
    } catch (err) {
      console.error('❌ Error cargando lockers:', err);
      setError(err.message);
      
      // Datos de fallback para desarrollo
      setLockers([]);
      setStats({
        total: 0,
        available: 0,
        occupied: 0,
        reserved: 0,
        maintenance: 0,
        utilization: 0
      });
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
      console.log(`✅ Locker ${result.locker_number} asignado correctamente`);
      return result;
    } catch (err) {
      console.error('❌ Error asignando locker:', err);
      throw err;
    }
  }, [updateLocker]);

  // Liberar locker
  const releaseLocker = useCallback(async (lockerId, adminRelease = false) => {
    try {
      const result = await lockerService.releaseLocker(lockerId, adminRelease);
      updateLocker(result);
      console.log(`✅ Locker ${result.locker_number} liberado correctamente`);
      return result;
    } catch (err) {
      console.error('❌ Error liberando locker:', err);
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
      console.error('❌ Error actualizando peso:', err);
      throw err;
    }
  }, [updateLocker]);

  // Apertura de emergencia
  const emergencyOpen = useCallback(async (lockerId) => {
    try {
      const result = await lockerService.emergencyOpen(lockerId);
      updateLocker(result);
      console.log(`⚠️ Apertura de emergencia activada en ${result.locker_number}`);
      return result;
    } catch (err) {
      console.error('❌ Error en apertura de emergencia:', err);
      throw err;
    }
  }, [updateLocker]);

  // Cargar datos iniciales
  useEffect(() => {
    fetchLockers();
  }, [fetchLockers]);

  // Efectos para WebSocket (opcional, por ahora comentado)
  /*
  useEffect(() => {
    const handleLockerUpdate = (updatedLocker) => {
      updateLocker(updatedLocker);
    };

    const handleRfidResult = (result) => {
      if (result.success) {
        console.log(`RFID procesado: ${result.user_name} - ${result.locker_number}`);
        fetchLockers();
      } else {
        console.error(`Error RFID: ${result.message}`);
      }
    };

    on('locker_updated', handleLockerUpdate);
    on('rfid_scan_result', handleRfidResult);

    return () => {
      off('locker_updated', handleLockerUpdate);
      off('rfid_scan_result', handleRfidResult);
    };
  }, [on, off, updateLocker, fetchLockers]);
  */

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