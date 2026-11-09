import React, { useState, useEffect } from 'react';
import { MOCK_JOBS } from '../../data/jobsData';
import { ALL_COMPANIES } from '../../data/companiesData';

const StatsSection: React.FC = () => {
  const [stats, setStats] = useState({
      jobs: "500+",
      students: "2k+",
      companies: "150",
      free: "100%"
  });

  useEffect(() => {
      // 1. Calculer les Jobs
      const customJobs = JSON.parse(localStorage.getItem('rise_jobs') || '[]');
      const totalJobs = MOCK_JOBS.length + customJobs.length + 542; // +542 base fictive pour l'effet "gros volume"

      // 2. Calculer les Entreprises
      const dbUsers = JSON.parse(localStorage.getItem('rise_db_users') || '[]');
      const registeredCompanies = dbUsers.filter((u: any) => u.role === 'company').length;
      const totalCompanies = ALL_COMPANIES.length + registeredCompanies + 140; // +140 base fictive

      // 3. Calculer les étudiants (fictif + dynamiques)
      const registeredStudents = dbUsers.filter((u: any) => u.role === 'student').length;
      const totalStudents = 2000 + registeredStudents;

      setStats({
          jobs: `${totalJobs}+`,
          students: `${(totalStudents / 1000).toFixed(1)}k+`,
          companies: `${totalCompanies}`,
          free: "100%"
      });
  }, []);

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