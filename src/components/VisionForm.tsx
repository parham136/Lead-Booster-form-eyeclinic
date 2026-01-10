import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { qualifierQuestion, pathQuestions, PathType, Question } from '../data/questions';
import { QuestionCard } from './QuestionCard';
import { LeadForm } from './LeadForm';
import { SyncingScreen } from './SyncingScreen';
import { ResultScreen } from './ResultScreen';

type Stage = 'qualifier' | 'questions' | 'lead' | 'result';

interface Answer {
  questionId: string;
  value: string;
}

export function VisionForm() {
  const [stage, setStage] = useState<Stage>('qualifier');
  const [selectedPath, setSelectedPath] = useState<PathType | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [leadData, setLeadData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
  } | null>(null);
  const [resultMessage, setResultMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleQualifierAnswer = (value: string) => {
    setSelectedPath(value as PathType);
    setAnswers([{ questionId: 'qualifier', value }]);
    setStage('questions');
    setCurrentQuestionIndex(0);
  };

  const handleQuestionAnswer = (value: string) => {
    if (!selectedPath) return;

    const currentQuestion = pathQuestions[selectedPath][currentQuestionIndex];
    const newAnswer: Answer = { questionId: currentQuestion.id, value };
    setAnswers((prev) => [...prev, newAnswer]);

    if (currentQuestionIndex < pathQuestions[selectedPath].length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setStage('lead');
    }
  };

  const handleBack = () => {
    if (isLoading) return;

    if (stage === 'lead') {
      setStage('questions');
      setAnswers((prev) => prev.slice(0, -1));
      setCurrentQuestionIndex((prev) => prev - 1);
    } else if (stage === 'questions') {
      if (currentQuestionIndex === 0) {
        setStage('qualifier');
        setSelectedPath(null);
        setAnswers([]);
      } else {
        setCurrentQuestionIndex((prev) => prev - 1);
        setAnswers((prev) => prev.slice(0, -1));
      }
    }
  };

  const handleLeadSubmit = async (data: {
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    setLeadData(data);
    setIsLoading(true);

    const payload = {
      path: selectedPath,
      answers: answers.reduce((acc, answer) => {
        acc[answer.questionId] = answer.value;
        return acc;
      }, {} as Record<string, string>),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    };

    const minimumDelay = new Promise((resolve) => setTimeout(resolve, 4000));

    const webhookPromise = fetch('https://orbilo.app.n8n.cloud/webhook/vision-followup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((result) => {
        setResultMessage(result.message || 'Thank you for completing the assessment!');
      })
      .catch((error) => {
        console.error('Error syncing with n8n:', error);
        setResultMessage(
          'Thank you for your submission. Our team will review your information and contact you shortly.'
        );
      });

    await Promise.all([minimumDelay, webhookPromise]);

    setIsLoading(false);
    setStage('result');
  };

  const handleBookConsultation = async () => {
    try {
      await fetch('https://orbilo.app.n8n.cloud/webhook/vision-followup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          intent: 'book_consultation',
          email: leadData?.email,
          firstName: leadData?.firstName,
        }),
      });
    } catch (error) {
      console.error('Error sending booking intent:', error);
    }

    window.location.href = 'https://orbilo.app.n8n.cloud/webhook/vision-followup';
  };

      const handleAbandon = () => {
      try {
        const payload = {
          intent: 'abandon_nurture',
          email: leadData?.email ?? '',
          firstName: leadData?.firstName ?? '',
          status: 'result_abandoned',
        };
    
        navigator.sendBeacon(
          'https://orbilo.app.n8n.cloud/webhook-test/vision-followup',
          new Blob([JSON.stringify(payload)], { type: 'application/json' })
        );
    
        setResultMessage("Results saved! We'll email you a copy shortly.");
      } catch (error) {
        console.error('Error sending abandonment data:', error);
      }
    };

  const getCurrentQuestion = (): Question | null => {
    if (stage === 'qualifier') {
      return qualifierQuestion;
    } else if (stage === 'questions' && selectedPath) {
      return pathQuestions[selectedPath][currentQuestionIndex];
    }
    return null;
  };

  const getTotalSteps = () => {
    return selectedPath ? pathQuestions[selectedPath].length + 2 : 7;
  };

  const getCurrentStep = () => {
    if (stage === 'qualifier') return 1;
    if (stage === 'questions') return currentQuestionIndex + 2;
    if (stage === 'lead') return getTotalSteps();
    return getTotalSteps();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Vision Care Assessment
          </h1>
          <p className="text-lg text-gray-600">
            Answer a few questions to get personalized recommendations
          </p>
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <SyncingScreen key="syncing" />
          ) : (
            <>
              {stage === 'qualifier' && (
                <QuestionCard
                  key="qualifier"
                  question={qualifierQuestion}
                  currentStep={getCurrentStep()}
                  totalSteps={getTotalSteps()}
                  onAnswer={handleQualifierAnswer}
                  onBack={handleBack}
                  showBack={false}
                />
              )}

              {stage === 'questions' && getCurrentQuestion() && (
                <QuestionCard
                  key={`question-${currentQuestionIndex}`}
                  question={getCurrentQuestion()!}
                  currentStep={getCurrentStep()}
                  totalSteps={getTotalSteps()}
                  onAnswer={handleQuestionAnswer}
                  onBack={handleBack}
                  showBack={true}
                />
              )}

              {stage === 'lead' && (
                <LeadForm
                  key="lead"
                  onSubmit={handleLeadSubmit}
                  onBack={handleBack}
                  currentStep={getCurrentStep()}
                  totalSteps={getTotalSteps()}
                  isLoading={isLoading}
                />
              )}

              {stage === 'result' && resultMessage && (
                <ResultScreen
                  key="result"
                  message={resultMessage}
                  onBookConsultation={handleBookConsultation}
                  onAbandon={handleAbandon}
                  firstName={leadData?.firstName || ''}
                  lastName={leadData?.lastName || ''}
                  email={leadData?.email || ''}
                />
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}