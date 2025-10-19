'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Download, Trash2, Eye, Sparkles, Calendar, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { resumeAPI, Resume } from '@/lib/api/resume';
import { useResumeStore } from '@/lib/store';

export default function ResumesPage() {
  const { resumes, setResumes } = useResumeStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      setIsLoading(true);
      const result = await resumeAPI.getAll();
      setResumes(result.resumes);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load resumes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setError('');
      const result = await resumeAPI.upload(file);
      setResumes([...resumes, result.resume]);
      alert('Resume uploaded successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload resume');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      setDeletingId(id);
      await resumeAPI.delete(id);
      setResumes(resumes.filter(r => r._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete resume');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400">Loading resumes...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Resume Library</h1>
          <p className="text-gray-400">Upload and manage your resume versions</p>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

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
            ${isUploading ? 'opacity-50 pointer-events-none' : ''}
          `}
        >
          {isUploading ? (
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gray-400" />
              <p className="text-gray-400">Uploading and parsing your resume...</p>
            </div>
          ) : (
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
                onChange={handleFileSelect}
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
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
            <p className="text-sm text-gray-400 mb-1">Total Resumes</p>
            <p className="text-2xl font-bold">{resumes.length}</p>
          </div>
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
            <p className="text-sm text-gray-400 mb-1">Uploaded</p>
            <p className="text-2xl font-bold text-green-400">{resumes.length}</p>
          </div>
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
            <p className="text-sm text-gray-400 mb-1">Storage Used</p>
            <p className="text-2xl font-bold text-blue-400">
              {(resumes.length * 250).toFixed(0)} KB
            </p>
          </div>
        </div>

        {/* Resume List */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Your Resumes</h2>
          {resumes.length > 0 ? (
            <div className="space-y-3">
              {resumes.map((resume, index) => (
                <motion.div
                  key={resume._id}
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
                          <h3 className="font-medium truncate">{resume.originalFileName}</h3>
                          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-medium">
                            Original
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(resume.uploadedAt).toLocaleDateString()}</span>
                          </div>
                          <span>Parsed successfully</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => window.open(resume.fileUrl, '_blank')}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <a
                        href={resume.fileUrl}
                        download={resume.originalFileName}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4 text-gray-500" />
                      </a>
                      <button
                        onClick={() => handleDelete(resume._id)}
                        disabled={deletingId === resume._id}
                        className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {deletingId === resume._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/[0.02] border border-white/10 rounded-xl">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-lg font-semibold mb-2">No resumes yet</h3>
              <p className="text-sm text-gray-500 mb-6">
                Upload your first resume to get started with AI-powered optimization
              </p>
            </div>
          )}
        </div>

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


