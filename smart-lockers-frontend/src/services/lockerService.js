// src/services/lockerService.js
import api from './api';

export const lockerService = {
  // Obtener todos los lockers
  async getLockers() {
    try {
      const response = await api.get('/lockers');
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener lockers: ' + (error.response?.data?.message || error.message));
    }
  },

  // Obtener estadísticas de lockers
  async getLockerStats() {
    try {
      const response = await api.get('/lockers/stats');
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener estadísticas: ' + (error.response?.data?.message || error.message));
    }
  },

  // Crear un nuevo locker
  async createLocker(lockerData) {
    try {
      const response = await api.post('/lockers', lockerData);
      return response.data;
    } catch (error) {
      throw new Error('Error al crear locker: ' + (error.response?.data?.message || error.message));
    }
  },

  // Obtener locker por ID
  async getLockerById(id) {
    try {
      const response = await api.get(`/lockers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener locker: ' + (error.response?.data?.message || error.message));
    }
  },

  // Asignar locker a usuario
  async assignLocker(userId, lockerId = null) {
    try {
      const response = await api.post('/lockers/assign', {
        userId,
        lockerId
      });
      return response.data;
    } catch (error) {
      throw new Error('Error al asignar locker: ' + (error.response?.data?.message || error.message));
    }
  },

  // Liberar locker
  async releaseLocker(lockerId, adminRelease = false) {
    try {
      const response = await api.post(`/lockers/${lockerId}/release`, {
        adminRelease
      });
      return response.data;
    } catch (error) {
      throw new Error('Error al liberar locker: ' + (error.response?.data?.message || error.message));
    }
  },

  // Actualizar peso del locker
  async updateWeight(lockerId, weight) {
    try {
      const response = await api.patch(`/lockers/${lockerId}/weight`, {
        weight
      });
      return response.data;
    } catch (error) {
      throw new Error('Error al actualizar peso: ' + (error.response?.data?.message || error.message));
    }
  },

  // Apertura de emergencia
  async emergencyOpen(lockerId) {
    try {
      const response = await api.post(`/lockers/${lockerId}/emergency`);
      return response.data;
    } catch (error) {
      throw new Error('Error en apertura de emergencia: ' + (error.response?.data?.message || error.message));
    }
  },
  async getAllLogs(limit = 100) {
    try {
      const response = await api.get(`/lockers/logs/all?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener logs: ' + (error.response?.data?.message || error.message));
    }
  }
};