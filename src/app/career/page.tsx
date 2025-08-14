'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import LevelAssessment from '@/components/LevelAssessment';
import { useDailyQuestStore, useUiStore } from '@/lib/store';
import DailyQuestGame from '@/components/DailyQuestGame';

interface AssessmentResult {
  level: 'beginner' | 'intermediate' | 'advanced';
  score: number;
  totalQuestions: number;
  beginnerCorrect: number;
  intermediateCorrect: number;
  advancedCorrect: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  progress: number;
  maxProgress: number;
}

interface CareerStats {
  level: number;
  experience: number;
  experienceToNext: number;
  totalWordsLearned: number;
  totalGamesPlayed: number;
  averageScore: number;
  studyStreak: number;
  longestStreak: number;
  achievements: Achievement[];
  userLevel: 'beginner' | 'intermediate' | 'advanced';
}

// A helper function to define level progression
const getLevelExperience = (level: number) => {
  return 200 + (level - 1) * 150; // e.g., Lvl 1 -> 200, Lvl 2 -> 350, etc.
};

export default function CareerPage() {
  const { data: session } = useSession();
  const {
    quest,
    isLoading: isQuestLoading,
    error: questError,
    fetchQuest,
  } = useDailyQuestStore();
  const { targetLang, isDemoMode, demoUser } = useUiStore();

  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [assessmentResult, setAssessmentResult] =
    useState<AssessmentResult | null>(null);
  const [careerData, setCareerData] = useState<CareerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isQuestActive, setIsQuestActive] = useState(false);

  const currentUser = isDemoMode ? demoUser : session?.user;
  const userId = currentUser?.email; // Use email as a unique ID

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return; // Don't load data if no user is logged in
    }

    const completedKey = `assessmentCompleted_${userId}_${targetLang}`;
    const resultKey = `assessmentResult_${userId}_${targetLang}`;
    const dataKey = `careerData_${userId}_${targetLang}`;

    const completed = localStorage.getItem(completedKey) === 'true';
    const result = localStorage.getItem(resultKey);
    const data = localStorage.getItem(dataKey);

    setAssessmentCompleted(completed);
    setAssessmentResult(result ? JSON.parse(result) : null);
    setCareerData(data ? JSON.parse(data) : null);
    setIsLoading(false);
  }, [userId, targetLang]);

  useEffect(() => {
    if (careerData?.userLevel) {
      fetchQuest(careerData.userLevel, targetLang);
    }
  }, [careerData, targetLang, fetchQuest]);

  const handleAssessmentComplete = (result: AssessmentResult) => {
    if (!userId) return;

    const initialLevel =
      result.level === 'beginner'
        ? 1
        : result.level === 'intermediate'
          ? 5
          : 10;

    const initialCareerData: CareerStats = {
      level: initialLevel,
      experience: 0,
      experienceToNext: getLevelExperience(initialLevel),
      totalWordsLearned: result.score,
      totalGamesPlayed: 1,
      averageScore: Math.round((result.score / result.totalQuestions) * 100),
      studyStreak: 1,
      longestStreak: 1,
      achievements: [
        {
          id: '1',
          title: 'First Steps',
          description: 'Complete your first assessment',
          icon: '🎯',
          unlocked: true,
          unlockedDate: new Date().toISOString().split('T')[0],
          progress: 1,
          maxProgress: 1,
        },
        {
          id: '2',
          title: `${targetLang.toUpperCase()} Level Determined`,
          description: `Your ${targetLang} level: ${result.level}`,
          icon: '📊',
          unlocked: true,
          unlockedDate: new Date().toISOString().split('T')[0],
          progress: 1,
          maxProgress: 1,
        },
        {
          id: '3',
          title: `${targetLang.toUpperCase()} Vocabulary Explorer`,
          description: `Learn 50 ${targetLang} words`,
          icon: '🗺️',
          unlocked: false,
          progress: result.score,
          maxProgress: 50,
        },
        {
          id: '4',
          title: 'Streak Master',
          description: 'Maintain a 7-day study streak',
          icon: '🔥',
          unlocked: false,
          progress: 1,
          maxProgress: 7,
        },
        {
          id: '5',
          title: 'Perfect Score',
          description: 'Get 100% on a vocabulary test',
          icon: '⭐',
          unlocked: result.score === result.totalQuestions,
          progress: result.score,
          maxProgress: result.totalQuestions,
        },
        {
          id: '6',
          title: `${targetLang.toUpperCase()} Grammar Guru`,
          description: `Master 100 ${targetLang} words`,
          icon: '👑',
          unlocked: false,
          progress: result.score,
          maxProgress: 100,
        },
      ],
      userLevel: result.level,
    };

    const completedKey = `assessmentCompleted_${userId}_${targetLang}`;
    const levelKey = `userLevel_${userId}_${targetLang}`;
    const resultKey = `assessmentResult_${userId}_${targetLang}`;
    const dataKey = `careerData_${userId}_${targetLang}`;

    localStorage.setItem(completedKey, 'true');
    localStorage.setItem(levelKey, result.level);
    localStorage.setItem(resultKey, JSON.stringify(result));
    localStorage.setItem(dataKey, JSON.stringify(initialCareerData));

    setAssessmentCompleted(true);
    setAssessmentResult(result);
    setCareerData(initialCareerData);
  };

  const handleQuestComplete = (score: number) => {
    if (!careerData || !userId) return;

    let newExperience = careerData.experience + score * 10;
    let newLevel = careerData.level;
    let experienceToNext = careerData.experienceToNext;

    while (newExperience >= experienceToNext) {
      newExperience -= experienceToNext;
      newLevel += 1;
      experienceToNext = getLevelExperience(newLevel);
    }

    const updatedCareerData: CareerStats = {
      ...careerData,
      level: newLevel,
      experience: newExperience,
      experienceToNext,
      totalWordsLearned: careerData.totalWordsLearned + score,
      totalGamesPlayed: careerData.totalGamesPlayed + 1,
      averageScore: Math.round(
        (((careerData.averageScore / 100) * careerData.totalGamesPlayed +
          score / 10) /
          (careerData.totalGamesPlayed + 1)) *
          100,
      ),
    };

    setCareerData(updatedCareerData);
    localStorage.setItem(
      `careerData_${userId}_${targetLang}`,
      JSON.stringify(updatedCareerData),
    );
    setIsQuestActive(false);
  };

  const resetAssessment = () => {
    if (!userId) return;

    const completedKey = `assessmentCompleted_${userId}_${targetLang}`;
    const levelKey = `userLevel_${userId}_${targetLang}`;
    const resultKey = `assessmentResult_${userId}_${targetLang}`;
    const dataKey = `careerData_${userId}_${targetLang}`;

    localStorage.removeItem(completedKey);
    localStorage.removeItem(levelKey);
    localStorage.removeItem(resultKey);
    localStorage.removeItem(dataKey);

    setAssessmentCompleted(false);
    setAssessmentResult(null);
    setCareerData(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <p>You need to be signed in to view your career progress.</p>
      </div>
    );
  }

  if (!assessmentCompleted) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Start Your {targetLang.toUpperCase()} Learning Journey
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Take a quick assessment to determine your {targetLang} vocabulary
            level and start your personalized learning path
          </p>
        </div>
        <LevelAssessment
          onComplete={handleAssessmentComplete}
          targetLang={targetLang}
        />
      </div>
    );
  }

  if (isQuestActive) {
    return (
      <div className="container mx-auto py-8">
        <DailyQuestGame onQuestComplete={handleQuestComplete} />
      </div>
    );
  }

  if (!careerData || !assessmentResult) {
    return (
      <div className="text-center py-10">
        <p className="mb-4">
          Could not load career data. Please retake the assessment.
        </p>
        <Button onClick={resetAssessment}>Retake Assessment</Button>
      </div>
    );
  }

  const experienceProgress =
    (careerData.experience / careerData.experienceToNext) * 100;

  return (
    <div className="container mx-auto py-8">
      {/* Daily Quests Section */}
      <Card className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <span className="text-3xl">🌟</span>
            Daily Quests
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg mb-4">
            {questError
              ? `Error: ${questError}`
              : quest.length > 0
                ? 'Your new words for today are ready!'
                : 'Fetching your daily quest...'}
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg font-bold"
            disabled={isQuestLoading || quest.length === 0}
            onClick={() => setIsQuestActive(true)}
          >
            {isQuestLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Preparing Quest...
              </>
            ) : (
              "Start Today's Quest"
            )}
          </Button>
          <p className="text-xs mt-2 opacity-80">
            Complete your quest to maintain your streak!
          </p>
        </CardContent>
      </Card>

      {/* Level and Experience */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="text-3xl">👨‍🎓</span>
            Level {careerData.level} -{' '}
            {assessmentResult?.level === 'beginner'
              ? `${targetLang.toUpperCase()} Vocabulary Beginner`
              : assessmentResult?.level === 'intermediate'
                ? `${targetLang.toUpperCase()} Vocabulary Explorer`
                : `${targetLang.toUpperCase()} Vocabulary Scholar`}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={resetAssessment}>
            Retake Assessment
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Experience Progress</span>
            <span className="text-sm font-medium">
              {careerData.experience} / {careerData.experienceToNext} XP
            </span>
          </div>
          <Progress value={experienceProgress} className="w-full mb-4" />
          <div className="text-sm text-gray-600">
            {careerData.experienceToNext - careerData.experience} XP needed for
            next level
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {careerData.totalWordsLearned}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {targetLang.toUpperCase()} Words Learned
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">
              {careerData.totalGamesPlayed}
            </div>
            <div className="text-sm text-gray-600 mt-1">Games Played</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {careerData.averageScore}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Average Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">
              {careerData.studyStreak}
            </div>
            <div className="text-sm text-gray-600 mt-1">Day Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {careerData.achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`${
                  achievement.unlocked
                    ? 'border-green-200 bg-green-50 dark:bg-green-950'
                    : 'border-gray-200 bg-gray-50 dark:bg-gray-800'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h3
                        className={`font-semibold ${
                          achievement.unlocked
                            ? 'text-green-800 dark:text-green-200'
                            : 'text-gray-600'
                        }`}
                      >
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {achievement.description}
                      </p>
                      {achievement.unlocked ? (
                        <div className="text-xs text-green-600 dark:text-green-400">
                          ✓ Unlocked{' '}
                          {achievement.unlockedDate &&
                            `on ${achievement.unlockedDate}`}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Progress</span>
                            <span>
                              {achievement.progress} / {achievement.maxProgress}
                            </span>
                          </div>
                          <Progress
                            value={
                              (achievement.progress / achievement.maxProgress) *
                              100
                            }
                            className="w-full h-2"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Streak Info */}
      <Card className="mt-8">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-2xl mb-2">🔥</div>
            <h3 className="text-xl font-semibold mb-2">Study Streak</h3>
            <p className="text-3xl font-bold text-orange-600 mb-2">
              {careerData.studyStreak} days
            </p>
            <p className="text-sm text-gray-600">
              Longest streak: {careerData.longestStreak} days
            </p>
            <Button className="mt-4" variant="outline">
              Continue Streak
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
