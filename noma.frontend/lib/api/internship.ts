import { api } from '../axios';

export interface Internship {
  id: string;
  company: string;
  role: string;
  location: string;
  deadline?: string;
  description?: string;
  applyLink: string;
  sourceRepo?: string;
  tags?: string[];
  isActive?: boolean;
}

export interface InternshipStats {
  total: number;
  withDeadlines: number;
  companies: number;
  locations: number;
}

export const internshipAPI = {
  getAll: async (params?: {
    search?: string;
    location?: string;
    company?: string;
  }): Promise<{ internships: Internship[]; total: number }> => {
    const response = await api.get('/internships', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Internship> => {
    const response = await api.get(`/internships/${id}`);
    return response.data;
  },

  search: async (query: string): Promise<{ internships: Internship[]; total: number }> => {
    const response = await api.get(`/internships?search=${query}`);
    return response.data;
  },

  getStats: async (): Promise<InternshipStats> => {
    const response = await api.get('/internships/stats');
    return response.data;
  },

  refresh: async (): Promise<{ message: string; count: number }> => {
    const response = await api.post('/internships/refresh');
    return response.data;
  },
};
