'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface WordGame {
  id: string;
  word: string;
  definition: string;
  options: string[];
  correctAnswer: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

const beginnerGames: WordGame[] = [
  {
    id: 'b1',
    word: 'happy',
    definition: 'Feeling or showing pleasure or contentment',
    options: ['happy', 'sad', 'angry', 'tired'],
    correctAnswer: 'happy',
    difficulty: 'beginner',
    category: 'emotions'
  },
  {
    id: 'b2',
    word: 'big',
    definition: 'Of considerable size or extent',
    options: ['big', 'small', 'tiny', 'huge'],
    correctAnswer: 'big',
    difficulty: 'beginner',
    category: 'descriptive'
  },
  {
    id: 'b3',
    word: 'fast',
    definition: 'Moving or capable of moving at high speed',
    options: ['fast', 'slow', 'quick', 'rapid'],
    correctAnswer: 'fast',
    difficulty: 'beginner',
    category: 'descriptive'
  },
  {
    id: 'b4',
    word: 'good',
    definition: 'To be desired or approved of',
    options: ['good', 'bad', 'nice', 'fine'],
    correctAnswer: 'good',
    difficulty: 'beginner',
    category: 'descriptive'
  },
  {
    id: 'b5',
    word: 'new',
    definition: 'Produced, introduced, or discovered recently or now for the first time',
    options: ['new', 'old', 'fresh', 'recent'],
    correctAnswer: 'new',
    difficulty: 'beginner',
    category: 'descriptive'
  }
];

const intermediateGames: WordGame[] = [
  {
    id: 'i1',
    word: 'eloquent',
    definition: 'Fluent or persuasive in speaking or writing',
    options: ['eloquent', 'silent', 'quiet', 'mute'],
    correctAnswer: 'eloquent',
    difficulty: 'intermediate',
    category: 'communication'
  },
  {
    id: 'i2',
    word: 'resilient',
    definition: 'Able to withstand or recover quickly from difficult conditions',
    options: ['resilient', 'fragile', 'weak', 'delicate'],
    correctAnswer: 'resilient',
    difficulty: 'intermediate',
    category: 'character traits'
  },
  {
    id: 'i3',
    word: 'ubiquitous',
    definition: 'Present, appearing, or found everywhere',
    options: ['ubiquitous', 'rare', 'scarce', 'limited'],
    correctAnswer: 'ubiquitous',
    difficulty: 'intermediate',
    category: 'technology'
  },
  {
    id: 'i4',
    word: 'meticulous',
    definition: 'Showing great attention to detail; very careful and precise',
    options: ['meticulous', 'careless', 'sloppy', 'hasty'],
    correctAnswer: 'meticulous',
    difficulty: 'intermediate',
    category: 'character traits'
  },
  {
    id: 'i5',
    word: 'diligent',
    definition: 'Having or showing care and conscientiousness in one\'s work or duties',
    options: ['diligent', 'lazy', 'slothful', 'idle'],
    correctAnswer: 'diligent',
    difficulty: 'intermediate',
    category: 'character traits'
  }
];

const advancedGames: WordGame[] = [
  {
    id: 'a1',
    word: 'serendipity',
    definition: 'The occurrence and development of events by chance in a happy or beneficial way',
    options: ['serendipity', 'coincidence', 'destiny', 'fate'],
    correctAnswer: 'serendipity',
    difficulty: 'advanced',
    category: 'abstract concepts'
  },
  {
    id: 'a2',
    word: 'ephemeral',
    definition: 'Lasting for a very short time; transitory',
    options: ['ephemeral', 'permanent', 'eternal', 'lasting'],
    correctAnswer: 'ephemeral',
    difficulty: 'advanced',
    category: 'descriptive'
  },
  {
    id: 'a3',
    word: 'pragmatic',
    definition: 'Dealing with things sensibly and realistically in a way that is based on practical rather than idealistic considerations',
    options: ['pragmatic', 'idealistic', 'romantic', 'dreamy'],
    correctAnswer: 'pragmatic',
    difficulty: 'advanced',
    category: 'philosophy'
  },
  {
    id: 'a4',
    word: 'enigmatic',
    definition: 'Difficult to interpret or understand; mysterious',
    options: ['enigmatic', 'clear', 'obvious', 'simple'],
    correctAnswer: 'enigmatic',
    difficulty: 'advanced',
    category: 'descriptive'
  },
  {
    id: 'a5',
    word: 'perspicacious',
    definition: 'Having a ready insight into and understanding of things',
    options: ['perspicacious', 'stupid', 'ignorant', 'foolish'],
    correctAnswer: 'perspicacious',
    difficulty: 'advanced',
    category: 'intelligence'
  }
];

interface GameStats {
  total: number;
  correct: number;
  incorrect: number;
  streak: number;
  currentStreak: number;
}

interface QuickGamesProps {
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
}

