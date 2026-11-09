
import React, { useState } from 'react';
import { X, Handshake, TrendingUp, Lightbulb, Send, Loader2 } from 'lucide-react';
import { FloatingTextArea, FloatingInput } from '../FloatingInput';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  onConfirm: (data: any) => void;
}

const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose, projectTitle, onConfirm }) => {
  const [supportType, setSupportType] = useState<'financing' | 'mentoring' | 'partnership'>('mentoring');
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
        onConfirm({ type: supportType, message, amount });
        setIsSubmitting(false);
        onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-fade-in overflow-hidden">
        {/* Header Stylisé */}
        <div className="bg-slate-900 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
            <h2 className="text-xl font-heading font-bold text-white mb-1 flex items-center gap-2">
                <TrendingUp className="text-primary" /> Propulser ce projet
            </h2>
            <p className="text-slate-400 text-sm">Soutenez <span className="text-white font-bold">{projectTitle}</span></p>
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
                <X size={20} />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <p className="text-sm font-bold text-gray-700 mb-4">Comment souhaitez-vous aider ?</p>
            
            <div className="grid grid-cols-1 gap-3 mb-6">
                <button
                    type="button"
                    onClick={() => setSupportType('mentoring')}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${supportType === 'mentoring' ? 'border-primary bg-yellow-50 shadow-md' : 'border-gray-100 hover:border-gray-200'}`}
                >
                    <div className={`p-2 rounded-full ${supportType === 'mentoring' ? 'bg-primary text-slate-900' : 'bg-gray-100 text-gray-400'}`}>
                        <Lightbulb size={20} />
                    </div>
                    <div>
                        <div className="font-bold text-slate-900 text-sm">Mentorat & Conseils</div>
                        <div className="text-xs text-gray-500">Partager votre expertise métier.</div>
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => setSupportType('financing')}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${supportType === 'financing' ? 'border-green-500 bg-green-50 shadow-md' : 'border-gray-100 hover:border-gray-200'}`}
                >
                    <div className={`p-2 rounded-full ${supportType === 'financing' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <div className="font-bold text-slate-900 text-sm">Business Angel (Financement)</div>
                        <div className="text-xs text-gray-500">Investir dans le développement.</div>
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => setSupportType('partnership')}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${supportType === 'partnership' ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-100 hover:border-gray-200'}`}
                >
                    <div className={`p-2 rounded-full ${supportType === 'partnership' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                        <Handshake size={20} />
                    </div>
                    <div>
                        <div className="font-bold text-slate-900 text-sm">Partenariat Stratégique</div>
                        <div className="text-xs text-gray-500">Accès réseau, matériel, incubation...</div>
                    </div>
                </button>
            </div>

            {supportType === 'financing' && (
                <FloatingInput 
                    id="amount"
                    label="Montant estimé (Ar) - Optionnel"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mb-6"
                />
            )}

            <FloatingTextArea 
                id="message"
                label={supportType === 'financing' ? "Message à l'équipe (Conditions, Intérêts...)" : "Décrivez votre proposition d'aide"}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="min-h-[100px]"
            />

            <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                Envoyer la proposition
            </button>
        </form>
      </div>
    </div>
  );
};

export default SupportModal;
