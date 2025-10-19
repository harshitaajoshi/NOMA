'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Download, Trash2, Eye, Sparkles, Calendar } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

interface Resume {
  id: string;
  name: string;
  uploadedAt: string;
  size: string;
  type: 'original' | 'tweaked';
  tailoredFor?: string;
  matchScore?: number;
}

export default function ResumesPage() {
  const [isDragging, setIsDragging] = useState(false);

  // Mock data - will be replaced with real data from backend
  const [resumes, setResumes] = useState<Resume[]>([
    {
      id: '1',
      name: 'Resume_Original.pdf',
      uploadedAt: '2025-10-15',
      size: '245 KB',
      type: 'original',
    },
    {
      id: '2',
      name: 'Resume_Tesla_ML.pdf',
      uploadedAt: '2025-10-18',
      size: '248 KB',
      type: 'tweaked',
      tailoredFor: 'Tesla - ML Intern',
      matchScore: 92,
    },
    {
      id: '3',
      name: 'Resume_Google_SWE.pdf',
      uploadedAt: '2025-10-19',
      size: '251 KB',
      type: 'tweaked',
      tailoredFor: 'Google - SWE Intern',
      matchScore: 87,
    },
  ]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file upload here
    console.log('Files dropped:', e.dataTransfer.files);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Resume Library</h1>
          <p className="text-gray-400">Upload and manage your resume versions</p>
        </div>

        {/* Upload Section */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-xl p-12 transition-all
            ${isDragging
              ? 'border-white/30 bg-white/5'
              : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
            }
          `}
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Upload your resume</h3>
            <p className="text-sm text-gray-400 mb-6">
              Drag and drop your resume here, or click to browse
            </p>
            <input
              type="file"
              id="resume-upload"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={(e) => console.log('File selected:', e.target.files)}
            />
            <label
              htmlFor="resume-upload"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-200 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Choose File
            </label>
            <p className="text-xs text-gray-600 mt-4">
              Supports: PDF, DOC, DOCX (Max 5MB)
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
            <p className="text-sm text-gray-400 mb-1">Total Resumes</p>
            <p className="text-2xl font-bold">{resumes.length}</p>
          </div>
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
            <p className="text-sm text-gray-400 mb-1">AI-Tweaked</p>
            <p className="text-2xl font-bold text-purple-400">
              {resumes.filter((r) => r.type === 'tweaked').length}
            </p>
          </div>
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
            <p className="text-sm text-gray-400 mb-1">Avg Match Score</p>
            <p className="text-2xl font-bold text-green-400">89%</p>
          </div>
        </div>

        {/* Resume List */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Your Resumes</h2>
          <div className="space-y-3">
            {resumes.map((resume, index) => (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/[0.02] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* File Icon */}
                    <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-gray-400" />
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{resume.name}</h3>
                        {resume.type === 'tweaked' && (
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full">
                            <Sparkles className="w-3 h-3" />
                            <span className="text-xs font-medium">AI-Tweaked</span>
                          </div>
                        )}
                        {resume.type === 'original' && (
                          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-medium">
                            Original
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{resume.uploadedAt}</span>
                        </div>
                        <span>{resume.size}</span>
                        {resume.tailoredFor && (
                          <span className="text-gray-400">
                            Tailored for: <span className="text-white font-medium">{resume.tailoredFor}</span>
                          </span>
                        )}
                      </div>

                      {resume.matchScore && (
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                                style={{ width: `${resume.matchScore}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-green-400">
                              {resume.matchScore}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                      <Download className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {resumes.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-lg font-semibold mb-2">No resumes yet</h3>
            <p className="text-sm text-gray-500 mb-6">
              Upload your first resume to get started with AI-powered optimization
            </p>
          </div>
        )}

        {/* Tips Section */}
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            Pro Tips
          </h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>Upload your base resume first, then use AI to tailor it for specific roles</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>Each tweaked resume is optimized for ATS (Applicant Tracking Systems)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>Keep your original resume updated as you gain new skills and experiences</span>
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}

