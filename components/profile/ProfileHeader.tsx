import React, { useRef, useState } from 'react';
import { MapPin, GraduationCap, Mail, Phone, Edit3, Camera, Loader2, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from './EditProfileModal';

interface ProfileHeaderProps {
  profile: any;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, isEditModalOpen, setIsEditModalOpen }) => {
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const uploadInProgress = useRef(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [photoError, setPhotoError] = useState('');
  const [photoMessage, setPhotoMessage] = useState('');

  // Fallbacks for display
  const title = profile.title || (profile.studyField ? `Étudiant en ${profile.studyField}` : "Étudiant");
  const school = profile.school || "École non renseignée";
  const level = profile.studyLevel || profile.level || "";
  const location = profile.location || "Localisation non renseignée";
  const avatarUrl = profile.avatarUrl;
  const initials = `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase() || '?';
  
  // Rating logic
  const rating = profile.rating || 0;
  const reviewCount = profile.reviewCount || 0;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, field: 'avatarUrl' | 'coverUrl') => {
    const file = event.target.files?.[0];
    if (!file || uploadInProgress.current) return;

    setPhotoError(''); setPhotoMessage('');
    event.target.value = '';
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 2 * 1024 * 1024) {
        setPhotoError('Choisissez une image JPG, PNG ou WebP de 2 Mo maximum.');
        return;
    }
    uploadInProgress.current = true; setIsUploading(true);
    const reader = new FileReader();
    reader.onerror = () => { uploadInProgress.current = false; setIsUploading(false); setPhotoError('Impossible de lire cette image.'); };
    reader.onload = () => {
        try {
            if (typeof reader.result !== 'string') throw new Error();
            updateUser({ [field]: reader.result });
            setPhotoMessage(field === 'coverUrl' ? 'Photo de couverture enregistrée dans ce navigateur.' : 'Photo de profil enregistrée dans ce navigateur.');
        } catch { setPhotoError('Impossible d’enregistrer cette image dans le navigateur.'); }
        finally { uploadInProgress.current = false; setIsUploading(false); }
    };
    try { reader.readAsDataURL(file); }
    catch { uploadInProgress.current = false; setIsUploading(false); setPhotoError('Impossible de lire cette image.'); }
  };

  const removeCover = () => {
      setPhotoError(''); setPhotoMessage('');
      try { updateUser({ coverUrl: '' }); setPhotoMessage('Photo de couverture retirée.'); }
      catch { setPhotoError('Impossible de retirer la couverture dans ce navigateur.'); }
  };

  const handleSaveProfile = (updatedData: any) => {
      updateUser(updatedData);
      if (window.Toastify) window.Toastify({ text: "Profil enregistré dans ce navigateur.", style: { background: "#059669" } }).showToast();
  };

  return (
    <>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 md:p-8 mb-6 relative group animate-fade-in">
            
            {/* Hidden Input */}
            <input 
                type="file" 
                ref={avatarInputRef} 
                className="hidden" 
                accept="image/jpeg,image/png,image/webp" 
                onChange={(event) => handleImageUpload(event, 'avatarUrl')}
            />
            <input type="file" ref={coverInputRef} className="hidden" aria-label="Choisir une photo de couverture" accept="image/jpeg,image/png,image/webp" onChange={(event) => handleImageUpload(event, 'coverUrl')} />

            <div className="relative -mx-5 -mt-5 md:-mx-8 md:-mt-8 mb-6 h-44 sm:h-52 rounded-t-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
                {profile.coverUrl && <img src={profile.coverUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" aria-hidden="true" />
                <div className="absolute bottom-3 right-3 flex flex-wrap justify-end gap-2">
                    {profile.coverUrl && <button type="button" disabled={isUploading} onClick={removeCover} className="px-3 py-2 rounded-lg bg-white/90 text-slate-800 text-xs font-bold hover:bg-white disabled:opacity-50">Retirer la couverture</button>}
                    <button type="button" disabled={isUploading} onClick={() => coverInputRef.current?.click()} className="px-3 py-2 rounded-lg bg-white text-slate-900 text-xs font-bold shadow flex items-center gap-2 hover:bg-yellow-50 disabled:opacity-50"><Camera size={15} /> {profile.coverUrl ? 'Modifier la couverture' : 'Ajouter une couverture'}</button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                
                {/* Avatar & Info */}
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left w-full md:w-auto">
                    <button type="button" aria-label="Modifier la photo de profil" disabled={isUploading}
                        className="w-24 h-24 md:w-28 md:h-28 rounded-2xl shadow-lg overflow-hidden bg-slate-100 relative group/avatar cursor-pointer flex-shrink-0 border border-gray-100 mx-auto md:mx-0"
                        onClick={() => avatarInputRef.current?.click()}
                    >
                        {avatarUrl ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" /> : <span className="w-full h-full flex items-center justify-center bg-slate-800 text-white text-3xl font-bold">{initials}</span>}
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity transition-all duration-300 backdrop-blur-[2px]">
                                {isUploading ? (
                                    <Loader2 className="text-white animate-spin" size={24} />
                                ) : (
                                    <Camera className="text-white" size={24} />
                                )}
                        </div>
                    </button>
                    
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row items-center gap-2 mb-1">
                            <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900 leading-tight">
                                {profile.firstName} {profile.lastName}
                            </h1>
                            
                            {/* Rating Badge */}
                            {profile.role === 'student' && rating > 0 && (
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-50 rounded-full border border-yellow-100 cursor-help" title={`Noté par ${reviewCount} recruteurs/particuliers`}>
                                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs font-bold text-slate-900">{rating}</span>
                                    <span className="text-[10px] text-gray-500 font-medium">({reviewCount} avis)</span>
                                </div>
                            )}
                        </div>

                        <p className="text-base md:text-lg text-yellow-700 font-bold mb-3">{title}</p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 sm:gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100 w-full sm:w-auto justify-center sm:justify-start">
                                <GraduationCap size={16} className="text-gray-400 shrink-0" /> <span className="truncate">{school} {level && `• ${level}`}</span>
                            </span>
                            <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100 w-full sm:w-auto justify-center sm:justify-start">
                                <MapPin size={16} className="text-gray-400 shrink-0" /> {location}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 w-full md:w-auto mt-2 md:mt-0">
                    <button 
                        onClick={() => setIsEditModalOpen(true)}
                        className="flex-1 md:flex-none px-4 py-2.5 bg-white border border-gray-200 text-slate-700 font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm whitespace-nowrap"
                    >
                        <Edit3 size={16} /> <span className="md:inline">Modifier</span>
                    </button>
                    <button type="button"
                        onClick={() => navigate(`/students/${encodeURIComponent(String(profile.id))}`)}
                        className="flex-1 md:flex-none px-4 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors text-sm whitespace-nowrap"
                    >
                        Aperçu du profil public
                    </button>
                    <button 
                        onClick={() => navigate('/cv/preview')}
                        className="flex-1 md:flex-none px-4 py-2.5 bg-primary text-slate-900 font-bold rounded-xl hover:bg-yellow-400 transition-colors shadow-lg shadow-primary/20 text-sm whitespace-nowrap"
                    >
                        Aperçu de mon CV
                    </button>
                </div>
            </div>

            {photoMessage && <p role="status" className="mt-4 text-sm text-green-700">{photoMessage}</p>}
            <p className="mt-4 text-xs text-slate-500">Photos : JPG, PNG ou WebP, 2 Mo maximum chacune. Enregistrées uniquement dans ce navigateur.</p>
            {photoError && <p role="alert" className="mt-4 text-sm text-red-700">{photoError}</p>}
            {/* Contact Quick Access */}
            <div className="mt-6 md:mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-sm font-medium text-gray-600 hover:text-yellow-700 transition-colors w-full sm:w-auto">
                    <div className="p-2 bg-gray-50 rounded-lg text-yellow-600 shrink-0">
                        <Mail size={16} />
                    </div> 
                    <span className="truncate">{profile.email}</span>
                </div>
                {profile.phone && (
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-sm font-medium text-gray-600 hover:text-yellow-700 transition-colors w-full sm:w-auto">
                        <div className="p-2 bg-gray-50 rounded-lg text-yellow-600 shrink-0">
                            <Phone size={16} />
                        </div>
                        {profile.phone}
                    </div>
                )}
            </div>
        </div>

        {/* Modal Edition */}
        <EditProfileModal 
            isOpen={isEditModalOpen} 
            onClose={() => setIsEditModalOpen(false)} 
            profile={profile}
            onSave={handleSaveProfile}
        />
    </>
  );
};

export default ProfileHeader;