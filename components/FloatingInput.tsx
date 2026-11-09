import React from 'react';

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
}

export const FloatingInput: React.FC<FloatingInputProps> = ({ label, id, error, className, ...props }) => {
  return (
    <div className="relative mb-6">
      <input
        id={id}
        {...props}
        className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-teal-600 peer border ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
        placeholder=" "
      />
      <label
        htmlFor={id}
        className={`absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-teal-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 ${error ? 'text-red-500 peer-focus:text-red-500' : ''}`}
      >
        {label}
      </label>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export const FloatingTextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; id: string }> = ({ label, id, className, ...props }) => {
    return (
      <div className="relative mb-6">
        <textarea
          id={id}
          {...props}
          className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-teal-600 peer border border-gray-300 min-h-[120px] resize-none ${className}`}
          placeholder=" "
        />
        <label
          htmlFor={id}
          className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-teal-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2 peer-placeholder-shown:top-2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
        >
          {label}
        </label>
      </div>
    );
  };