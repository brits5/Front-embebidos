import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Package, Settings, Activity } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      description: 'Vista general del sistema'
    },
    {
      path: '/users',
      icon: Users,
      label: 'Usuarios',
      description: 'Gestión de usuarios RFID'
    },
    {
      path: '/lockers',
      icon: Package,
      label: 'Lockers',
      description: 'Estado y configuración'
    },
    {
      path: '/activity',
      icon: Activity,
      label: 'Actividad',
      description: 'Historial y logs'
    },
    {
      path: '/settings',
      icon: Settings,
      label: 'Configuración',
      description: 'Ajustes del sistema'
    }
  ];

  return (
    <aside className="fixed left-0 top-16 w-64 h-full bg-white border-r border-gray-200 z-20">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;