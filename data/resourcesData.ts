import { FileText, Rocket, DollarSign, UserPlus, Globe, Target, Handshake } from 'lucide-react';

export interface Project {
  id: number;
  title: string;
  student: string;
  school?: string;
  category: string;
  need: string;
  description: string;
  stage: string;
  progress: number;
  likes: number;
  tags: string[];
  imageColor: string;
  // Extended details
  problem?: string;
  solution?: string;
  team?: { name: string; role: string; avatar?: string }[];
  roadmap?: { date: string; title: string; done: boolean }[];
  gallery?: string[];
}

export interface Tool {
  title: string;
  type: string;
  downloads: string;
  icon: any;
}

export interface Guide {
  title: string;
  desc: string;
  color: string;
  icon: any;
}

export const FEATURED_PROJECTS: Project[] = [
  {
    id: 1,
    title: "Agri-Connect Mada",
    student: "Riana A.",
    school: "Polytechnique (ESPA)",
    category: "Agritech",
    need: "Financement & Partenariat",
    description: "Application mobile reliant directement les petits producteurs de la région Vakinankaratra aux restaurants de Tana sans intermédiaires. Déjà 50 agriculteurs inscrits.",
    stage: "Prototype",
    progress: 75,
    likes: 124,
    tags: ["Tech", "Agriculture", "Circuit-court"],
    imageColor: "bg-green-100 text-green-600",
    problem: "Les agriculteurs perdent 40% de leurs revenus à cause des multiples intermédiaires, tandis que les restaurants peinent à trouver des produits frais et traçables.",
    solution: "Une marketplace mobile simple (USSD + App) qui permet aux coopératives de lister leurs récoltes et aux restaurateurs de commander en direct. Logistique mutualisée via taxi-brousse partenaires.",
    team: [
        { name: "Riana Andrian", role: "CEO & Dev", avatar: "https://ui-avatars.com/api/?name=Riana+A&background=random" },
        { name: "Soa M.", role: "Commercial", avatar: "https://ui-avatars.com/api/?name=Soa+M&background=random" },
        { name: "Kevin R.", role: "Logistique", avatar: "https://ui-avatars.com/api/?name=Kevin+R&background=random" }
    ],
    roadmap: [
        { date: "Jan 2024", title: "Étude de marché Vakinankaratra", done: true },
        { date: "Mars 2024", title: "Développement MVP (USSD)", done: true },
        { date: "Juin 2024", title: "Test avec 10 restaurants", done: false },
        { date: "Sept 2024", title: "Lancement officiel", done: false }
    ]
  },
  {
    id: 2,
    title: "Bio-Brique",
    student: "Tahina & Lucas",
    school: "IST Antananarivo",
    category: "Construction",
    need: "Contrat d'exploitation",
    description: "Production de briques écologiques à base de déchets plastiques recyclés et de latérite compactée. Isolation thermique supérieure de 30%.",
    stage: "MVP prêt",
    progress: 90,
    likes: 89,
    tags: ["Écologie", "Industrie", "Recyclage"],
    imageColor: "bg-orange-100 text-orange-600",
    problem: "La cuisson des briques traditionnelles ravage les forêts malgaches. De plus, les déchets plastiques envahissent nos villes.",
    solution: "Un procédé de compression à froid mélangeant terre latérite et plastique broyé. Résultat : une brique 2x plus solide, isolante, et sans cuisson.",
    team: [
        { name: "Tahina R.", role: "Ingénieur Matériaux", avatar: "https://ui-avatars.com/api/?name=Tahina&background=random" },
        { name: "Lucas B.", role: "Gestion de Projet", avatar: "https://ui-avatars.com/api/?name=Lucas&background=random" }
    ],
    roadmap: [
        { date: "Fév 2024", title: "Validation formule chimique", done: true },
        { date: "Avril 2024", title: "Prototype presse hydraulique", done: true },
        { date: "Mai 2024", title: "Certification Labo BTP", done: true },
        { date: "Juillet 2024", title: "Première maison témoin", done: false }
    ]
  },
  {
    id: 3,
    title: "EduGasy SMS",
    student: "Fara R.",
    school: "UCM - Sciences Sociales",
    category: "EdTech",
    need: "Mentorat",
    description: "Plateforme de soutien scolaire gamifiée pour les élèves de primaire en zone rurale via SMS/USSD, sans besoin de connexion internet.",
    stage: "Idée",
    progress: 30,
    likes: 215,
    tags: ["Education", "Social", "Low-tech"],
    imageColor: "bg-blue-100 text-blue-600",
    problem: "70% des élèves en zone rurale n'ont pas accès à internet pour réviser, créant une fracture numérique et éducative majeure.",
    solution: "Des quiz de révision (Maths, Malagasy, Français) envoyés par SMS. Un système de points échangeables contre des crédits téléphoniques ou fournitures.",
    team: [
        { name: "Fara R.", role: "Pédagogie & Contenu", avatar: "https://ui-avatars.com/api/?name=Fara&background=random" }
    ],
    roadmap: [
        { date: "Mars 2024", title: "Conception des programmes", done: true },
        { date: "Mai 2024", title: "Recherche partenaire Telma/Orange", done: false },
        { date: "Aout 2024", title: "Pilote dans 2 écoles", done: false }
    ]
  }
];

