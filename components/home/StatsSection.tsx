import React, { useState, useEffect } from 'react';
import { MOCK_JOBS } from '../../data/jobsData';
import { ALL_COMPANIES } from '../../data/companiesData';
import { useAuth } from '../../context/AuthContext';

const StatsSection: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    jobs: "548+",
    students: "2.0k+",
    companies: "148",
    free: "100%"
  });

  useEffect(() => {
    let customJobs: any[] = [];
    let dbUsers: any[] = [];

    try {
      const parsedJobs = JSON.parse(localStorage.getItem('rise_jobs') || '[]');
      customJobs = Array.isArray(parsedJobs) ? parsedJobs : [];
    } catch (error) {
      console.error("Erreur lecture offres stats", error);
      customJobs = [];
    }

    try {
      const parsedUsers = JSON.parse(localStorage.getItem('rise_db_users') || '[]');
      dbUsers = Array.isArray(parsedUsers) ? parsedUsers : [];
    } catch (error) {
      console.error("Erreur lecture utilisateurs stats", error);
      dbUsers = [];
    }

    // 1. Calculer les Jobs actifs (dédupliqués par ID)
    const activeCustomJobs = customJobs.filter((j: any) => j && (!j.status || j.status === 'Actif'));
    const customJobIds = new Set(activeCustomJobs.map((j: any) => j.id?.toString()));
    const remainingMockJobs = MOCK_JOBS.filter(m => !customJobIds.has(m.id.toString()));
    const totalJobs = remainingMockJobs.length + activeCustomJobs.length + 542;

    // 2. Calculer les Entreprises (dédupliquées par ID avec ALL_COMPANIES)
    const dbCompanies = dbUsers.filter((u: any) => u && u.role === 'company');
    const dbCompanyIds = new Set(dbCompanies.map((u: any) => u.id?.toString()));
    const remainingMockCompanies = ALL_COMPANIES.filter(c => !dbCompanyIds.has(c.id.toString()));
    const totalCompanies = remainingMockCompanies.length + dbCompanies.length + 140;

    // 3. Calculer les étudiants (fictif + dynamiques)
    const registeredStudents = dbUsers.filter((u: any) => u && u.role === 'student').length;
    const totalStudents = 2000 + registeredStudents;

    setStats({
      jobs: `${totalJobs}+`,
      students: `${(totalStudents / 1000).toFixed(1)}k+`,
      companies: `${totalCompanies}`,
      free: "100%"
    });
  }, [user]);

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[128px] transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary rounded-full blur-[128px] transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
              <h2 className="text-3xl font-heading font-bold mb-4">L'impact Rise en chiffres</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Nous construisons le plus grand réseau professionnel pour les jeunes à Madagascar.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-800">
              {[
                  { number: stats.jobs, label: "Offres Actives", color: "text-yellow-400" },
                  { number: stats.students, label: "Étudiants Inscrits", color: "text-green-400" },
                  { number: stats.companies, label: "Entreprises Partenaires", color: "text-purple-400" },
                  { number: stats.free, label: "Gratuit", color: "text-white" }
              ].map((stat, idx) => (
                  <div key={idx} className="p-4 group">
                      <div className={`text-4xl md:text-5xl font-heading font-bold mb-2 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>{stat.number}</div>
                      <div className="text-slate-400 font-medium text-sm uppercase tracking-wide">{stat.label}</div>
                  </div>
              ))}
          </div>
      </div>
    </section>
  );
};

export default StatsSection;