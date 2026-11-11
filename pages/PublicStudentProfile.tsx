import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, Award, Briefcase, GraduationCap, MapPin, Rocket, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getPublicStudent, PublicStudent } from '../utils/publicStudent';
import { getPublicProjects } from '../utils/projects';
import { Project } from '../data/resourcesData';

const PublicStudentProfile: React.FC = () => {
  const { id = '' } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const [student, setStudent] = useState<PublicStudent | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const isOwner = student && user?.role === 'student' && String(user.id) === String(student.id);
  const origin = typeof location.state?.fromProject === 'string' && /^\/projects\/[^/?#]+$/.test(location.state.fromProject) ? location.state.fromProject : null;
  const fromDirectory = location.state?.fromStudentDirectory === true && user?.role === 'student';
  const globalSearch = typeof location.state?.fromGlobalSearch === 'string' && /^\/discover(?:\?|$)/.test(location.state.fromGlobalSearch) ? location.state.fromGlobalSearch : null;
  const returnTo = origin || globalSearch || (fromDirectory ? '/discover?type=students' : isOwner ? '/profile' : '/resources');
  const returnLabel = origin ? 'Retour au projet' : globalSearch || fromDirectory ? 'Retour à la recherche' : isOwner ? 'Retour à mon profil' : 'Retour aux projets';

  useEffect(() => {
    const refresh = () => {
      const found = getPublicStudent(id);
      setStudent(found);
      setProjects(found ? getPublicProjects().filter(p => p.ownerId != null && String(p.ownerId) === String(found.id)) : []);
      setLoading(false);
    };
    setLoading(true); refresh();
    window.addEventListener('storage', refresh); window.addEventListener('focus', refresh);
    return () => { window.removeEventListener('storage', refresh); window.removeEventListener('focus', refresh); };
  }, [id]);

  if (loading) return <div className="min-h-screen p-12 text-center text-slate-500">Chargement du profil…</div>;
  if (!student) return <div className="min-h-screen bg-slate-50 px-4 py-20 text-center"><h1 className="text-2xl font-heading font-bold text-slate-900">Profil étudiant introuvable</h1><p className="text-sm text-slate-600 mt-4">Ce profil n’existe pas dans ce navigateur ou ses données locales sont indisponibles.</p><Link to={returnTo} className="inline-block mt-6 font-bold text-yellow-700 underline">{returnLabel}</Link></div>;

  const fullName = [student.firstName, student.lastName].filter(Boolean).join(' ') || 'Étudiant';
  const initials = `${student.firstName[0] || ''}${student.lastName[0] || ''}`.toUpperCase() || '?';
  const title = student.title || (student.studyField ? `Étudiant en ${student.studyField}` : 'Étudiant');
  const education = student.education.length ? student.education : student.school ? [{ degree: student.studyLevel ? `Niveau ${student.studyLevel}` : 'Formation en cours', school: student.school, date: 'En cours', mention: student.studyField }] : [];

  return <div className="min-h-screen bg-slate-50 py-8 pb-20">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <Link to={returnTo} className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 mb-6"><ArrowLeft size={17} />{returnLabel}</Link>
      <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
        <strong>Aperçu public simulé :</strong> ce profil et ses projets existent uniquement dans ce navigateur. Le lien ne permet pas de les consulter depuis un autre appareil ou navigateur. Aucun serveur ne les publie.
        <span className="block mt-1">Le nom, les photos, la localisation, la formation, la présentation, les compétences, les expériences et les projets sont affichés ici lorsqu’ils sont renseignés. Les champs e-mail, téléphone, date de naissance et candidatures ne le sont pas. Ne saisissez pas de données sensibles dans cette démonstration.</span>
      </div>
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-8">
        <div className="h-44 sm:h-56 relative bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
          {student.coverUrl && <img src={student.coverUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
        </div>
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-5">
          <div className="w-24 h-24 rounded-2xl bg-slate-800 text-white overflow-hidden border-4 border-white shadow-md -mt-16 relative shrink-0">
            {student.avatarUrl ? <img src={student.avatarUrl} alt="" className="w-full h-full object-cover" /> : <span className="w-full h-full flex items-center justify-center text-3xl font-bold">{initials}</span>}
          </div>
          <div className="min-w-0 flex-1">
            {student.isDemo && <span className="inline-block mb-2 px-2 py-1 rounded bg-amber-50 text-amber-800 text-xs font-bold">Profil de démonstration</span>}
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 break-words">{fullName}</h1>
            <p className="text-yellow-700 font-bold mt-1">{title}</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-sm text-slate-600">
              {student.school && <span className="flex items-center gap-2"><GraduationCap size={16} />{student.school}{student.studyLevel ? ` • ${student.studyLevel}` : ''}</span>}
              {student.location && <span className="flex items-center gap-2"><MapPin size={16} />{student.location}</span>}
            </div>
          </div>
          {isOwner && <Link to="/profile" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">Modifier mon profil</Link>}
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm"><h2 className="text-xl font-heading font-bold text-slate-900 mb-4">À propos</h2><p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{student.bio || 'Aucune présentation renseignée.'}</p></section>
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm"><h2 className="text-xl font-heading font-bold text-slate-900 mb-5 flex items-center gap-2"><Rocket className="text-yellow-600" size={21} /> Projets</h2>
            {projects.length ? <div className="grid sm:grid-cols-2 gap-4">{projects.map(p => <Link key={p.id} to={`/projects/${encodeURIComponent(String(p.id))}`} state={{ fromStudent: location.pathname }} className="block rounded-xl border border-slate-200 p-4 hover:border-yellow-400 transition-colors"><span className="text-xs font-bold text-slate-500">{p.category}</span><h3 className="font-bold text-slate-900 mt-1">{p.title}</h3><p className="text-sm text-slate-600 mt-2 line-clamp-3">{p.description}</p><span className="inline-block mt-4 text-xs font-bold text-yellow-700">Voir le projet →</span></Link>)}</div> : <p className="text-sm text-slate-500">Aucun projet publié dans ce navigateur.</p>}
          </section>
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm"><h2 className="text-xl font-heading font-bold text-slate-900 mb-5 flex items-center gap-2"><Briefcase className="text-purple-600" size={21} /> Expériences</h2>{student.experiences.length ? <div className="space-y-5">{student.experiences.map((exp, i) => <div key={i}><h3 className="font-bold text-slate-900">{exp.role}</h3><p className="text-sm text-slate-600">{[exp.company, exp.date].filter(Boolean).join(' • ')}</p>{exp.description && <p className="text-sm text-slate-600 mt-2 whitespace-pre-wrap">{exp.description}</p>}</div>)}</div> : <p className="text-sm text-slate-500">Aucune expérience renseignée.</p>}</section>
        </div>
        <div className="space-y-6">
          <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"><h2 className="font-heading font-bold text-lg text-slate-900 mb-4 flex items-center gap-2"><Sparkles className="text-yellow-600" size={20} /> Compétences</h2>{student.skills.length ? <div className="flex flex-wrap gap-2">{student.skills.map((skill, i) => <span key={i} className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm text-slate-700">{skill}</span>)}</div> : <p className="text-sm text-slate-500">Aucune compétence renseignée.</p>}<h3 className="font-bold text-slate-900 mt-6 mb-3">Langues</h3><p className="text-sm text-slate-600">{student.languages.length ? student.languages.join(' · ') : 'Aucune langue renseignée.'}</p></section>
          <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"><h2 className="font-heading font-bold text-lg text-slate-900 mb-4 flex items-center gap-2"><Award className="text-yellow-600" size={20} /> Formation</h2>{education.length ? <div className="space-y-4">{education.map((edu, i) => <div key={i}><h3 className="font-bold text-sm text-slate-900">{edu.degree}</h3><p className="text-sm text-slate-600">{edu.school}</p><p className="text-xs text-slate-500 mt-1">{[edu.date, edu.mention].filter(Boolean).join(' • ')}</p></div>)}</div> : <p className="text-sm text-slate-500">Aucune formation renseignée.</p>}</section>
        </div>
      </div>
    </div>
  </div>;
};
export default PublicStudentProfile;
