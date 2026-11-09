
import React from 'react';
import { FloatingInput } from '../../FloatingInput';

interface IdentityFieldsProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const IdentityFields: React.FC<IdentityFieldsProps> = ({ formData, onChange }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FloatingInput
        id="firstName"
        type="text"
        label="Prénom"
        value={formData.firstName}
        onChange={onChange}
        required
      />
      <FloatingInput
        id="lastName"
        type="text"
        label="Nom"
        value={formData.lastName}
        onChange={onChange}
        required
      />
    </div>
  );
};

export default IdentityFields;
