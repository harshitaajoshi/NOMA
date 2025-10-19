import { api } from '../axios';

export interface DashboardStats {
  totalTracked: number;
  appliedCount: number;
  remindersSet: number;
  avgMatchScore: number;
  statusBreakdown: {
    'apply-later': number;
    applied: number;
    interview: number;
    offer: number;
    rejected: number;
  };
  upcomingDeadlines: Array<{
    internship: {
      company: string;
      role: string;
      deadline: string;
    };
    daysLeft: number;
  }>;
  recentActivity: Array<{
    type: string;
    internship: string;
    timestamp: string;
  }>;
}

export interface DashboardInsights {
  totalInternships: number;
  totalResumes: number;
  tweakedResumes: number;
  applicationRate: number;
  topCompanies: Array<{ company: string; count: number }>;
  successRate: number;
}

export const dashboardAPI = {
  getStats: async (): Promise<{ stats: DashboardStats }> => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  getInsights: async (): Promise<{ insights: DashboardInsights }> => {
    const response = await api.get('/dashboard/insights');
    return response.data;
  },
};