export default function QuickGames({ userLevel = 'beginner' }: QuickGamesProps) {
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameStats, setGameStats] = useState<GameStats>({
    total: 0,
    correct: 0,
    incorrect: 0,
    streak: 0,
    currentStreak: 0
  });
  const [difficulty, setDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>(userLevel);

  // Get games based on user level and difficulty filter
  const getFilteredGames = () => {
    let games: WordGame[] = [];
    
    if (difficulty === 'all') {
      // Include games up to user's level
      if (userLevel === 'beginner') {
        games = [...beginnerGames];
      } else if (userLevel === 'intermediate') {
        games = [...beginnerGames, ...intermediateGames];
      } else {
        games = [...beginnerGames, ...intermediateGames, ...advancedGames];
      }
    } else {
      // Filter by specific difficulty
      if (difficulty === 'beginner') games = beginnerGames;
      else if (difficulty === 'intermediate') games = intermediateGames;
      else if (difficulty === 'advanced') games = advancedGames;
    }
    
    return games;
  };

  const filteredGames = getFilteredGames();
  const currentGame = filteredGames[currentGameIndex];

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer || showResult) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentGame.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    setGameStats(prev => {
      const newStats = {
        ...prev,
        total: prev.total + 1,
        correct: correct ? prev.correct + 1 : prev.correct,
        incorrect: correct ? prev.incorrect : prev.incorrect + 1,
        currentStreak: correct ? prev.currentStreak + 1 : 0,
        streak: correct ? Math.max(prev.streak, prev.currentStreak + 1) : prev.streak
      };
      return newStats;
    });
  };

  const nextGame = () => {
    if (currentGameIndex < filteredGames.length - 1) {
      setCurrentGameIndex(prev => prev + 1);
    } else {
      // Game completed
      setCurrentGameIndex(0);
    }
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
  };

  const resetGame = () => {
    setCurrentGameIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setGameStats({
      total: 0,
      correct: 0,
      incorrect: 0,
      streak: 0,
      currentStreak: 0
    });
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Reset game when difficulty changes
  useEffect(() => {
    setCurrentGameIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
  }, [difficulty]);

  if (!currentGame) {
    return (
      <div className="text-center py-8">
        <p>No games available for the selected difficulty.</p>
        <Button onClick={() => setDifficulty(userLevel)} className="mt-4">
          Show {userLevel} Games
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* User Level Info */}
      <Card className="mb-6">
        <CardContent className="p-4 text-center">
          <div className="text-lg font-semibold mb-2">Your Level: {userLevel}</div>
          <p className="text-sm text-gray-600">
            {userLevel === 'beginner' && 'Focus on basic vocabulary and simple concepts'}
            {userLevel === 'intermediate' && 'Challenge yourself with more complex words'}
            {userLevel === 'advanced' && 'Master sophisticated vocabulary and abstract concepts'}
          </p>
        </CardContent>
      </Card>

      {/* Game Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{gameStats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{gameStats.correct}</div>
            <div className="text-sm text-gray-600">Correct</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{gameStats.incorrect}</div>
            <div className="text-sm text-gray-600">Incorrect</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{gameStats.streak}</div>
            <div className="text-sm text-gray-600">Best Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Difficulty Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((diff) => (
          <Button
            key={diff}
            variant={difficulty === diff ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDifficulty(diff)}
            disabled={diff === 'advanced' && userLevel === 'beginner' || 
                     diff === 'intermediate' && userLevel === 'beginner' ||
                     diff === 'advanced' && userLevel === 'intermediate'}
          >
            {diff.charAt(0).toUpperCase() + diff.slice(1)}
            {diff === 'advanced' && userLevel === 'beginner' && ' 🔒'}
            {diff === 'intermediate' && userLevel === 'beginner' && ' 🔒'}
            {diff === 'advanced' && userLevel === 'intermediate' && ' 🔒'}
          </Button>
        ))}
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress: {currentGameIndex + 1} / {filteredGames.length}</span>
          <span>{Math.round(((currentGameIndex + 1) / filteredGames.length) * 100)}%</span>
        </div>
        <Progress value={((currentGameIndex + 1) / filteredGames.length) * 100} className="w-full" />
      </div>

      {/* Game Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Word Challenge</CardTitle>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(currentGame.difficulty)}`}>
              {currentGame.difficulty}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Definition:</h3>
            <p className="text-gray-700 dark:text-gray-300">{currentGame.definition}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Choose the correct word:</h3>
            <div className="grid grid-cols-1 gap-3">
              {currentGame.options.map((option, index) => (
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
                    showResult && option === currentGame.correctAnswer
                      ? 'bg-green-100 border-green-500 text-green-800'
                      : selectedAnswer === option && !isCorrect
                      ? 'bg-red-100 border-red-500 text-red-800'
                      : ''
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={selectedAnswer !== null}
                >
                  <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </Button>
              ))}
            </div>
          </div>

          {showResult && (
            <div className={`p-4 rounded-lg ${
              isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <div className="font-semibold mb-2">
                {isCorrect ? '✅ Correct!' : '❌ Incorrect!'}
              </div>
              <p>
                <strong>Correct answer:</strong> {currentGame.correctAnswer}
              </p>
              {currentGame.category && (
                <p className="text-sm mt-1">
                  <strong>Category:</strong> {currentGame.category}
                </p>
              )}
            </div>
          )}

          {showResult && (
            <div className="flex gap-2">
              <Button onClick={nextGame} className="flex-1">
                {currentGameIndex < filteredGames.length - 1 ? 'Next Question' : 'Play Again'}
              </Button>
              <Button variant="outline" onClick={resetGame}>
                Reset Game
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Streak */}
      {gameStats.currentStreak > 0 && (
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-lg font-semibold text-orange-600">
              🔥 Current Streak: {gameStats.currentStreak}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
