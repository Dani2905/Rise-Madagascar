import { Globe, Facebook, Linkedin } from 'lucide-react';

export interface Company {
  id: string | number;
  name: string;
  description: string;
  longDescription?: string;
  logoUrl: string;
  coverUrl?: string; // New
  jobs: number;
  sector: string;
  location: string;
  website: string;
  founded?: string; // New
  employees?: string; // New
  perks?: string[]; // New
  socials?: { type: string; url: string }[]; // New
}

export interface Individual {
  id: string | number;
  name: string;
  needs: string[];
  location: string;
  description: string;
  activeOffers: number;
  verified: boolean;
}

export const SECTORS = ['Tous', 'Télécoms', 'Banque', 'Informatique', 'Logistique', 'Conglomérat'];

export const ALL_COMPANIES: Company[] = [
  {
    id: 1,
    name: 'Telma',
    description: "Premier opérateur télécom à Madagascar. Leader de la 5G et de l'innovation numérique.",
    longDescription: "Telma Madagascar est le premier opérateur de télécommunications de la Grande Île. Précurseur technologique, nous avons été les premiers à déployer la 5G en Afrique. Rejoindre Telma, c'est intégrer une entreprise dynamique, engagée dans la transformation digitale du pays et offrant des opportunités de carrière stimulantes dans la Tech, le Marketing et le Service Client.",
    logoUrl: 'https://ui-avatars.com/api/?name=Telma&background=eab308&color=fff&size=128&font-size=0.4',
    coverUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2670&auto=format&fit=crop',
    jobs: 12,
    sector: 'Télécoms',
    location: 'Antananarivo, Ankorondrano',
    website: 'telma.mg',
    founded: '1896',
    employees: '1000+',
    perks: ['Cantine d\'entreprise', 'Assurance Santé', 'Formation continue', 'Team Building'],
    socials: [
        { type: 'linkedin', url: '#' },
        { type: 'facebook', url: '#' }
    ]
  },
  {
    id: 2,
    name: 'Axian Group',
    description: "Groupe panafricain présent dans l'énergie, l'immobilier, les télécoms et la finance.",
    longDescription: "Axian est un groupe panafricain présent dans 10 pays et spécialisé dans 5 secteurs d'activité à fort potentiel de croissance : Immobilier, Télécoms, Services financiers, Énergie et Innovation. Nous croyons en l'impact positif de l'entreprise sur l'économie locale.",
    logoUrl: 'https://ui-avatars.com/api/?name=Axian&background=ef4444&color=fff&size=128&font-size=0.4',
    coverUrl: 'https://images.unsplash.com/photo-1486406140926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop',
    jobs: 8,
    sector: 'Conglomérat',
    location: 'Antananarivo, Galaxy',
    website: 'axian-group.com',
    founded: '2015',
    employees: '5000+',
    perks: ['Mobilité internationale', 'Salle de sport', 'Primes de performance'],
    socials: [
        { type: 'linkedin', url: '#' }
    ]
  },
  {
    id: 3,
    name: 'Orange Madagascar',
    description: "Acteur majeur du numérique et de l'inclusion digitale. Partenaire privilégié des startups.",
    longDescription: "Orange est l'un des principaux opérateurs de télécommunications dans le monde. À Madagascar, nous sommes un partenaire de confiance pour la transformation numérique, avec un fort engagement RSE via Orange Solidarité et Orange Digital Center.",
    logoUrl: 'https://ui-avatars.com/api/?name=Orange&background=f97316&color=fff&size=128&font-size=0.4',
    coverUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2669&auto=format&fit=crop',
    jobs: 15,
    sector: 'Télécoms',
    location: 'Antananarivo, Ankorondrano',
    website: 'orange.mg',
    founded: '1998',
    employees: '500+',
    perks: ['Télétravail hybride', '13ème mois', 'Événements Tech'],
    socials: [
         { type: 'linkedin', url: '#' },
         { type: 'facebook', url: '#' },
         { type: 'globe', url: '#' }
    ]
  },
  {
    id: 4,
    name: 'Bolloré Logistics',
    description: "Leader du transport et de la logistique internationale à Madagascar.",
    logoUrl: 'https://ui-avatars.com/api/?name=Bollore&background=1e40af&color=fff&size=128&font-size=0.4',
    jobs: 5,
    sector: 'Logistique',
    location: 'Toamasina / Tana',
    website: 'bollore-transport-logistics.com'
  },
  {
    id: 5,
    name: 'Société Générale',
    description: "Banque de référence accompagnant le développement économique et les jeunes talents.",
    logoUrl: 'https://ui-avatars.com/api/?name=SG&background=dc2626&color=fff&size=128&font-size=0.4',
    jobs: 7,
    sector: 'Banque',
    location: 'Antananarivo, Antaninarenina',
    website: 'societegenerale.mg'
  },
  {
    id: 6,
    name: 'Etech',
    description: "Entreprise de services du numérique (ESN) spécialisée dans le développement web, mobile et l'offshore informatique.",
    longDescription: "Etech est une entreprise de services du numérique (ESN) experte en développement Web, Mobile et Logiciels. Nous travaillons pour des clients internationaux et offrons à nos collaborateurs un cadre d'apprentissage continu sur les dernières technologies (React, Node, Flutter, etc.).",
    logoUrl: 'https://ui-avatars.com/api/?name=Etech&background=2563eb&color=fff&size=128&font-size=0.4',
    coverUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2670&auto=format&fit=crop',
    jobs: 20,
    sector: 'Informatique',
    location: 'Antananarivo, Ivandry',
    website: 'etechconsulting-mg.com',
    founded: '2010',
    employees: '400+',
    perks: ['Hackathons internes', 'Salle de jeux', 'Horaires flexibles'],
    socials: [
        { type: 'linkedin', url: '#' },
        { type: 'facebook', url: '#' }
    ]
  },
  {
    id: 7,
    name: 'Ravinala Airports',
    description: "Gestionnaire des aéroports internationaux de Madagascar (Ivato et Nosy Be). Métiers de l'aérien.",
    logoUrl: 'https://ui-avatars.com/api/?name=Ravinala&background=059669&color=fff&size=128&font-size=0.4',
    jobs: 3,
    sector: 'Transport Aérien',
    location: 'Ivato',
    website: 'ravinala-airports.aero'
  },
  {
    id: 8,
    name: 'Nutri\'zaza',
    description: "Entreprise sociale luttant contre la malnutrition infantile à travers la distribution de la Koba Aina.",
    logoUrl: 'https://ui-avatars.com/api/?name=Nutri&background=84cc16&color=fff&size=128&font-size=0.4',
    jobs: 2,
    sector: 'Agroalimentaire',
    location: 'Antananarivo',
    website: 'nutrizaza.com'
  }
];

export const INDIVIDUALS: Individual[] = [
    {
        id: 101,
        name: "Famille Rakotoarisoa",
        needs: ["Soutien Scolaire", "Maths"],
        location: "Ambatobe, Tana",
        description: "Recherche étudiant(e) sérieux pour cours de Maths niveau 2nde, 2 fois par semaine.",
        activeOffers: 1,
        verified: true
    },
    {
        id: 102,
        name: "Mme. Bao",
        needs: ["Aide à domicile"],
        location: "Isoraka, Tana",
        description: "Besoin d'aide pour classement de documents administratifs et initiation informatique.",
        activeOffers: 1,
        verified: true
    },
    {
        id: 103,
        name: "Startupper (Anonyme)",
        needs: ["Freelance Dev", "MVP"],
        location: "Remote",
        description: "Je cherche un développeur junior pour m'aider à prototyper une application mobile le week-end.",
        activeOffers: 1,
        verified: false
    },
    {
        id: 104,
        name: "Mr. Andrianjafy",
        needs: ["Déménagement", "Manutention"],
        location: "Itaosy",
        description: "Besoin de 2 étudiants costauds pour aide au déménagement ce samedi matin.",
        activeOffers: 1,
        verified: true
    }
];