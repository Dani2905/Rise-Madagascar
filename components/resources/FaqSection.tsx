import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { FAQ_ITEMS } from '../../data/resourcesData';

const FaqSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="mt-20 pt-12 border-t border-gray-200">
        <div className="text-center mb-10">
            <h3 className="text-2xl font-heading font-bold text-slate-900 mb-2">Questions Fréquentes</h3>
            <p className="text-gray-500">Questions sur les projets étudiants sur Rise.</p>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-4">
            {FAQ_ITEMS.map((item, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <button 
                        type="button" aria-expanded={openFaq === idx}
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        className="w-full flex justify-between items-center p-5 text-left font-bold text-slate-900 hover:bg-gray-50 transition-colors"
                    >
                        <span className="flex items-center gap-3">
                            <HelpCircle size={18} className="text-primary" />
                            {item.question}
                        </span>
                        {openFaq === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    {openFaq === idx && (
                        <div className="p-5 pt-0 text-gray-600 text-sm leading-relaxed bg-gray-50 border-t border-gray-100">
                            {item.answer}
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
  );
};

export default FaqSection;