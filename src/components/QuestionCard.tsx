import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Question } from '../data/questions';

interface QuestionCardProps {
  question: Question;
  currentStep: number;
  totalSteps: number;
  onAnswer: (value: string) => void;
  onBack: () => void;
  showBack: boolean;
}

export function QuestionCard({
  question,
  currentStep,
  totalSteps,
  onAnswer,
  onBack,
  showBack,
}: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="mb-6 flex items-center justify-between">
        {showBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        )}
        <div className="ml-auto text-sm text-gray-500">
          Step {currentStep} of {totalSteps}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8 leading-relaxed">
          {question.question}
        </h2>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <motion.button
              key={option.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onAnswer(option.value)}
              className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-teal-500 hover:bg-teal-50 transition-all duration-200 group"
            >
              <span className="text-lg text-gray-700 group-hover:text-teal-700 font-medium">
                {option.label}
              </span>
            </motion.button>
          ))}
        </div>
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
