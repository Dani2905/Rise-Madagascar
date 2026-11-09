
import React from 'react';
import { FloatingInput } from '../../FloatingInput';

interface SecurityFieldsProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SecurityFields: React.FC<SecurityFieldsProps> = ({ formData, onChange }) => {
  return (
    <div className="space-y-1"><p className="text-xs text-slate-500 mb-3">8 caractères minimum. Utilisez un mot de passe réservé à cette démonstration.</p>
        <FloatingInput
            id="password"
            type="password"
            autoComplete="new-password" minLength={8} maxLength={1024}
            label="Mot de passe"
            value={formData.password}
            onChange={onChange}
            required
        />
        <FloatingInput
            id="confirmPassword"
            type="password"
            autoComplete="new-password" minLength={8} maxLength={1024}
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
