import React from 'react';
import LockerCard from './LockerCard';

const LockerGrid = ({ lockers, selectedLocker, onLockerSelect }) => {
  if (!lockers || lockers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay lockers configurados</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {lockers.map((locker) => (
        <LockerCard
          key={locker.id}
          locker={locker}
          isSelected={selectedLocker?.id === locker.id}
          onClick={() => onLockerSelect(locker)}
        />
      ))}
    </div>
  );
};

export default LockerGrid;
