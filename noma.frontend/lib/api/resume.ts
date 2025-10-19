import { api } from '../axios';

export interface Resume {
  id: string;
  originalFileName: string;
  fileUrl: string;
  parsedText: string;
  uploadedAt: string;
}

export const resumeAPI = {
  upload: async (file: File): Promise<{ resume: Resume }> => {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await api.post('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getAll: async (): Promise<{ resumes: Resume[] }> => {
    const response = await api.get('/resume');
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/resume/${id}`);
    return response.data;
  },
};
