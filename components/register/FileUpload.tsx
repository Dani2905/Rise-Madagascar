import React, { useEffect, useRef } from 'react';
interface FileUploadProps { file: File | null; onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void; onRemove: () => void; }
export const FileUpload: React.FC<FileUploadProps> = ({ file, onFileChange, onRemove }) => {
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { if (!file && input.current) input.current.value = ''; }, [file]);
  return <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
    <label htmlFor="file-upload" className="block text-sm font-bold text-slate-700 mb-2">CV PDF (facultatif)</label>
    <input ref={input} id="file-upload" type="file" accept="application/pdf,.pdf" onChange={onFileChange} className="block w-full text-sm text-slate-600" />
    <p className="text-xs text-slate-500 mt-2">Démonstration : seul le nom du fichier est conservé dans ce navigateur. Le document n’est ni enregistré ni envoyé. Maximum 5 Mo.</p>
    {file && <div className="flex items-center gap-3 mt-3 text-sm text-slate-700"><span className="truncate">{file.name}</span><button type="button" onClick={onRemove} className="font-bold underline">Retirer</button></div>}
  </div>;
};