export const TOOLS: Tool[] = [
    { title: "Modèle CV Malagasy", type: "Word", downloads: "2k+", icon: FileText },
    { title: "Pitch Deck Startup", type: "PowerPoint", downloads: "850", icon: Rocket },
    { title: "Lettre de Motivation", type: "Word", downloads: "1.5k", icon: FileText },
];

export const GUIDES: Guide[] = [
    {
        title: "Rédiger un CV pour le marché Malgache",
        desc: "Ce que regardent vraiment les recruteurs locaux. Exit les CV de 3 pages.",
        color: "bg-yellow-50 text-yellow-700",
        icon: FileText
    },
    {
        title: "Financer son projet étudiant",
        desc: "Fihariana, concours, business angels : où trouver l'argent ?",
        color: "bg-green-50 text-green-700",
        icon: DollarSign
    },
    {
        title: "Réussir son entretien d'embauche",
        desc: "Les questions pièges et comment gérer le stress.",
        color: "bg-purple-50 text-purple-700",
        icon: UserPlus
    },
    {
        title: "Devenir Freelance à Mada",
        desc: "Statut NIF/STAT, paiement mobile money, trouver des clients.",
        color: "bg-blue-50 text-blue-700",
        icon: Globe
    },
    {
        title: "Le Pitch Parfait",
        desc: "Convaincre un investisseur en 3 minutes chrono.",
        color: "bg-orange-50 text-orange-700",
        icon: Target
    },
    {
        title: "Networking Efficace",
        desc: "Comment utiliser LinkedIn et les événements Tana pour son réseau.",
        color: "bg-pink-50 text-pink-700",
        icon: Handshake
    }
];

export const FAQ_ITEMS = [
    {
        question: "Est-ce que Rise prend une commission sur mon projet ?",
        answer: "Non, Rise est 100% gratuit pour les étudiants. Notre objectif est de vous donner de la visibilité. Si un investisseur vous contacte, la négociation se fait directement entre vous."
    },
    {
        question: "Qui peut voir mon projet ?",
        answer: "Tout le monde : les autres étudiants, mais surtout les entreprises partenaires (Telma, Axian, etc.) et les business angels qui surveillent la plateforme pour dénicher des pépites."
    },
    {
        question: "Mon idée est-elle protégée ?",
        answer: "Votre projet reste votre propriété intellectuelle. Nous vous conseillons de ne publier que les informations publiques (le pitch) et de garder les détails techniques (le 'secret sauce') pour les rendez-vous privés."
    }
];