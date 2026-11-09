
import React from 'react';
import { FloatingInput } from '../FloatingInput';
import { AccountType } from '../../hooks/useRegisterForm';

// Sub-components
import CompanyFields from './fields/CompanyFields';
import IdentityFields from './fields/IdentityFields';
import StudentFields from './fields/StudentFields';
import ProfessionalContactFields from './fields/ProfessionalContactFields';
import SecurityFields from './fields/SecurityFields';

interface RegisterFormFieldsProps {
  accountType: AccountType;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    school: string;
    studyField: string;
    studyLevel: string;
    birthDate: string;
    password: string;
    confirmPassword: string;
    companyName: string;
    website: string;
    industry: string;
    companySize: string;
    position: string;
    phone: string;
    city: string;
    address: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const RegisterFormFields: React.FC<RegisterFormFieldsProps> = ({ accountType, formData, onChange }) => {
  return (
    <div className="space-y-1">
      
      {/* 1. INFORMATIONS D'IDENTITÉ / ENTREPRISE */}
      {accountType === 'company' ? (
        <CompanyFields formData={formData} onChange={onChange} />
      ) : (
        <IdentityFields formData={formData} onChange={onChange} />
      )}
      
      {/* 2. EMAIL (COMMUN) */}
      <FloatingInput
        id="email"
        type="email"
        autoComplete="email" maxLength={254}
        label={accountType === 'student' ? "Email universitaire" : "Email de contact"}
        value={formData.email}
        onChange={onChange}
        required
      />

      {/* 3. CHAMPS SPÉCIFIQUES ÉTUDIANT */}
      {accountType === 'student' && (
        <StudentFields formData={formData} onChange={onChange} />
      )}

      {/* 4. CHAMPS CONTACT (ENTREPRISE & PARTICULIER) */}
      {(accountType === 'company' || accountType === 'individual') && (
         <ProfessionalContactFields 
            accountType={accountType} 
            formData={formData} 
            onChange={onChange} 
         />
      )}

      {/* 5. SÉCURITÉ */}
      <SecurityFields formData={formData} onChange={onChange} />

    </div>
  );
};
