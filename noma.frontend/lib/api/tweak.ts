import { api } from '../axios';

export interface TweakedResume {
  id: string;
  resumeId: string;
  internshipId: string;
  matchScore: number;
  // Gemini returns either plain strings or objects with details.
  matchedSkills: (string | { skill: string; importance?: string })[];
  missingSkills: (string | { skill: string; importance?: string })[];
  suggestions: (string | { suggestion: string; priority?: string; section?: string })[];
  tweakedContent: string;
  createdAt: string;
}

export const tweakAPI = {
  analyze: async (data: {
    resumeId: string;
    internshipId: string;
    internship?: any;
  }): Promise<{ message: string; analysis: TweakedResume }> => {
    const response = await api.post('/tweak/analyze', data);
    return response.data;
  },

  quickScore: async (data: {
    resumeId: string;
    internshipId: string;
  }): Promise<{ score: number }> => {
    const response = await api.post('/tweak/quick-score', data);
    return response.data;
  },

  download: async (id: string): Promise<Blob> => {
    const response = await api.get(`/tweak/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
