import React, { useRef, useState } from 'react';
import { MapPin, GraduationCap, Mail, Phone, Edit3, Camera, Loader2, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from './EditProfileModal';

interface ProfileHeaderProps {
  profile: any; 
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fallbacks for display
  const title = profile.title || (profile.studyField ? `Étudiant en ${profile.studyField}` : "Étudiant");
  const school = profile.school || "École non renseignée";
  const level = profile.studyLevel || profile.level || "";
  const location = profile.location || "Antananarivo, Madagascar";
  const avatarUrl = profile.avatarUrl || `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&background=0f172a&color=fff&size=128`;
  
  // Rating logic
  const rating = profile.rating || 0;
  const reviewCount = profile.reviewCount || 0;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check size (Limit to 2MB for base64 localStorage performance)
    if (file.size > 2 * 1024 * 1024) {
        window.Toastify({
            text: "L'image est trop volumineuse (Max 2MB)",
            style: { background: "#ef4444" }
        }).showToast();
        return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
        const base64String = reader.result as string;
        updateUser({ avatarUrl: base64String });
        setIsUploading(false);
        window.Toastify({
            text: "Photo de profil mise à jour !",
            style: { background: "linear-gradient(to right, #10B981, #059669)" }
        }).showToast();
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (updatedData: any) => {
      updateUser(updatedData);
      window.Toastify({
        text: "Profil mis à jour avec succès !",
        style: { background: "linear-gradient(to right, #10B981, #059669)" }
      }).showToast();
  };

  return (
    <>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 md:p-8 mb-6 relative group animate-fade-in">
            
            {/* Hidden Input */}
            <input 
                type="file" 
                ref={avatarInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload}
            />

            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                
                {/* Avatar & Info */}
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left w-full md:w-auto">
                    <div 
                        className="w-24 h-24 md:w-28 md:h-28 rounded-2xl shadow-lg overflow-hidden bg-slate-100 relative group/avatar cursor-pointer flex-shrink-0 border border-gray-100 mx-auto md:mx-0"
                        onClick={() => avatarInputRef.current?.click()}
                    >
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity transition-all duration-300 backdrop-blur-[2px]">
                                {isUploading ? (
                                    <Loader2 className="text-white animate-spin" size={24} />
                                ) : (
                                    <Camera className="text-white" size={24} />
                                )}
                        </div>
                    </div>
                    
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
                <div className="flex gap-3 w-full md:w-auto mt-2 md:mt-0">
                    <button 
                        onClick={() => setIsEditModalOpen(true)}
                        className="flex-1 md:flex-none px-4 py-2.5 bg-white border border-gray-200 text-slate-700 font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm whitespace-nowrap"
                    >
                        <Edit3 size={16} /> <span className="md:inline">Modifier</span>
                    </button>
                    <button 
                        onClick={() => navigate('/cv/preview')}
                        className="flex-1 md:flex-none px-4 py-2.5 bg-primary text-slate-900 font-bold rounded-xl hover:bg-yellow-400 transition-colors shadow-lg shadow-primary/20 text-sm whitespace-nowrap"
                    >
                        Mon CV Public
                    </button>
                </div>
            </div>

            {/* Contact Quick Access */}
            <div className="mt-6 md:mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-sm font-medium text-gray-600 hover:text-yellow-700 transition-colors cursor-pointer w-full sm:w-auto">
                    <div className="p-2 bg-gray-50 rounded-lg text-yellow-600 shrink-0">
                        <Mail size={16} />
                    </div> 
                    <span className="truncate">{profile.email}</span>
                </div>
                {profile.phone && (
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-sm font-medium text-gray-600 hover:text-yellow-700 transition-colors cursor-pointer w-full sm:w-auto">
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