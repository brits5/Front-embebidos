// src/services/userService.js
import api from './api';

export const userService = {
  // Obtener todos los usuarios
  async getUsers() {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener usuarios: ' + (error.response?.data?.message || error.message));
    }
  },

  // Crear un nuevo usuario
  async createUser(userData) {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      throw new Error('Error al crear usuario: ' + (error.response?.data?.message || error.message));
    }
  },

  // Obtener usuario por ID
  async getUserById(id) {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener usuario: ' + (error.response?.data?.message || error.message));
    }
  },

  // Buscar usuario por RFID
  async getUserByRfid(rfidUid) {
    try {
      const response = await api.get(`/users/rfid/${rfidUid}`);
      return response.data;
    } catch (error) {
      throw new Error('Usuario no encontrado: ' + (error.response?.data?.message || error.message));
    }
  },

  // Actualizar usuario
  async updateUser(id, userData) {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw new Error('Error al actualizar usuario: ' + (error.response?.data?.message || error.message));
    }
  },

  // Eliminar usuario
  async deleteUser(id) {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al eliminar usuario: ' + (error.response?.data?.message || error.message));
    }
  }
};