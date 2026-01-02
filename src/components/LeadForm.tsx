import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface LeadFormProps {
  onSubmit: (data: { firstName: string; lastName: string; email: string }) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
  isLoading?: boolean;
}

export function LeadForm({ onSubmit, onBack, currentStep, totalSteps, isLoading = false }: LeadFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (firstName && lastName && email) {
      onSubmit({ firstName, lastName, email });
    }
  };

  const isValid = firstName && lastName && email.includes('@');

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <div className="ml-auto text-sm text-gray-500">
          Step {currentStep} of {totalSteps}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="text-teal-500" size={32} />
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Almost there!
          </h2>
        </div>

        <p className="text-gray-600 mb-8 text-lg">
          Share your contact details to receive your personalized vision analysis.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors text-lg"
              placeholder="John"
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors text-lg"
              placeholder="Smith"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors text-lg"
              placeholder="john@example.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!isValid || isLoading}
            className="w-full bg-teal-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-teal-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed mt-8"
          >
            {isLoading ? 'Generating...' : 'Generate Result'}
          </button>
        </form>
      </div>

      <div className="mt-6 flex gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              index < currentStep ? 'bg-teal-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}
