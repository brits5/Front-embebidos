import React, { useState } from 'react';
import { CreditCard, Zap, Users } from 'lucide-react';
import { useRfid } from '../../hooks/useRfid';
import { generateRandomRfid } from '../../utils/helpers';

const RfidSimulator = () => {
  const [rfidInput, setRfidInput] = useState('');
  const { scanning, lastScan, simulateScan } = useRfid();

  const predefinedRfids = [
    { uid: 'ABC123456', name: 'Juan Pérez' },
    { uid: 'DEF789012', name: 'María García' },
    { uid: 'GHI345678', name: 'Carlos López' },
    { uid: 'JKL901234', name: 'Ana Martínez' }
  ];

  const handleScan = async (rfidUid) => {
    if (!rfidUid.trim()) return;
    
    try {
      await simulateScan(rfidUid);
    } catch (error) {
      console.error('Error en simulación RFID:', error);
    }
  };

  const handleInputScan = () => {
    handleScan(rfidInput);
    setRfidInput('');
  };

  const handleRandomScan = () => {
    const randomRfid = generateRandomRfid();
    handleScan(randomRfid);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Simulador RFID
        </h2>
        <p className="text-gray-600">Simula escaneos de tarjetas RFID para pruebas</p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Manual Input */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Escaneo Manual</h3>
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={rfidInput}
                onChange={(e) => setRfidInput(e.target.value.toUpperCase())}
                placeholder="Ingrese UID RFID..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={scanning}
              />
              <button
                onClick={handleInputScan}
                disabled={scanning || !rfidInput.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {scanning ? 'Procesando...' : 'Escanear'}
              </button>
            </div>
            
            <button
              onClick={handleRandomScan}
              disabled={scanning}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 mr-2" />
              RFID Aleatorio
            </button>
          </div>

          {/* Predefined RFIDs */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Usuarios de Prueba
            </h3>
            <div className="space-y-2">
              {predefinedRfids.map((rfid) => (
                <button
                  key={rfid.uid}
                  onClick={() => handleScan(rfid.uid)}
                  disabled={scanning}
                  className="w-full text-left px-3 py-2 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">{rfid.name}</div>
                  <div className="text-sm text-gray-500">{rfid.uid}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Last Scan Result */}
        {lastScan && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Último Escaneo</h4>
            <div className="text-sm space-y-1">
              <div><strong>RFID:</strong> {lastScan.rfid_uid}</div>
              <div><strong>Resultado:</strong> 
                <span className={lastScan.result.success ? 'text-green-600' : 'text-red-600'}>
                  {lastScan.result.success ? ' ✅ Exitoso' : ' ❌ Error'}
                </span>
              </div>
              {lastScan.result.user_name && (
                <div><strong>Usuario:</strong> {lastScan.result.user_name}</div>
              )}
              {lastScan.result.locker_number && (
                <div><strong>Locker:</strong> {lastScan.result.locker_number}</div>
              )}
              {lastScan.result.message && (
                <div><strong>Mensaje:</strong> {lastScan.result.message}</div>
              )}
              <div><strong>Hora:</strong> {lastScan.timestamp.toLocaleTimeString()}</div>
              {lastScan.simulated && (
                <div className="text-orange-600"><strong>Simulado</strong></div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RfidSimulator;