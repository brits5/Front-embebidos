 //src/services/rfidService.js
import api from './api';

export const rfidService = {
  // Procesar escaneo RFID
  async processScan(rfidUid) {
    try {
      const response = await api.post('/rfid/scan', {
        rfid_uid: rfidUid
      });
      return response.data;
    } catch (error) {
      throw new Error('Error al procesar RFID: ' + (error.response?.data?.message || error.message));
    }
  },

  // Probar escaneo RFID (para desarrollo)
  async testScan(rfidUid) {
    try {
      const response = await api.get(`/rfid/test/${rfidUid}`);
      return response.data;
    } catch (error) {
      throw new Error('Error en prueba RFID: ' + (error.response?.data?.message || error.message));
    }
  }
};