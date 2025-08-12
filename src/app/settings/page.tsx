'use client';

import { useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LanguageSelector from '@/components/LanguageSelector';
import ThemeToggle from '@/components/ThemeToggle';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useDailyQuestStore } from '@/lib/store';
import { useToast } from '@/components/ui/use-toast';

interface DemoUser {
  name: string;
  email: string;
  image: string | null;
}

export default function SettingsPage() {
  const { t } = useTranslation('common');
  const { data: session, status } = useSession();
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoUser, setDemoUser] = useState<DemoUser | null>(null);
  const [hasGoogleAuth, setHasGoogleAuth] = useState(false);
  const [userLevel, setUserLevel] = useState('Not determined');
  const { fetchQuest, isLoading: isQuestLoading } = useDailyQuestStore();
  const { toast } = useToast();

  // Load client-side only data after hydration
  useEffect(() => {
    const checkGoogleAuth = async () => {
      try {
        const response = await fetch('/api/auth/providers');
        if (response.ok) {
          const providers = await response.json();
          setHasGoogleAuth(!!providers?.google);
        }
      } catch {
        setHasGoogleAuth(false);
      }
    };
    checkGoogleAuth();

    // Safely access localStorage only on the client side
    const levelFromStorage =
      localStorage.getItem('userLevel') || 'Not determined';
    setUserLevel(levelFromStorage);
  }, []);

  // Check if we're in demo mode
  const currentUser = isDemoMode ? demoUser : session?.user;
  const isLoading = status === 'loading' && !isDemoMode;

  const handleDemoSignIn = () => {
    setIsDemoMode(true);
    setDemoUser({
      name: 'Demo User',
      email: 'demo@wordmaster.com',
      image: null, // Use local avatar instead
    });
  };

  const handleDemoSignOut = () => {
    setDemoUser(null);
    setIsDemoMode(false);
  };

  const handleRefreshQuest = async () => {
    if (userLevel !== 'Not determined') {
      toast({
        title: t('settings.refreshingQuest'),
        description: t('settings.fetchingWords'),
      });
      await fetchQuest(userLevel as 'beginner' | 'intermediate' | 'advanced');
      toast({
        title: t('settings.questRefreshed'),
        description: t('settings.newQuestReady'),
      });
    } else {
      toast({
        title: t('settings.cannotRefreshQuest'),
        description: t('settings.completeAssessmentFirst'),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">{t('settings.title')}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('settings.description')}
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">👤</span>
              {t('settings.accountSettings')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                <span>{t('settings.loadingAccountInfo')}</span>
              </div>
            ) : currentUser ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {currentUser.image ? (
                    <Image
                      src={currentUser.image}
                      alt={currentUser.name || 'User'}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                      {currentUser.name?.charAt(0) || 'D'}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">
                      {currentUser.name || 'User'}
                      {isDemoMode && (
                        <span className="text-sm text-gray-500 ml-2">
                          (Demo)
                        </span>
                      )}
                    </h3>
                    <p className="text-gray-600">{currentUser.email}</p>
                    <Badge variant="secondary" className="mt-2">
                      {isDemoMode
                        ? t('settings.demoMode')
                        : t('settings.authenticated')}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={
                      isDemoMode
                        ? handleDemoSignOut
                        : () => (window.location.href = '/api/auth/signout')
                    }
                  >
                    {t('settings.signOut')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-4">
                  {t('settings.signInToAccess')}
                </p>
                <div className="flex gap-2 justify-center">
                  {hasGoogleAuth && (
                    <Button
                      onClick={() => {
                        const callbackUrl =
                          window.location.origin + '/settings';
                        window.location.href = `/api/auth/signin?callbackUrl=${encodeURIComponent(
                          callbackUrl,
                        )}`;
                      }}
                    >
                      {t('settings.signInWithGoogle')}
                    </Button>
                  )}
                  <Button variant="outline" onClick={handleDemoSignIn}>
                    {t('settings.tryDemoMode')}
                  </Button>
                </div>
                {!hasGoogleAuth && (
                  <p className="text-xs text-gray-500 mt-2">
                    {t('settings.googleOAuthNotConfigured')}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Learning Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              {t('settings.learningPreferences')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">{t('settings.language')}</h3>
              <LanguageSelector />
            </div>
            <div>
              <h3 className="font-semibold mb-2">{t('settings.theme')}</h3>
              <ThemeToggle />
            </div>
            <div>
              <h3 className="font-semibold mb-2">{t('settings.yourLevel')}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{userLevel}</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (window.location.href = '/career')}
                >
                  {t('settings.retakeAssessment')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🔔</span>
              {t('settings.notifications')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">
                  {t('settings.dailyReminders')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('settings.dailyRemindersDesc')}
                </p>
              </div>
              <Button variant="outline" size="sm">
                {t('settings.enable')}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">
                  {t('settings.progressUpdates')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('settings.progressUpdatesDesc')}
                </p>
              </div>
              <Button variant="outline" size="sm">
                {t('settings.enable')}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">
                  {t('settings.achievementNotifications')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('settings.achievementNotificationsDesc')}
                </p>
              </div>
              <Button variant="outline" size="sm">
                {t('settings.enable')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🔒</span>
              {t('settings.dataPrivacy')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">
                  {t('settings.refreshDailyQuest')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('settings.refreshDailyQuestDesc')}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshQuest}
                disabled={isQuestLoading}
              >
                {isQuestLoading
                  ? t('settings.refreshing')
                  : t('settings.refresh')}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{t('settings.exportData')}</h3>
                <p className="text-sm text-gray-600">
                  {t('settings.exportDataDesc')}
                </p>
              </div>
              <Button variant="outline" size="sm">
                {t('settings.export')}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{t('settings.deleteAccount')}</h3>
                <p className="text-sm text-gray-600">
                  {t('settings.deleteAccountDesc')}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                {t('settings.delete')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">ℹ️</span>
              {t('settings.about')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">{t('settings.version')}</p>
              <p className="text-sm text-gray-600">{t('settings.builtWith')}</p>
              <p className="text-sm text-gray-600">{t('settings.copyright')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
