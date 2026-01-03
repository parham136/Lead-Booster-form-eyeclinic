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
    
    // UK MOBILE VALIDATION: Starts with 07 and has 11 digits
    const ukPhoneRegex = /^07\d{9}$/;
    const cleanPhone = phoneNumber.replace(/\s/g, ''); // Remove spaces for validation
    
    if (!ukPhoneRegex.test(cleanPhone)) {
      alert("Please enter a valid UK mobile number starting with 07 (11 digits)");
      return;
    }

    setIsSubmitting(true);

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phoneNumber: cleanPhone,
          stage: 'phone_captured',
        }),
        keepalive: true // Ensures request finishes even if page redirects
      });

      if (hasExternalSystem && externalBookingUrl) {
        setStage('redirecting');
        // Small delay so user sees the "Redirecting" state
        setTimeout(() => {
          window.location.href = externalBookingUrl;
        }, 1500);
      } else {
        setStage('calendar');
      }
    } catch (error) {
      console.error('Error submitting phone number:', error);
      // Fail-safe: Redirect anyway if we have a system, so the lead isn't lost
      if (hasExternalSystem && externalBookingUrl) window.location.href = externalBookingUrl;
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
        headers: { 'Content-Type': 'application/json' },
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
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget && stage !== 'redirecting') {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            {stage === 'phone' && (
              <div className="p-8 md:p-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-3 rounded-2xl">
                      <Phone className="text-blue-600" size={28} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Almost There!
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>

                <p className="text-gray-600 mb-8 leading-relaxed">
                  Enter your mobile to secure your results and ensure our team can reach you if the connection drops during booking.
                </p>

                <form onSubmit={handlePhoneSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      UK Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="07XXX XXXXXX"
                      required
                      className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:ring-0 transition-all text-lg font-medium"
                    />
                  </div>

                  <div className="bg-blue-50 rounded-2xl p-4 border-l-4 border-blue-500">
                    <p className="text-sm text-blue-900">
                      <span className="font-bold">Privacy First:</span> This is only used for appointment confirmation and critical medical updates.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || phoneNumber.length < 11}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'Continue to Booking'}
                  </button>
                </form>
              </div>
            )}

            {stage === 'redirecting' && (
              <div className="p-12 text-center">
                <Loader2 className="text-blue-600 animate-spin mx-auto mb-6" size={56} />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Connecting...</h2>
                <p className="text-gray-600">Transferring you to our secure clinical booking system.</p>
              </div>
            )}

            {stage === 'calendar' && (
              <div className="p-8 md:p-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-3 rounded-2xl">
                      <CalendarIcon className="text-blue-600" size={28} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Preferred Time</h2>
                  </div>
                  <button onClick={onClose} className="text-gray-400 p-2 rounded-full hover:bg-gray-100"><X size={24} /></button>
                </div>

                <form onSubmit={handleCalendarSubmit} className="space-y-6">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={getMinDate()}
                    max={getMaxDate()}
                    required
                    className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl focus:border-blue-500 text-lg"
                  />

                  <div className="grid grid-cols-1 gap-3">
                    {['morning', 'afternoon', 'evening'].map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setPreferredTime(time)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all ${
                          preferredTime === time ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-blue-200'
                        }`}
                      >
                        <span className="capitalize font-bold block">{time}</span>
                        <span className="text-sm text-gray-500">{time === 'morning' ? '9am - 12pm' : time === 'afternoon' ? '12pm - 5pm' : '5pm - 8pm'}</span>
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedDate || !preferredTime}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Requesting...' : 'Request Appointment'}
                  </button>
                </form>
              </div>
            )}

            {stage === 'success' && (
              <div className="p-12 text-center">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="text-green-600" size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Received</h2>
                <p className="text-gray-600 mb-8">Our coordinator will call you within 24 hours to finalize your slot.</p>
                <button onClick={onClose} className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold">Back to Site</button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}