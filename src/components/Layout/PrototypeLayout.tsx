import React from 'react';

interface PrototypeLayoutProps {
  children: React.ReactNode;
}

export const PrototypeLayout: React.FC<PrototypeLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
};
