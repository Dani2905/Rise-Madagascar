import React from 'react';
import { Briefcase } from 'lucide-react';

interface Props { description: string; tags: string[]; requirements?: string; benefits?: string; }
/** Les anciennes offres contiennent du HTML simple ; seuls ces éléments inoffensifs sont recréés par React. */
const safeContent = (text: string): React.ReactNode => {
  if (typeof text !== 'string') return null;
  if (!/<\/?(?:p|br|ul|ol|li|strong|b|em|i|h[234])\b/i.test(text) || typeof window === 'undefined') return text;
  const doc = new window.DOMParser().parseFromString(text, 'text/html');
  const allowed = new Set(['p', 'br', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'h2', 'h3', 'h4']);
  const forbidden = new Set(['script', 'style', 'iframe', 'object', 'embed', 'svg', 'math', 'template', 'img']);
  const convert = (node: Node, key: string): React.ReactNode => {
    if (node.nodeType === 3) return node.textContent;
    if (node.nodeType !== 1) return null;
    const tag = (node as Element).tagName.toLowerCase();
    if (forbidden.has(tag)) return null;
    const children = Array.from(node.childNodes).map((child, index) => convert(child, `${key}-${index}`));
    return allowed.has(tag) ? React.createElement(tag, { key }, ...children) : <React.Fragment key={key}>{children}</React.Fragment>;
  };
  return Array.from(doc.body.childNodes).map((node, index) => convert(node, String(index)));
};
const JobDescription: React.FC<Props> = ({ description, tags, requirements, benefits }) => <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
  <h2 className="text-xl font-heading font-bold text-slate-900 mb-6 flex items-center gap-2"><Briefcase className="text-primary" /> Description du poste</h2>
  <div className="prose prose-slate max-w-none whitespace-pre-line">{safeContent(description)}</div>
  {requirements && <div className="mt-8 pt-8 border-t border-gray-100"><h3 className="text-lg font-heading font-bold text-slate-900 mb-4">Profil recherché</h3><div className="prose prose-slate max-w-none whitespace-pre-line">{safeContent(requirements)}</div></div>}
  {benefits && <div className="mt-8 pt-8 border-t border-gray-100"><h3 className="text-lg font-heading font-bold text-slate-900 mb-4">Avantages</h3><div className="prose prose-slate max-w-none whitespace-pre-line">{safeContent(benefits)}</div></div>}
  {tags.length > 0 && <div className="mt-8 pt-8 border-t border-gray-100"><h3 className="text-lg font-heading font-bold text-slate-900 mb-4">Compétences clés</h3><div className="flex flex-wrap gap-2">{tags.map((tag, i) => <span key={`${tag}-${i}`} className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold border border-gray-100">#{tag}</span>)}</div></div>}
</div>;
export default JobDescription;
