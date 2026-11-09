
import React, { useState } from 'react';
import { X, Star, Save, Loader2, Quote } from 'lucide-react';
import { FloatingTextArea } from '../FloatingInput';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  jobTitle: string;
  onSave: (rating: number, comment: string) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, candidateName, jobTitle, onSave }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
        window.Toastify({ text: "Veuillez sélectionner une note.", style: { background: "#ef4444" } }).showToast();
        return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
        onSave(rating, comment);
        setIsSubmitting(false);
        onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl animate-fade-in overflow-hidden">
        <div className="bg-slate-900 p-6 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
            <h2 className="text-xl font-heading font-bold text-white mb-1">Mission Terminée !</h2>
            <p className="text-slate-400 text-sm">Notez votre expérience avec <span className="text-white font-bold">{candidateName}</span></p>
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
                <X size={20} />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
            <div className="text-center mb-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Note globale</p>
                <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                            className="transition-transform hover:scale-110 focus:outline-none"
                        >
                            <Star 
                                size={32} 
                                className={`${(hoverRating || rating) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} transition-colors`} 
                            />
                        </button>
                    ))}
                </div>
                <p className="text-sm font-bold text-slate-700 mt-2 h-5">
                    {rating === 1 && "À éviter"}
                    {rating === 2 && "Moyen"}
                    {rating === 3 && "Correct"}
                    {rating === 4 && "Très bien"}
                    {rating === 5 && "Excellent !"}
                </p>
            </div>

            <FloatingTextArea 
                id="comment"
                label="Votre avis (visible sur son profil)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                className="min-h-[100px]"
            />

            <div className="bg-blue-50 p-3 rounded-xl flex gap-3 items-start text-xs text-blue-800 mb-6">
                <Quote size={16} className="shrink-0 mt-0.5" />
                <p>Votre avis aide les autres recruteurs et construit la réputation de l'étudiant sur Rise.</p>
            </div>

            <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-3.5 bg-primary text-slate-900 rounded-xl font-bold hover:bg-yellow-400 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                Publier l'avis
            </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
