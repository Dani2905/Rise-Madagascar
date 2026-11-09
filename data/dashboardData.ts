
import { Users, Briefcase, Eye, MessageSquare, CheckCircle, Clock, XCircle, Search } from 'lucide-react';

export const COMPANY_DASHBOARD_DATA = {
  companyName: "",
  role: "",
  logoUrl: "",
  stats: {
    activeJobs: 0,
    totalCandidates: 0,
    views: 0,
    newMessages: 0
  },
  activeJobsList: [],
  candidates: []
};

export const INDIVIDUAL_DASHBOARD_DATA = {
  companyName: "",
  role: "",
  location: "",
  avatarUrl: "",
  logoUrl: "",
  stats: {
    activeJobs: 0,
    totalCandidates: 0,
    views: 0,
    newMessages: 0
  },
  activeJobsList: [],
  candidates: []
};
