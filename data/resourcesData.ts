import { FileText, Rocket, DollarSign, UserPlus, Globe, Target, Handshake } from 'lucide-react';

export interface Project {
  id: number | string;
  isDemo?: boolean;
  ownerId?: number | string;
  createdAt?: string;
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
  filename: string;
  content: string;
  icon: any;
}

export interface Guide {
  title: string;
  desc: string;
  color: string;
  icon: any;
  tips: string[];
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
    { title: 'Modèle de CV étudiant', filename: 'modele-cv-etudiant.txt', icon: FileText, content: `PRÉNOM NOM
Ville | Téléphone | Adresse e-mail | Lien professionnel (facultatif)

PROFIL
En deux phrases : votre formation, vos compétences et le type d’opportunité recherché.

FORMATION
Année – Diplôme, établissement, ville

EXPÉRIENCES ET PROJETS
Dates – Poste ou projet, structure
• Action réalisée et résultat concret

COMPÉTENCES
Techniques : ...
Langues : ...

CENTRES D’INTÉRÊT (facultatif)
...
` },
    { title: 'Trame de présentation de projet', filename: 'trame-pitch-projet.txt', icon: Rocket, content: `TRAME DE PRÉSENTATION DE PROJET

1. Nom du projet et équipe
2. Problème identifié et public concerné
3. Solution proposée et bénéfices
4. Avancement et premiers retours
5. Ressources nécessaires : budget, compétences, partenaires
6. Prochaines étapes et proposition de collaboration
7. Contact

Ne publiez pas d’informations confidentielles sans protection adaptée.
` },
    { title: 'Trame de lettre de motivation', filename: 'trame-lettre-motivation.txt', icon: FileText, content: `PRÉNOM NOM
Coordonnées

DESTINATAIRE
Organisation et ville

Objet : candidature à [intitulé de l’offre]

Madame, Monsieur,

Présentez votre formation et expliquez pourquoi cette offre vous intéresse.

Décrivez une expérience ou un projet pertinent et ce que vous pourriez apporter.

Proposez un échange et indiquez votre disponibilité.

Formule de politesse
Prénom Nom
` }
];

export const GUIDES: Guide[] = [
    { title: 'Rédiger un CV clair', desc: 'Présentez votre parcours et vos compétences en lien avec l’offre.', color: 'bg-yellow-50 text-yellow-700', icon: FileText, tips: ['Indiquez des coordonnées à jour et un titre adapté au poste.', 'Classez formation, expériences et projets du plus récent au plus ancien.', 'Illustrez chaque expérience par une action concrète et relisez les dates.'] },
    { title: 'Préparer le financement d’un projet', desc: 'Clarifiez vos besoins avant de solliciter des soutiens.', color: 'bg-green-50 text-green-700', icon: DollarSign, tips: ['Établissez un budget prévisionnel et distinguez dépenses initiales et récurrentes.', 'Décrivez le montant ou les ressources recherchés ainsi que leur utilisation.', 'Vérifiez les critères et conditions des programmes ou partenaires avant de candidater.'] },
    { title: 'Préparer un entretien', desc: 'Présentez vos expériences et posez des questions utiles.', color: 'bg-purple-50 text-purple-700', icon: UserPlus, tips: ['Relisez l’offre et renseignez-vous sur l’organisation.', 'Préparez des exemples précis de situations, d’actions et de résultats.', 'Demandez des précisions sur les missions, le calendrier et les conditions.'] },
    { title: 'Démarrer une activité freelance', desc: 'Définissez votre offre et sécurisez vos premières missions.', color: 'bg-blue-50 text-blue-700', icon: Globe, tips: ['Décrivez vos services, livrables, délais et tarifs avant de démarcher.', 'Formalisez par écrit les conditions, les révisions et les modalités de paiement.', 'Renseignez-vous auprès des organismes compétents sur les obligations légales et fiscales applicables à votre situation.'] },
    { title: 'Présenter son projet', desc: 'Expliquez clairement le problème, la solution et vos besoins.', color: 'bg-orange-50 text-orange-700', icon: Target, tips: ['Commencez par le problème et les personnes concernées.', 'Montrez la solution, son état d’avancement et les retours obtenus.', 'Terminez par une demande précise et une prochaine étape.'] },
    { title: 'Développer son réseau', desc: 'Construisez des échanges professionnels utiles et respectueux.', color: 'bg-pink-50 text-pink-700', icon: Handshake, tips: ['Présentez-vous brièvement et personnalisez chaque prise de contact.', 'Expliquez ce que vous recherchez et proposez un échange concret.', 'Faites un suivi courtois et respectez les données personnelles de vos interlocuteurs.'] }
];

export const FAQ_ITEMS = [
    {
        question: "Faut-il un abonnement pour publier un projet ?",
        answer: `Les étudiants peuvent consulter les projets avec un compte gratuit. Un abonnement étudiant actif est nécessaire pour publier un projet ou postuler à une offre ; son activation est simulée dans cette démonstration.`
    },
    {
        question: "Qui peut voir mon projet ?",
        answer: "Les visiteurs, étudiants, entreprises et particuliers peuvent consulter les projets affichés. Dans cette démonstration, les données restent dans le navigateur utilisé."
    },
    {
        question: "Mon idée est-elle protégée ?",
        answer: "La publication ne constitue pas une protection juridique de votre idée. Ne partagez que des informations que vous acceptez de rendre visibles et demandez un conseil adapté si nécessaire."
    }
];