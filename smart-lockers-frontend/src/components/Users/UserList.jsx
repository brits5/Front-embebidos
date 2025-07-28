import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, CreditCard } from 'lucide-react';
import { useUsers } from '../../hooks/useUsers';
import UserForm from './UserForm';
import Modal from '../Common/Modal';
import LoadingSpinner from '../Common/LoadingSpinner';
import { formatDate, formatTimeAgo } from '../../utils/formatters';
import { USER_ROLE_LABELS } from '../../utils/constants';

const UserList = () => {
  const { users, loading, error, createUser, updateUser, deleteUser } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.rfid_uid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateUser = () => {
    setSelectedUser(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`¿Confirmar eliminación del usuario ${user.name}?`)) {
      try {
        await deleteUser(user.id);
      } catch (error) {
        console.error('Error eliminando usuario:', error);
      }
    }
  };

  const handleSubmit = async (userData) => {
    try {
      if (modalMode === 'create') {
        await createUser(userData);
      } else {
        await updateUser(selectedUser.id, userData);
      }
      setShowModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error guardando usuario:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner size="large" text="Cargando usuarios..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium">Error al cargar usuarios</div>
        <div className="text-gray-600 mt-2">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-600">Gestión de usuarios y tarjetas RFID</p>
        </div>
        <button
          onClick={handleCreateUser}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar usuarios por nombre, email o RFID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Lista de Usuarios ({filteredUsers.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  RFID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Locker Asignado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const currentLocker = user.lockers?.find(l => l.current_user?.id === user.id);
                
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-medium text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CreditCard className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm font-mono text-gray-900">{user.rfid_uid}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.phone}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {USER_ROLE_LABELS[user.role] || user.role}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {currentLocker ? (
                        <span className="font-medium">{currentLocker.locker_number}</span>
                      ) : (
                        <span className="text-gray-400">Sin asignar</span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTimeAgo(user.created_at)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron usuarios</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedUser(null);
        }}
        title={modalMode === 'create' ? 'Nuevo Usuario' : 'Editar Usuario'}
        size="medium"
      >
        <UserForm
          user={selectedUser}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowModal(false);
            setSelectedUser(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default UserList;