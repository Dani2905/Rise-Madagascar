import React from 'react';

export const RegisterHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      {/* Decorative Top Border - Solid */}
      <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
      
      <h2 className="mt-2 text-3xl font-heading font-extrabold text-gray-900">
        Rejoignez <span className="text-yellow-600">Rise Madagascar</span>
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        Créez votre profil étudiant et postulez en 1 clic.
      </p>
    </div>
  );
};