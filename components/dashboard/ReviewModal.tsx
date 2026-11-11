
import React, { useState, useEffect, useRef } from 'react';
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
  const [error, setError] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (isOpen) { setRating(0); setComment(''); setError(''); } }, [isOpen, candidateName, jobTitle]);
  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; closeRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return; }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const items = Array.from(dialogRef.current.querySelectorAll('button:not([disabled]), textarea:not([disabled])')) as HTMLElement[];
      if (!items.length) return;
      if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items[items.length - 1].focus(); }
      else if (!event.shiftKey && document.activeElement === items[items.length - 1]) { event.preventDefault(); items[0].focus(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => { document.removeEventListener('keydown', handleKey); document.body.style.overflow = previousOverflow; previouslyFocused?.focus(); };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) { setError('Sélectionnez une note et rédigez un avis.'); return; }
    setIsSubmitting(true); setError('');
    try { onSave(rating, comment.trim()); onClose(); }
    catch { setError('Impossible d’enregistrer cet avis dans ce navigateur. Vérifiez la candidature et réessayez.'); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="review-title" className="relative bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
        <div className="bg-slate-900 p-6 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
            <h2 id="review-title" className="text-xl font-heading font-bold text-white mb-1">Terminer la mission</h2>
            <p className="text-slate-400 text-sm">Notez votre expérience avec <span className="text-white font-bold">{candidateName}</span> pour <span className="text-white">{jobTitle}</span>.</p>
            <button ref={closeRef} type="button" aria-label="Fermer" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
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
                            type="button" aria-label={`${star} étoile${star > 1 ? "s" : ""}`} aria-pressed={rating === star}
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
                <p>Votre avis aide les autres recruteurs et construit la réputation de l'étudiant sur Rise Madagascar.</p>
            </div>

            <p className="mb-4 text-xs text-slate-500">Avis simulé : il reste dans ce navigateur. La mission sera clôturée après enregistrement.</p>
            {error && <p role="alert" className="mb-4 text-sm text-red-700">{error}</p>}
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
