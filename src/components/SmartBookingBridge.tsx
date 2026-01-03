import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Calendar as CalendarIcon, Clock, CheckCircle, Loader2 } from 'lucide-react';

interface SmartBookingBridgeProps {
  isOpen: boolean;
  onClose: () => void;
  firstName: string;
  lastName: string;
  email: string;
  webhookUrl: string;
  hasExternalSystem: boolean;
  externalBookingUrl?: string;
}

type Stage = 'phone' | 'redirecting' | 'calendar' | 'success';

export function SmartBookingBridge({
  isOpen,
  onClose,
  firstName,
  lastName,
  email,
  webhookUrl,
  hasExternalSystem,
  externalBookingUrl,
}: SmartBookingBridgeProps) {
  const [stage, setStage] = useState<Stage>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStage('phone');
      setPhoneNumber('');
      setSelectedDate('');
      setPreferredTime('');
    }
  }, [isOpen]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phoneNumber,
          stage: 'phone_captured',
        }),
      });

      if (hasExternalSystem && externalBookingUrl) {
        setStage('redirecting');
        setTimeout(() => {
          window.location.href = externalBookingUrl;
        }, 2000);
      } else {
        setStage('calendar');
      }
    } catch (error) {
      console.error('Error submitting phone number:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCalendarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phoneNumber,
          selectedDate,
          preferredTime,
          stage: 'appointment_requested',
        }),
      });

      setStage('success');
    } catch (error) {
      console.error('Error submitting appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 60);
    return maxDate.toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  const content = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && stage !== 'redirecting') {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            {stage === 'phone' && (
              <div className="p-8 md:p-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <Phone className="text-blue-600" size={28} />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Almost There!
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                    aria-label="Close"
                  >
                    <X size={24} />
                  </button>
                </div>

                <p className="text-gray-600 mb-8 leading-relaxed">
                  Please enter your mobile number to receive a booking confirmation code and ensure we can reach you if the connection drops.
                </p>

                <form onSubmit={handlePhoneSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="(555) 123-4567"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                    />
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Privacy First:</span> We'll only use this number for appointment confirmations and critical updates.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !phoneNumber}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Processing...
                      </>
                    ) : (
                      'Continue'
                    )}
                  </button>
                </form>
              </div>
            )}

            {stage === 'redirecting' && (
              <div className="p-8 md:p-10 text-center">
                <div className="flex justify-center mb-6">
                  <div className="bg-blue-100 p-4 rounded-full">
                    <Loader2 className="text-blue-600 animate-spin" size={48} />
                  </div>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                  Redirecting to Secure Booking System...
                </h2>
                <p className="text-gray-600">
                  Please wait while we transfer you to our secure scheduling platform.
                </p>
              </div>
            )}

            {stage === 'calendar' && (
              <div className="p-8 md:p-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <CalendarIcon className="text-blue-600" size={28} />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Choose Your Preferred Time
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                    aria-label="Close"
                  >
                    <X size={24} />
                  </button>
                </div>

                <p className="text-gray-600 mb-8 leading-relaxed">
                  Select your preferred date and time range. Our coordinator will call you within 24 hours to confirm your exact appointment slot.
                </p>

                <form onSubmit={handleCalendarSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      id="appointmentDate"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={getMinDate()}
                      max={getMaxDate()}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                    />
                  </div>

                  <div>
                    <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-3">
                      Preferred Time Range
                    </label>
                    <div className="space-y-3">
                      {[
                        { value: 'morning', label: 'Morning', time: '9:00 AM - 12:00 PM', icon: '🌅' },
                        { value: 'afternoon', label: 'Afternoon', time: '12:00 PM - 5:00 PM', icon: '☀️' },
                        { value: 'evening', label: 'Evening', time: '5:00 PM - 8:00 PM', icon: '🌆' },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            preferredTime === option.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="preferredTime"
                            value={option.value}
                            checked={preferredTime === option.value}
                            onChange={(e) => setPreferredTime(e.target.value)}
                            required
                            className="w-5 h-5 text-blue-600"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{option.icon}</span>
                              <span className="font-semibold text-gray-900">{option.label}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                              <Clock size={14} />
                              {option.time}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedDate || !preferredTime}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Submitting...
                      </>
                    ) : (
                      'Submit Request'
                    )}
                  </button>
                </form>
              </div>
            )}

            {stage === 'success' && (
              <div className="p-8 md:p-10 text-center">
                <div className="flex justify-center mb-6">
                  <div className="bg-green-100 p-4 rounded-full">
                    <CheckCircle className="text-green-600" size={48} />
                  </div>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                  Request Received!
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Success! Our coordinator will call you at <span className="font-semibold text-gray-900">{phoneNumber}</span> within 24 hours to finalize your appointment slot.
                </p>

                <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500 mb-6">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">What's Next:</span> Keep your phone nearby. We'll confirm your exact time and answer any questions you have.
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}
