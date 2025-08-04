// src/components/LockerLogs/LockerAllLogs.jsx

import React, { useState, useEffect } from 'react';
import { lockerService } from '../../services/lockerService';
import { formatDate } from '../../utils/formatters';

const LockerAllLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await lockerService.getAllLogs();
        setLogs(data);
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) return <div>Cargando logs...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Registro completo de actividad</h1>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Locker</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">RFID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-6 py-4 whitespace-nowrap">Locker {log.locker.locker_number}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">
                  {log.action.replace('_', ' ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {log.user?.name || 'Sistema'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-mono">
                  {log.rfid_uid || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatDate(log.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LockerAllLogs;