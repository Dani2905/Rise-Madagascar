import React, { useRef } from 'react';
import { Upload, FileText, CheckCircle, XCircle } from 'lucide-react';
import { ApplicationStatus } from '../../types';

interface FileUploadProps {
  file: File | null;
  status: ApplicationStatus;
  progress: number;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  file, 
  status, 
  progress, 
  onFileChange, 
  onRemove 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">CV (PDF)</label>
      
      {!file ? (
          <div 
            className="group flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-primary hover:bg-yellow-50/50 transition-all cursor-pointer relative"
            onClick={() => fileInputRef.current?.click()}
          >
              <input 
                ref={fileInputRef}
                id="file-upload" 
                name="file-upload" 
                type="file" 
                className="sr-only" 
                accept=".pdf" 
                onChange={onFileChange} 
              />
              <div className="space-y-1 text-center w-full">
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-transform">
                    <Upload className="h-6 w-6 text-gray-400 group-hover:text-primary" />
                  </div>
                  <div className="flex text-sm text-gray-600 justify-center mt-2">
                      <span className="font-medium text-primary hover:text-yellow-700">Cliquez pour ajouter</span>
                  </div>
                  <p className="text-xs text-gray-500">PDF jusqu'à 5MB</p>
              </div>
          </div>
      ) : (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                      <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                          <FileText className="text-primary w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                          <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                  </div>
                  {status === ApplicationStatus.SUCCESS ? (
                       <div className="bg-green-100 p-1 rounded-full">
                         <CheckCircle className="text-green-600 w-5 h-5" />
                       </div>
                  ) : (
                      <button type="button" onClick={onRemove} className="text-gray-400 hover:text-red-500 transition-colors">
                          <XCircle className="w-5 h-5" />
                      </button>
                  )}
              </div>
              
              {/* Barre de Progression Animée */}
              <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                      className={`h-full rounded-full transition-all duration-300 ease-out ${status === ApplicationStatus.SUCCESS ? 'bg-secondary' : 'bg-primary'}`} 
                      style={{ width: `${progress}%` }}
                  >
                       {/* Effet brillant sur la barre */}
                       <div className="absolute top-0 left-0 bottom-0 right-0 bg-white opacity-20 w-full h-full animate-pulse"></div>
                  </div>
              </div>
              <div className="flex justify-between mt-1.5">
                  <span className="text-xs text-gray-500 font-medium">
                    {status === ApplicationStatus.SUCCESS ? 'Téléchargement terminé' : 'En cours...'}
                  </span>
                  <span className="text-xs text-gray-700 font-bold">{Math.round(progress)}%</span>
              </div>
          </div>
      )}
    </div>
  );
};