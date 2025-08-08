'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

// Question type and sample questions
interface Question {
  id: number;
  question: string;
  options: string[];
  answer: number; // index of correct option
}

const questions: Question[] = [
  {
    id: 1,
    question: 'What is the capital of Turkey?',
    options: ['Istanbul', 'Ankara', 'Izmir', 'Bursa'],
    answer: 1,
  },
  {
    id: 2,
    question: '2 + 2 equals?',
    options: ['3', '4', '5', '22'],
    answer: 1,
  },
  {
    id: 3,
    question: 'Which one is a programming language?',
    options: ['Python', 'Snake', 'Lizard', 'Crocodile'],
    answer: 0,
  },
  {
    id: 4,
    question: 'HTML stands for?',
    options: [
      'HyperText Markup Language',
      'HighText Machine Language',
      'Hyperlink and Text Markup Language',
      'Home Tool Markup Language',
    ],
    answer: 0,
  },
  {
    id: 5,
    question: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Venus', 'Mars', 'Jupiter'],
    answer: 2,
  },
];

// Game context type
interface GameContextValue {
  index: number;
  score: number;
  total: number;
  status: 'idle' | 'correct' | 'wrong';
  selected: number | null;
  // eslint-disable-next-line no-unused-vars
  select: (index: number) => void;
  restart: () => void;
}

// Create context
const GameContext = createContext<GameContextValue | null>(null);

// Custom hook to consume context
const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
};

// Provider component holding game state
function GameProvider({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [selected, setSelected] = useState<number | null>(null);

  const select = (optionIndex: number) => {
    if (status !== 'idle') return;
    setSelected(optionIndex);
    const correct = optionIndex === questions[index].answer;
    setStatus(correct ? 'correct' : 'wrong');
    if (correct) setScore((s) => s + 1);
    // Move to next question after short delay
    setTimeout(() => {
      setStatus('idle');
      setSelected(null);
      setIndex((q) => q + 1);
    }, 1000);
  };

  const restart = () => {
    setIndex(0);
    setScore(0);
    setStatus('idle');
    setSelected(null);
  };

  return (
    <GameContext.Provider value={{ index, score, total: questions.length, status, selected, select, restart }}>
      {children}
    </GameContext.Provider>
  );
}

// Progress bar component
function ProgressBar() {
  const { index, total } = useGame();
  const percent = (index / total) * 100;
  return (
    <div className="w-full">
      <div className="w-full bg-gray-200 rounded-full h-2 shadow-inner">
        <motion.div
          className="h-2 bg-blue-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ ease: 'easeOut', duration: 0.3 }}
        />
      </div>
      <p className="mt-2 text-sm text-gray-600 text-right">
        Soru {Math.min(index + 1, total)} / {total}
      </p>
    </div>
  );
}

// Card for displaying current question
function QuestionCard() {
  const { index, status, select, selected } = useGame();
  const q = questions[index];
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
      <h2 className="text-lg font-semibold">{q.question}</h2>
      <div className="grid gap-3">
        {q.options.map((opt, i) => {
          const isCorrect = status !== 'idle' && i === q.answer;
          const isWrong = status === 'wrong' && selected === i;
          return (
            <button
              key={i}
              onClick={() => select(i)}
              disabled={status !== 'idle'}
              className={`relative w-full text-left px-4 py-2 rounded-md border shadow-sm transition-colors hover:bg-blue-50 focus:outline-none disabled:opacity-75 ${
                isCorrect ? 'bg-green-100' : ''
              } ${isWrong ? 'bg-red-100' : ''}`}
            >
              {opt}
              <AnimatePresence>
                {isCorrect && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute right-2 top-2 text-green-500"
                  >
                    <CheckCircle size={20} />
                  </motion.span>
                )}
                {isWrong && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute right-2 top-2 text-red-500"
                  >
                    <XCircle size={20} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Result view after finishing all questions
function ResultCard() {
  const { score, total, restart } = useGame();
  const success = score / total >= 0.7;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-6 rounded-lg shadow-lg text-center space-y-4"
    >
      <p className="text-xl font-semibold">
        Skor: {score} / {total}
      </p>
      <p className="text-lg">
        {success ? 'Tebrikler! Başarılı oldun.' : 'Devam! Daha iyisi için tekrar dene.'}
      </p>
      <button
        onClick={restart}
        className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors"
      >
        Yeniden Başla
      </button>
    </motion.div>
  );
}

// Main career page component
export default function CareerPage() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

// Internal component consuming context
function GameContent() {
  const { index, total } = useGame();
  const finished = index >= total;
  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <ProgressBar />
      {finished ? <ResultCard /> : <QuestionCard />}
    </div>
  );
}
