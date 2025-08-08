'use client';
// QuickGame modern React component

import { useState, useReducer } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

export type Question = {
  id: number;
  question: string;
  options: string[];
  answer: string;
};

interface QuickGameProps {
  questions?: Question[];
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    question: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    answer: '4',
  },
  {
    id: 2,
    question: 'Capital of France?',
    options: ['Berlin', 'Paris', 'Rome', 'Madrid'],
    answer: 'Paris',
  },
];

type State = {
  current: number;
  score: number;
};

type Action = { type: 'next'; correct: boolean } | { type: 'reset' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'next':
      return {
        current: state.current + 1,
        score: action.correct ? state.score + 1 : state.score,
      };
    case 'reset':
      return { current: 0, score: 0 };
    default:
      return state;
  }
}

export default function QuickGame({ questions = sampleQuestions }: QuickGameProps) {
  const [state, dispatch] = useReducer(reducer, { current: 0, score: 0 });
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const currentQuestion = questions[state.current];

  const handleAnswer = (option: string) => {
    if (status !== 'idle') return;
    setSelected(option);
    const correct = option === currentQuestion.answer;
    setStatus(correct ? 'correct' : 'wrong');

    setTimeout(() => {
      setStatus('idle');
      setSelected(null);
      dispatch({ type: 'next', correct });
    }, 1000);
  };

  if (!currentQuestion) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-2xl font-semibold">Finished!</p>
        <p className="text-lg">
          Score: {state.score} / {questions.length}
        </p>
        <button
          onClick={() => dispatch({ type: 'reset' })}
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors"
        >
          Restart
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <div className="text-right text-sm text-gray-500">Score: {state.score}</div>

      <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-medium">{currentQuestion.question}</h2>
        <div className="grid grid-cols-1 gap-4">
          {currentQuestion.options.map((opt) => {
            const isCorrect = status !== 'idle' && opt === currentQuestion.answer;
            const isWrong = status === 'wrong' && selected === opt;

            return (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                disabled={status !== 'idle'}
                className={`relative px-4 py-2 border rounded-md text-left transition-colors shadow
                  hover:bg-gray-50 focus:outline-none disabled:opacity-75
                  ${isCorrect ? 'bg-green-100' : ''}
                  ${isWrong ? 'bg-red-100' : ''}
                `}
              >
                {opt}
                {isCorrect && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 text-green-500"
                  >
                    <CheckCircle size={20} />
                  </motion.span>
                )}
                {isWrong && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 text-red-500"
                  >
                    <XCircle size={20} />
                  </motion.span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

