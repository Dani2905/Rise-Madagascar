
import React from 'react';
import { FloatingInput } from '../../FloatingInput';

interface CompanyFieldsProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const CompanyFields: React.FC<CompanyFieldsProps> = ({ formData, onChange }) => {
  return (
    <>
        <div className="grid grid-cols-2 gap-4">
            <FloatingInput
                id="companyName"
                type="text"
                label="Nom de l'entreprise"
                value={formData.companyName}
                onChange={onChange}
                required
            />
            <FloatingInput
                id="website"
                type="text"
                label="Site Web (ou LinkedIn)"
                value={formData.website}
                onChange={onChange}
            />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            {/* Select Industry */}
            <div className="relative mb-6">
                <select
                    id="industry"
                    value={formData.industry}
                    onChange={onChange}
                    required
                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-teal-600 peer border border-gray-300 h-[50px]"
                >
                    <option value="" disabled hidden></option>
                    <option value="Tech">Informatique / Tech</option>
                    <option value="Finance">Banque / Finance</option>
                    <option value="Telecom">Télécoms</option>
                    <option value="Marketing">Marketing / Com</option>
                    <option value="Industry">Industrie / BTP</option>
                    <option value="Services">Services</option>
                    <option value="Other">Autre</option>
                </select>
                <label
                    htmlFor="industry"
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 pointer-events-none"
                >
                    Secteur d'activité
                </label>
            </div>

            {/* Select Company Size */}
            <div className="relative mb-6">
                <select
                    id="companySize"
                    value={formData.companySize}
                    onChange={onChange}
                    required
                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-teal-600 peer border border-gray-300 h-[50px]"
                >
                    <option value="" disabled hidden></option>
                    <option value="1-10">1 - 10 employés</option>
                    <option value="11-50">11 - 50 employés</option>
                    <option value="51-200">51 - 200 employés</option>
                    <option value="200+">200+ employés</option>
                </select>
                <label
                    htmlFor="companySize"
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 pointer-events-none"
                >
                    Taille
                </label>
            </div>
        </div>

        {/* Nom du contact Recruteur */}
        <div className="grid grid-cols-2 gap-4">
            <FloatingInput
                id="firstName"
                type="text"
                label="Votre Prénom"
                value={formData.firstName}
                onChange={onChange}
                required
            />
            <FloatingInput
                id="lastName"
                type="text"
                label="Votre Nom"
                value={formData.lastName}
                onChange={onChange}
                required
            />
        </div>
         <FloatingInput
            id="position"
            type="text"
            label="Votre poste (ex: DRH, Gérant)"
            value={formData.position}
            onChange={onChange}
            required
        />
    </>
  );
};

export default CompanyFields;
