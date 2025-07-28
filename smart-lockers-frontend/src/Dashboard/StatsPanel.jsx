import React from 'react';
import { Package, CheckCircle, XCircle, Clock, Wrench } from 'lucide-react';

const StatsPanel = ({ stats }) => {
  const statItems = [
    {
      title: 'Total Lockers',
      value: stats.total,
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Disponibles',
      value: stats.available,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Ocupados',
      value: stats.occupied,
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50'
    },
    {
      title: 'Reservados',
      value: stats.reserved,
      icon: Clock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50'
    },
    {
      title: 'Mantenimiento',
      value: stats.maintenance,
      icon: Wrench,
      color: 'text-gray-600',
      bg: 'bg-gray-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${item.bg}`}>
                <Icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{item.title}</p>
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Utilización */}
      <div className="bg-white rounded-lg shadow p-6 md:col-span-2 lg:col-span-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Utilización del Sistema</p>
            <p className="text-2xl font-bold text-gray-900">{stats.utilization}%</p>
          </div>
          <div className="w-32 bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${stats.utilization}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;