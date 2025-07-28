import React, { useState } from 'react';
import { useLockers } from '../../hooks/useLockers';
import { useRfid } from '../../hooks/useRfid';
import StatsPanel from './StatsPanel';
import LockerGrid from './LockerGrid';
import RfidSimulator from './RfidSimulator';
import LoadingSpinner from '../common/LoadingSpinner';

const Dashboard = () => {
  const { lockers, stats, loading, error } = useLockers();
  const [selectedLocker, setSelectedLocker] = useState(null);

  if (loading) {
    return <LoadingSpinner size="large" text="Cargando dashboard..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium">Error al cargar datos</div>
        <div className="text-gray-600 mt-2">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Sistema de lockers inteligentes</p>
        </div>
        <div className="text-sm text-gray-500">
          Última actualización: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Panel */}
      <StatsPanel stats={stats} />

      {/* RFID Simulator */}
      <RfidSimulator />

      {/* Locker Grid */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Estado de Lockers</h2>
          <p className="text-gray-600">Vista en tiempo real de todos los lockers</p>
        </div>
        <div className="p-6">
          <LockerGrid 
            lockers={lockers} 
            selectedLocker={selectedLocker}
            onLockerSelect={setSelectedLocker}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;