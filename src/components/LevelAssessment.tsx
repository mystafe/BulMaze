'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface AssessmentQuestion {
  id: string;
  word: string;
  definition: string;
  options: string[];
  correctAnswer: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const assessmentQuestions: AssessmentQuestion[] = [
  // Beginner questions
  {
    id: '1',
    word: 'happy',
    definition: 'Feeling or showing pleasure or contentment',
    options: ['happy', 'sad', 'angry', 'tired'],
    correctAnswer: 'happy',
    difficulty: 'beginner',
  },
  {
    id: '2',
    word: 'big',
    definition: 'Of considerable size or extent',
    options: ['big', 'small', 'tiny', 'huge'],
    correctAnswer: 'big',
    difficulty: 'beginner',
  },
  {
    id: '3',
    word: 'fast',
    definition: 'Moving or capable of moving at high speed',
    options: ['fast', 'slow', 'quick', 'rapid'],
    correctAnswer: 'fast',
    difficulty: 'beginner',
  },
  // Intermediate questions
  {
    id: '4',
    word: 'eloquent',
    definition: 'Fluent or persuasive in speaking or writing',
    options: ['eloquent', 'silent', 'quiet', 'mute'],
    correctAnswer: 'eloquent',
    difficulty: 'intermediate',
  },
  {
    id: '5',
    word: 'resilient',
    definition:
      'Able to withstand or recover quickly from difficult conditions',
    options: ['resilient', 'fragile', 'weak', 'delicate'],
    correctAnswer: 'resilient',
    difficulty: 'intermediate',
  },
  {
    id: '6',
    word: 'ubiquitous',
    definition: 'Present, appearing, or found everywhere',
    options: ['ubiquitous', 'rare', 'scarce', 'limited'],
    correctAnswer: 'ubiquitous',
    difficulty: 'intermediate',
  },
  // Advanced questions
  {
    id: '7',
    word: 'serendipity',
    definition:
      'The occurrence and development of events by chance in a happy or beneficial way',
    options: ['serendipity', 'coincidence', 'destiny', 'fate'],
    correctAnswer: 'serendipity',
    difficulty: 'advanced',
  },
  {
    id: '8',
    word: 'ephemeral',
    definition: 'Lasting for a very short time; transitory',
    options: ['ephemeral', 'permanent', 'eternal', 'lasting'],
    correctAnswer: 'ephemeral',
    difficulty: 'advanced',
  },
  {
    id: '9',
    word: 'pragmatic',
    definition:
      'Dealing with things sensibly and realistically in a way that is based on practical rather than idealistic considerations',
    options: ['pragmatic', 'idealistic', 'romantic', 'dreamy'],
    correctAnswer: 'pragmatic',
    difficulty: 'advanced',
  },
  {
    id: '10',
    word: 'meticulous',
    definition: 'Showing great attention to detail; very careful and precise',
    options: ['meticulous', 'careless', 'sloppy', 'hasty'],
    correctAnswer: 'meticulous',
    difficulty: 'advanced',
  },
];

interface AssessmentResult {
  level: 'beginner' | 'intermediate' | 'advanced';
  score: number;
  totalQuestions: number;
  beginnerCorrect: number;
  intermediateCorrect: number;
  advancedCorrect: number;
}

interface LevelAssessmentProps {
  onComplete: (result: AssessmentResult) => void;
}

export default function LevelAssessment({ onComplete }: LevelAssessmentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [scores, setScores] = useState({
    beginner: 0,
    intermediate: 0,
    advanced: 0,
  });

  const currentQuestion = assessmentQuestions[currentQuestionIndex];
  const progress =
    ((currentQuestionIndex + 1) / assessmentQuestions.length) * 100;

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer || showResult) return;

    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    // Update scores
    if (correct) {
      setScores((prev) => ({
        ...prev,
        [currentQuestion.difficulty]:
          prev[currentQuestion.difficulty as keyof typeof prev] + 1,
      }));
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < assessmentQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
    } else {
      // Assessment completed
      const assessmentResult = calculateResult();
      onComplete(assessmentResult);
    }
  };

  const calculateResult = (): AssessmentResult => {
    const beginnerScore = scores.beginner;
    const intermediateScore = scores.intermediate;
    const advancedScore = scores.advanced;

    const totalScore = beginnerScore + intermediateScore + advancedScore;

    // Determine level based on performance
    let level: 'beginner' | 'intermediate' | 'advanced' = 'beginner';

    if (advancedScore >= 2 && intermediateScore >= 2) {
      level = 'advanced';
    } else if (
      intermediateScore >= 2 ||
      (beginnerScore >= 2 && intermediateScore >= 1)
    ) {
      level = 'intermediate';
    } else {
      level = 'beginner';
    }

    return {
      level,
      score: totalScore,
      totalQuestions: assessmentQuestions.length,
      beginnerCorrect: beginnerScore,
      intermediateCorrect: intermediateScore,
      advancedCorrect: advancedScore,
    };
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'beginner':
        return 'text-green-600 bg-green-100';
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-100';
      case 'advanced':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Level Assessment Test</CardTitle>
          <p className="text-center text-gray-600 dark:text-gray-300">
            Answer 10 questions to determine your vocabulary level
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>
                Question {currentQuestionIndex + 1} of{' '}
                {assessmentQuestions.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          {/* Question */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Question {currentQuestionIndex + 1}
              </h3>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}
              >
                {currentQuestion.difficulty}
              </span>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2">Definition:</h4>
              <p className="text-gray-700 dark:text-gray-300">
                {currentQuestion.definition}
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">
                Choose the correct word:
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={
                      selectedAnswer === option
                        ? isCorrect
                          ? 'default'
                          : 'outline'
                        : 'outline'
                    }
                    className={`justify-start h-auto p-4 ${
                      showResult && option === currentQuestion.correctAnswer
                        ? 'bg-green-100 border-green-500 text-green-800'
                        : selectedAnswer === option && !isCorrect
                          ? 'bg-red-100 border-red-500 text-red-800'
                          : ''
                    }`}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={selectedAnswer !== null}
                  >
                    <span className="font-medium mr-2">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </Button>
                ))}
              </div>
            </div>

            {showResult && (
              <div
                className={`p-4 rounded-lg ${
                  isCorrect
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                <div className="font-semibold mb-2">
                  {isCorrect ? '✅ Correct!' : '❌ Incorrect!'}
                </div>
                <p>
                  <strong>Correct answer:</strong>{' '}
                  {currentQuestion.correctAnswer}
                </p>
              </div>
            )}

            {showResult && (
              <div className="flex gap-2">
                <Button onClick={nextQuestion} className="flex-1">
                  {currentQuestionIndex < assessmentQuestions.length - 1
                    ? 'Next Question'
                    : 'See Results'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
