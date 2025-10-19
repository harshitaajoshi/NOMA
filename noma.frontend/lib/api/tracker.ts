import { api } from '../axios';

export type ApplicationStatus = 'saved' | 'applied' | 'interviewing' | 'offer' | 'rejected';

export interface TrackedInternship {
  id: string;
  internshipId: string;
  status: ApplicationStatus;
  remindDate?: string;
  notes?: string;
  addedAt: string;
  appliedAt?: string;
  internship?: {
    company: string;
    role: string;
    location: string;
    deadline?: string;
    applyLink: string;
    description?: string;
  };
}

export const trackerAPI = {
  add: async (data: {
    internshipId: string;
    status?: ApplicationStatus;
    remindDate?: string;
    notes?: string;
  }): Promise<{ tracked: TrackedInternship }> => {
    const response = await api.post('/tracker', data);
    return response.data;
  },

  getAll: async (): Promise<{ tracked: TrackedInternship[] }> => {
    const response = await api.get('/tracker');
    return response.data;
  },

  update: async (
    id: string,
    data: {
      status?: ApplicationStatus;
      remindDate?: string;
      notes?: string;
    }
  ): Promise<{ tracked: TrackedInternship }> => {
    const response = await api.put(`/tracker/${id}`, data);
    return response.data;
  },

  remove: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/tracker/${id}`);
    return response.data;
  },

  getUpcomingReminders: async (): Promise<{ reminders: TrackedInternship[] }> => {
    const response = await api.get('/tracker/reminders/upcoming');
    return response.data;
  },
};
