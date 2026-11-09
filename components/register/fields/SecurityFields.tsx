
import React from 'react';
import { FloatingInput } from '../../FloatingInput';

interface SecurityFieldsProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SecurityFields: React.FC<SecurityFieldsProps> = ({ formData, onChange }) => {
  return (
    <div className="space-y-1">
        <FloatingInput
            id="password"
            type="password"
            label="Mot de passe"
            value={formData.password}
            onChange={onChange}
            required
        />
        <FloatingInput
            id="confirmPassword"
            type="password"
            label="Confirmer le mot de passe"
            value={formData.confirmPassword}
            onChange={onChange}
            required
            error={formData.confirmPassword && formData.password !== formData.confirmPassword ? "Les mots de passe ne correspondent pas" : undefined}
        />
    </div>
  );
};

export default SecurityFields;
