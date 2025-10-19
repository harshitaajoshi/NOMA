'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check, AlertCircle, TrendingUp, Target, Zap } from 'lucide-react';
import { tweakAPI, TweakedResume } from '@/lib/api/tweak';
import { useResumeStore } from '@/lib/store';

interface ResumeTweakModalProps {
  isOpen: boolean;
  onClose: () => void;
  internship: {
    id?: string;
    company: string;
    role: string;
    location?: string;
    description?: string;
    fullData?: any;
  };
  onTweakComplete?: () => void;
  existingAnalysis?: TweakedResume | null;
}

export default function ResumeTweakModal({ isOpen, onClose, internship, onTweakComplete, existingAnalysis }: ResumeTweakModalProps) {
  const { resumes } = useResumeStore();
  const [step, setStep] = useState<'analyzing' | 'results' | 'error'>('analyzing');
  const [analysis, setAnalysis] = useState<TweakedResume | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (existingAnalysis) {
        // If we have existing analysis, show it directly
        setAnalysis(existingAnalysis);
        setStep('results');
      } else if (internship.id) {
        // Otherwise, run new analysis
        analyzeResume();
      }
    }
  }, [isOpen, internship.id, existingAnalysis]);

  const analyzeResume = async () => {
    if (!internship.id || resumes.length === 0) {
      setError('Please upload a resume first');
      setStep('error');
      return;
    }

    try {
      setStep('analyzing');
      setError('');
      
      // Use the first/most recent resume
      const resumeId = resumes[0].id;
      
      const result = await tweakAPI.analyze({
        resumeId,
        internshipId: internship.id,
        internship: internship.fullData || {
          id: internship.id,
          company: internship.company,
          role: internship.role,
          location: internship.location || 'Remote',
          description: internship.description || ''
        }
      });

      setAnalysis(result.analysis);
      setStep('results');
      
      // Notify parent to reload tweaked resumes
      if (onTweakComplete) {
        onTweakComplete();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to analyze resume');
      setStep('error');
    }
  };

  // Removed PDF download functionality - focusing on AI insights only

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-10 lg:inset-20 z-50 overflow-hidden"
          >
            <div className="h-full bg-black border border-white/10 rounded-2xl flex flex-col">
              {/* Header */}
              <div className="relative px-6 py-5 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30">
                    <Sparkles className="w-6 h-6 text-white animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      AI Resume Insights
                    </h2>
                    <p className="text-sm text-gray-300 mt-1 font-medium">
                      {internship.company} · {internship.role}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                      <Zap className="w-3 h-3" />
                      Powered by Google Gemini AI
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {step === 'analyzing' ? (
                  // Analyzing State
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                      >
                        <Sparkles className="w-8 h-8" />
                      </motion.div>
                      <h3 className="text-xl font-semibold mb-2">Analyzing your resume...</h3>
                      <p className="text-gray-400">
                        AI is comparing your resume with the job description
                      </p>
                    </div>
                  </div>
                ) : step === 'error' ? (
                  // Error State
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-6 bg-red-500/10 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-red-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-red-400">Analysis Failed</h3>
                      <p className="text-gray-400 mb-6">{error}</p>
                      <button
                        onClick={analyzeResume}
                        className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-all"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                ) : analysis ? (
                  // Results State
                  <div className="space-y-6">
                    {/* Match Score */}
                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">Match Score</h3>
                          <p className="text-sm text-gray-400">
                            Your resume compatibility with this role
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-4xl font-bold text-purple-400">
                            {analysis.matchScore}%
                          </div>
                          <div className="flex items-center gap-1 text-sm text-green-400 mt-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>Excellent match!</span>
                          </div>
                        </div>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${analysis.matchScore}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        />
                      </div>
                    </div>

                    {/* Skills Analysis */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Matched Skills */}
                      <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                            <Check className="w-4 h-4 text-green-400" />
                          </div>
                          <h4 className="font-semibold">Matched Skills</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {analysis.matchedSkills.map((skill, idx) => (
                            <span
                              key={`matched-${idx}`}
                              className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-sm"
                            >
                              {typeof skill === 'object' ? skill.skill : skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Missing Skills */}
                      <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center">
                            <AlertCircle className="w-4 h-4 text-red-400" />
                          </div>
                          <h4 className="font-semibold">Missing Skills</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {analysis.missingSkills.map((skill, idx) => (
                            <span
                              key={`missing-${idx}`}
                              className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-sm"
                            >
                              {typeof skill === 'object' ? skill.skill : skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Suggestions */}
                    <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5">
                      <h4 className="font-semibold mb-4">AI Suggestions</h4>
                      <div className="space-y-3">
                        {analysis.suggestions.map((suggestion, index) => (
                          <div
                            key={`suggestion-${index}`}
                            className="flex gap-3 p-3 bg-white/[0.02] border border-white/10 rounded-lg"
                          >
                            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Sparkles className="w-4 h-4 text-blue-400" />
                            </div>
                            <div>
                              {typeof suggestion === 'object' ? (
                                <>
                                  {suggestion.priority && (
                                    <span className={`inline-block px-2 py-0.5 rounded text-xs mb-1 ${
                                      suggestion.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                      suggestion.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                      'bg-blue-500/20 text-blue-400'
                                    }`}>
                                      {suggestion.priority}
                                    </span>
                                  )}
                                  <p className="text-sm">{suggestion.suggestion || JSON.stringify(suggestion)}</p>
                                </>
                              ) : (
                                <p className="text-sm">{String(suggestion)}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                      {/* Action Items */}
                    <div className="bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 border border-blue-500/20 rounded-xl p-5">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-400" />
                        Next Steps to Improve Your Match
                      </h4>
                      <div className="space-y-3">
                        {analysis.missingSkills.slice(0, 3).map((skill, idx) => (
                          <div key={`action-${idx}`} className="flex items-start gap-3 p-3 bg-white/[0.02] rounded-lg border border-white/10">
                            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-blue-400 font-bold text-sm">{idx + 1}</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-white mb-1">
                                Add {typeof skill === 'object' ? skill.skill : skill} to your resume
                              </p>
                              <p className="text-xs text-gray-400">
                                This is a {typeof skill === 'object' && skill.importance ? skill.importance : 'key'} skill for this role
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Footer */}
              {step === 'results' && analysis && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-gradient-to-r from-purple-500/5 to-blue-500/5">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Insights saved for this internship</span>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg text-sm font-medium hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg shadow-purple-500/20"
                  >
                    Got it, thanks!
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

