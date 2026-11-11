import React from 'react';

const AboutHero: React.FC = () => {
  return (
    <section className="relative bg-slate-900 text-white py-24 lg:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary opacity-10 rounded-full blur-[120px] transform translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary opacity-10 rounded-full blur-[100px] transform -translate-x-1/3 translate-y-1/4"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <span className="inline-block py-1.5 px-4 rounded-full bg-slate-800 border border-slate-700 text-primary font-bold text-xs uppercase tracking-widest mb-8 backdrop-blur-md shadow-xl">
                Une plateforme pensée pour Madagascar
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold mb-8 leading-tight">
                Plus qu'un site d'offres, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">un accélérateur de destin.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
                Rise Madagascar rassemble les étudiants, les entreprises et les particuliers autour des <span className="text-white font-medium">offres, missions et projets étudiants</span>.
            </p>
        </div>
      </section>
  );
};

export default AboutHero;