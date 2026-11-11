
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  province?: string;
  type: 'Stage' | 'Alternance' | 'CDD' | 'Job étudiant' | 'Mission' | 'Freelance' | 'CDI';
  tags: string[];
  description: string;
  postedAt: string;
  createdAt?: string;
  isDemo?: boolean;
  logoUrl: string;
  salary?: string;
  isUrgent?: boolean;
  remote?: boolean;
  duration?: string;
  experienceLevel?: 'Débutant' | 'Junior' | 'Confirmé' | 'Senior';
  requirements?: string;
  benefits?: string;
  ownerId?: string | number;
  candidates?: number;
  status?: string;
}

export interface NavItem {
  label: string;
  path: string;
}

export enum ApplicationStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface Message {
  id: string | number;
  senderId: string | number;
  receiverId: string | number;
  content: string;
  timestamp: string;
  read: boolean;
  subject?: string;
  replyTo?: string | number;
  requestStatus?: 'pending' | 'accepted' | 'declined';
  projectId?: string;
}

export interface Conversation {
  partnerId: string | number;
  partnerName: string;
  partnerAvatar: string;
  lastMessage: string;
  lastMessageDate: string;
  unreadCount: number;
}

export interface Review {
  id: string;
  reviewerName: string;
  reviewerId: string | number;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  jobTitle?: string;
}

export interface ProjectSupport {
  id: string;
  projectId: number | string;
  projectTitle: string;
  supporterId: string | number;
  supporterName: string;
  type: 'financing' | 'mentoring' | 'partnership';
  message: string;
  amount?: string; // Optionnel (si financement)
  date: string;
  status: 'pending' | 'accepted' | 'rejected';
}
