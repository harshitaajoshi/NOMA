'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Bell, Loader2 } from 'lucide-react';
import { trackerAPI } from '@/lib/api/tracker';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  internship: {
    _id?: string;
    company: string;
    role: string;
    deadline?: string;
  };
  trackedId?: string;
  onSuccess?: () => void;
  onError?: () => void;
}

export default function ReminderModal({ isOpen, onClose, internship, trackedId, onSuccess, onError }: ReminderModalProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSetReminder = async () => {
    if (!selectedDate || !trackedId) {
      setError('Please select a date');
      return;
    }

    try {
      setIsSaving(true);
      setError('');

      // Combine date and time
      const reminderDateTime = `${selectedDate}T${selectedTime}:00.000Z`;

      await trackerAPI.update(trackedId, {
        remindDate: reminderDateTime,
      });

      onClose();
      
      // Trigger success toast
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to set reminder');
      
      // Trigger error toast
      if (onError) {
        onError();
      }
    } finally {
      setIsSaving(false);
    }
  };

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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-black border border-white/10 rounded-2xl overflow-hidden mx-4">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Bell className="w-5 h-5 text-blue-400" />
                    Set Reminder
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {internship.company} - {internship.role}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Error */}
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Deadline Info */}
                {internship.deadline && (
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-400">Application Deadline:</span>
                      <span className="font-medium text-blue-400">
                        {new Date(internship.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Date Picker */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Remind me on
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>
                </div>

                {/* Time Picker */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    At time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>
                </div>

                {/* Quick Options */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-300">
                    Quick options
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        setSelectedDate(tomorrow.toISOString().split('T')[0]);
                      }}
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:border-white/20 transition-all"
                    >
                      Tomorrow
                    </button>
                    <button
                      onClick={() => {
                        const nextWeek = new Date();
                        nextWeek.setDate(nextWeek.getDate() + 7);
                        setSelectedDate(nextWeek.toISOString().split('T')[0]);
                      }}
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:border-white/20 transition-all"
                    >
                      1 Week
                    </button>
                    {internship.deadline && (
                      <>
                        <button
                          onClick={() => {
                            const twoDaysBefore = new Date(internship.deadline!);
                            twoDaysBefore.setDate(twoDaysBefore.getDate() - 2);
                            setSelectedDate(twoDaysBefore.toISOString().split('T')[0]);
                          }}
                          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:border-white/20 transition-all"
                        >
                          2 Days Before
                        </button>
                        <button
                          onClick={() => {
                            const oneDayBefore = new Date(internship.deadline!);
                            oneDayBefore.setDate(oneDayBefore.getDate() - 1);
                            setSelectedDate(oneDayBefore.toISOString().split('T')[0]);
                          }}
                          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:border-white/20 transition-all"
                        >
                          1 Day Before
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Preview */}
                {selectedDate && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-500/5 border border-green-500/20 rounded-xl p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Bell className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-400 mb-1">
                          Reminder Preview
                        </p>
                        <p className="text-xs text-gray-400">
                          You'll be reminded to apply for <span className="font-medium text-white">{internship.company}</span> on{' '}
                          <span className="font-medium text-white">
                            {new Date(selectedDate).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>{' '}
                          at <span className="font-medium text-white">{selectedTime}</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10">
                <button
                  onClick={onClose}
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:border-white/20 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSetReminder}
                  disabled={!selectedDate || isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Setting...
                    </>
                  ) : (
                    <>
                      <Bell className="w-4 h-4" />
                      Set Reminder
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

