import { useState, useCallback } from 'react';
import { rfidService } from '../services/rfidService';
import { useSocket } from './useSocket';
import { toast } from 'react-toastify';

export const useRfid = () => {
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState(null);
  
  const { on, off, emit } = useSocket();

  // Procesar escaneo RFID
  const processScan = useCallback(async (rfidUid) => {
    try {
      setScanning(true);
      const result = await rfidService.processScan(rfidUid);
      setLastScan({
        rfid_uid: rfidUid,
        result,
        timestamp: new Date()
      });
      return result;
    } catch (err) {
      toast.error(err.message);
      throw err;
    } finally {
      setScanning(false);
    }
  }, []);

  // Simular escaneo (para pruebas)
  const simulateScan = useCallback(async (rfidUid) => {
    try {
      const result = await rfidService.testScan(rfidUid);
      setLastScan({
        rfid_uid: rfidUid,
        result,
        timestamp: new Date(),
        simulated: true
      });
      return result;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  }, []);

  // Enviar comando al ESP32
  const sendCommand = useCallback((lockerId, command, data = null) => {
    emit('esp32_command', {
      lockerId,
      command,
      data,
      timestamp: new Date().toISOString()
    });
  }, [emit]);

  return {
    scanning,
    lastScan,
    processScan,
    simulateScan,
    sendCommand
  };
};