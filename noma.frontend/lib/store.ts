import { create } from 'zustand';

interface Resume {
  id: string;
  originalFileName: string;
  fileUrl: string;
  parsedText: string;
  uploadedAt: string;
}

interface ResumeState {
  resumes: Resume[];
  selectedResume: Resume | null;
  setResumes: (resumes: Resume[]) => void;
  setSelectedResume: (resume: Resume | null) => void;
  addResume: (resume: Resume) => void;
}

export const useResumeStore = create<ResumeState>((set) => ({
  resumes: [],
  selectedResume: null,
  setResumes: (resumes) => set({ resumes }),
  setSelectedResume: (resume) => set({ selectedResume: resume }),
  addResume: (resume) => set((state) => ({ resumes: [...state.resumes, resume] })),
}));

export interface Internship {
  id: string;
  company: string;
  role: string;
  location: string;
  deadline?: string;
  applyLink: string;
  description?: string;
  tags?: string[];
  sourceRepo?: string;
  isActive?: boolean;
}

interface InternshipState {
  internships: Internship[];
  trackedInternships: any[];
  setInternships: (internships: Internship[]) => void;
  setTrackedInternships: (tracked: any[]) => void;
}

export const useInternshipStore = create<InternshipState>((set) => ({
  internships: [],
  trackedInternships: [],
  setInternships: (internships) => set({ internships }),
  setTrackedInternships: (tracked) => set({ trackedInternships: tracked }),
}));
