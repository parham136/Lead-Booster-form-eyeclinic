import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

export function SyncingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-lg p-12 md:p-16 text-center">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="inline-block mb-8"
        >
          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative"
          >
            <Brain size={80} className="text-teal-500" />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 rounded-full border-2 border-teal-500"
            />
          </motion.div>
        </motion.div>

        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
          AI is analyzing your vision profile...
        </h2>

        <p className="text-gray-600 text-lg mb-8">Please wait.</p>

        <div className="space-y-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 3, repeat: Infinity }}
            className="h-2 bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-400 rounded-full"
          />
          <p className="text-sm text-gray-500">Processing your responses...</p>
        </div>
      </div>
    </motion.div>
  );
}
