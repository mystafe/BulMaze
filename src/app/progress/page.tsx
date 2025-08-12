'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function ProgressPage() {
  // Mock data - in a real app this would come from the store/API
  const progressData = {
    totalWords: 150,
    masteredWords: 87,
    learningWords: 63,
    streakDays: 12,
    totalStudyTime: 45, // hours
    weeklyProgress: [
      { day: 'Mon', words: 5 },
      { day: 'Tue', words: 8 },
      { day: 'Wed', words: 3 },
      { day: 'Thu', words: 10 },
      { day: 'Fri', words: 6 },
      { day: 'Sat', words: 4 },
      { day: 'Sun', words: 7 },
    ],
    levelProgress: {
      beginner: { total: 50, mastered: 45 },
      intermediate: { total: 70, mastered: 35 },
      advanced: { total: 30, mastered: 7 },
    },
    recentAchievements: [
      {
        title: '7-Day Streak',
        description: 'Studied for 7 consecutive days',
        date: '2 days ago',
      },
      {
        title: 'Vocabulary Master',
        description: 'Mastered 50 words',
        date: '1 week ago',
      },
      {
        title: 'Speed Learner',
        description: 'Learned 10 words in one day',
        date: '2 weeks ago',
      },
    ],
  };

  const overallProgress =
    (progressData.masteredWords / progressData.totalWords) * 100;

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Learning Progress</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Track your vocabulary learning journey and celebrate your achievements
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {progressData.totalWords}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Words</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">
              {progressData.masteredWords}
            </div>
            <div className="text-sm text-gray-600 mt-1">Mastered</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">
              {progressData.streakDays}
            </div>
            <div className="text-sm text-gray-600 mt-1">Day Streak</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {progressData.totalStudyTime}h
            </div>
            <div className="text-sm text-gray-600 mt-1">Study Time</div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Mastery Progress</span>
            <span className="text-sm font-medium">
              {Math.round(overallProgress)}%
            </span>
          </div>
          <Progress value={overallProgress} className="w-full mb-4" />
          <div className="text-sm text-gray-600">
            {progressData.masteredWords} of {progressData.totalWords} words
            mastered
          </div>
        </CardContent>
      </Card>

      {/* Level Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Beginner</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm font-medium">
                {Math.round(
                  (progressData.levelProgress.beginner.mastered /
                    progressData.levelProgress.beginner.total) *
                    100,
                )}
                %
              </span>
            </div>
            <Progress
              value={
                (progressData.levelProgress.beginner.mastered /
                  progressData.levelProgress.beginner.total) *
                100
              }
              className="w-full mb-2"
            />
            <div className="text-sm text-gray-600">
              {progressData.levelProgress.beginner.mastered} /{' '}
              {progressData.levelProgress.beginner.total} words
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-yellow-600">Intermediate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm font-medium">
                {Math.round(
                  (progressData.levelProgress.intermediate.mastered /
                    progressData.levelProgress.intermediate.total) *
                    100,
                )}
                %
              </span>
            </div>
            <Progress
              value={
                (progressData.levelProgress.intermediate.mastered /
                  progressData.levelProgress.intermediate.total) *
                100
              }
              className="w-full mb-2"
            />
            <div className="text-sm text-gray-600">
              {progressData.levelProgress.intermediate.mastered} /{' '}
              {progressData.levelProgress.intermediate.total} words
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Advanced</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm font-medium">
                {Math.round(
                  (progressData.levelProgress.advanced.mastered /
                    progressData.levelProgress.advanced.total) *
                    100,
                )}
                %
              </span>
            </div>
            <Progress
              value={
                (progressData.levelProgress.advanced.mastered /
                  progressData.levelProgress.advanced.total) *
                100
              }
              className="w-full mb-2"
            />
            <div className="text-sm text-gray-600">
              {progressData.levelProgress.advanced.mastered} /{' '}
              {progressData.levelProgress.advanced.total} words
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between h-32">
            {progressData.weeklyProgress.map((day) => {
              const maxWords = Math.max(
                ...progressData.weeklyProgress.map((d) => d.words),
              );
              const height = (day.words / maxWords) * 100;
              return (
                <div key={day.day} className="flex flex-col items-center">
                  <div className="text-xs text-gray-600 mb-1">{day.words}</div>
                  <div
                    className="w-8 bg-blue-500 rounded-t"
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="text-xs text-gray-600 mt-1">{day.day}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {progressData.recentAchievements.map((achievement, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div>
                  <div className="font-medium">{achievement.title}</div>
                  <div className="text-sm text-gray-600">
                    {achievement.description}
                  </div>
                </div>
                <div className="text-sm text-gray-500">{achievement.date}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
