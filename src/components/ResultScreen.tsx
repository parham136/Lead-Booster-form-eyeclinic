import { useState } from 'react'; // ADDED THIS
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, X } from 'lucide-react';
import { SmartBookingBridge } from './SmartBookingBridge'; // ADDED THIS
import { bookingConfig } from '../config/bookingConfig'; // ADDED THIS



interface ResultScreenProps {
  message: string;
  onBookConsultation: () => void;
  onAbandon: () => void;
  firstName: string; // Ensure these are passed in
  lastName: string;
  email: string;
}

export function ResultScreen({ message, onBookConsultation, onAbandon, firstName, lastName, email }: ResultScreenProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false); // ADDED THIS
  const [isAbandoning, setIsAbandoning] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 relative">
        <button
          type="button"
        onClick={() => {
          if (message !== "Results saved! We'll email you a copy shortly.") {
            navigator.sendBeacon(
            'https://orbilo.app.n8n.cloud/webhook-test/vision-quiz',
            new Blob(
              [JSON.stringify({
                intent: 'abandon_nurture',
                email,
                firstName
              })],
              { type: 'application/json' }
            )
          );

          }
      
          window.location.reload();
        }}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
        aria-label="Close"
      >
        <X size={24} />
      </button>

        <div className="flex items-center gap-3 mb-6">
          <CheckCircle className="text-teal-500" size={48} />
          <h2 className="text-3xl font-semibold text-gray-900">
            Your Vision Analysis
          </h2>
        </div>

        <div className="bg-teal-50 rounded-xl p-6 mb-8 border-l-4 border-teal-500">
          <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
            {message}
          </p>

        </div>

        <button
          type="button"
          onClick={() => setIsBookingOpen(true)} // UPDATED THIS
          className="w-full bg-teal-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-teal-700 transition-all flex items-center justify-center gap-3 group"
        >
          <Calendar size={24} className="group-hover:scale-110 transition-transform" />
          Book My Free Consultation
        </button>


        {!isAbandoning && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setIsAbandoning(true);
            onAbandon();
          }}
          className="w-full text-center text-gray-600 hover:text-gray-800 transition-colors mt-4 underline"
        >
          Not now, just email me the results
        </button>


      )}


        {isAbandoning && message !== "Results saved! We'll email you a copy shortly." && (
          <p className="w-full text-center text-gray-500 mt-4">
            Saving your results…
          </p>
        )}


      </div>

      {/* THE OVERLAY MODULE */}
      <SmartBookingBridge
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        firstName={firstName}
        lastName={lastName}
        email={email}
        {...bookingConfig}
      />
    </motion.div>
  );
}