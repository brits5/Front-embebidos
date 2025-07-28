import React, { useState, useEffect } from 'react';
import { CreditCard, User, Mail, Phone, UserCheck } from 'lucide-react';
import { validateEmail, validatePhone, generateRandomRfid } from '../../utils/helpers';
import { USER_ROLES } from '../../utils/constants';

const UserForm = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    rfid_uid: '',
    role: USER_ROLES.STUDENT
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        rfid_uid: user.rfid_uid || '',
        role: user.role || USER_ROLES.STUDENT
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Teléfono inválido';
    }

    if (!formData.rfid_uid.trim()) {
      newErrors.rfid_uid = 'El UID RFID es requerido';
    } else if (formData.rfid_uid.length < 6) {
      newErrors.rfid_uid = 'El UID debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error al guardar usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const generateRfid = () => {
    const newRfid = generateRandomRfid();
    handleChange('rfid_uid', newRfid);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <User className="w-4 h-4 mr-2" />
          Nombre Completo
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ej: Juan Pérez"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <Mail className="w-4 h-4 mr-2" />
          Correo Electrónico
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ej: juan@email.com"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <Phone className="w-4 h-4 mr-2" />
          Teléfono
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ej: +593 99 123 4567"
        />
        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
      </div>

      {/* RFID UID */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <CreditCard className="w-4 h-4 mr-2" />
          UID RFID
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={formData.rfid_uid}
            onChange={(e) => handleChange('rfid_uid', e.target.value.toUpperCase())}
            className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono ${
              errors.rfid_uid ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: ABC123456"
          />
          <button
            type="button"
            onClick={generateRfid}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Generar
          </button>
        </div>
        {errors.rfid_uid && <p className="mt-1 text-sm text-red-600">{errors.rfid_uid}</p>}
      </div>

      {/* Role */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <UserCheck className="w-4 h-4 mr-2" />
          Rol
        </label>
        <select
          value={formData.role}
          onChange={(e) => handleChange('role', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={USER_ROLES.STUDENT}>Estudiante</option>
          <option value={USER_ROLES.TEACHER}>Profesor</option>
          <option value={USER_ROLES.ADMIN}>Administrador</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Guardando...' : (user ? 'Actualizar' : 'Crear')}
        </button>
      </div>
    </form>
  );
};

export default UserForm;