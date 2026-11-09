
import React from 'react';
import { FloatingInput } from '../../FloatingInput';
import { AccountType } from '../../../hooks/useRegisterForm';

interface ProfessionalContactFieldsProps {
  accountType: AccountType;
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfessionalContactFields: React.FC<ProfessionalContactFieldsProps> = ({ accountType, formData, onChange }) => {
  return (
    <>
      {accountType === 'individual' && (
         <FloatingInput
            id="address"
            type="text"
            label="Quartier / Adresse (ex: Ambatobe)"
            value={formData.address}
            onChange={onChange}
            required
        />
      )}

      <div className="grid grid-cols-2 gap-4">
        <FloatingInput
            id="phone"
            type="tel"
            label="Téléphone"
            value={formData.phone}
            onChange={onChange}
            required
        />
        <FloatingInput
            id="city"
            type="text"
            label="Ville"
            value={formData.city}
            onChange={onChange}
            required
        />
      </div>
    </>
  );
};

export default ProfessionalContactFields;
