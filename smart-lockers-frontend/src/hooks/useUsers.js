import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';
import { toast } from 'react-toastify';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar usuarios
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await userService.getUsers();
      setUsers(userData);
    } catch (err) {
      setError(err.message);
      toast.error('Error al cargar usuarios: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear usuario
  const createUser = useCallback(async (userData) => {
    try {
      const newUser = await userService.createUser(userData);
      setUsers(prev => [...prev, newUser]);
      toast.success('Usuario creado correctamente');
      return newUser;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  }, []);

  // Actualizar usuario
  const updateUser = useCallback(async (id, userData) => {
    try {
      const updatedUser = await userService.updateUser(id, userData);
      setUsers(prev => 
        prev.map(user => user.id === id ? updatedUser : user)
      );
      toast.success('Usuario actualizado correctamente');
      return updatedUser;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  }, []);

  // Eliminar usuario
  const deleteUser = useCallback(async (id) => {
    try {
      await userService.deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
      toast.success('Usuario eliminado correctamente');
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  }, []);

  // Buscar usuario por RFID
  const findUserByRfid = useCallback(async (rfidUid) => {
    try {
      const user = await userService.getUserByRfid(rfidUid);
      return user;
    } catch (err) {
      throw err;
    }
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    findUserByRfid
  };
};