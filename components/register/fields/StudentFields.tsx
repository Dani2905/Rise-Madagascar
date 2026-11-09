
import React from 'react';
import { FloatingInput } from '../../FloatingInput';
import { madagascarToday } from '../../../utils/registration';

interface StudentFieldsProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const StudentFields: React.FC<StudentFieldsProps> = ({ formData, onChange }) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
         <FloatingInput
            id="birthDate"
            type="date"
            max={madagascarToday()}
            label="Date de naissance"
            value={formData.birthDate}
            onChange={onChange}
            required
            className="text-gray-900" 
         />
         <FloatingInput
            id="phone"
            type="tel"
            label="Tél. fonctionnel"
            value={formData.phone}
            onChange={onChange}
            required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
         <FloatingInput
            id="school"
            type="text"
            label="École / Université"
            value={formData.school}
            onChange={onChange}
            required
        />
         <div className="relative mb-6">
            <select
                id="studyLevel"
                value={formData.studyLevel}
                onChange={onChange}
                required
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-teal-600 peer border border-gray-300 h-[50px]"
            >
                <option value="" disabled hidden></option>
                <option value="L1">L1 - Licence 1</option>
                <option value="L2">L2 - Licence 2</option>
                <option value="L3">L3 - Licence 3</option>
                <option value="M1">M1 - Master 1</option>
                <option value="M2">M2 - Master 2</option>
                <option value="PhD">Doctorat</option>
                <option value="Bacc">Bacc ou inférieur</option>
            </select>
            <label
                htmlFor="studyLevel"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 pointer-events-none"
            >
                Niveau d'étude
            </label>
         </div>
      </div>

      <FloatingInput
        id="studyField"
        type="text"
        label="Filière / Domaine (ex: Informatique...)"
        value={formData.studyField}
        onChange={onChange}
        required
      />
    </>
  );
};

export default StudentFields;
