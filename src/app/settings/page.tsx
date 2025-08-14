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
import { useDailyQuestStore, useUiStore, DemoUser } from '@/lib/store';
import { toast } from 'sonner';
import { isAdminUser } from '@/lib/adminUsers';

// Define different demo user types
const DEMO_USERS: DemoUser[] = [
  {
    name: 'Demo Admin',
    email: 'demo@wordmaster.com',
    image: null,
    type: 'admin',
  },
  {
    name: 'Demo Regular User',
    email: 'user@wordmaster.com',
    image: null,
    type: 'regular',
  },
  {
    name: 'Demo Beginner',
    email: 'beginner@wordmaster.com',
    image: null,
    type: 'beginner',
  },
  {
    name: 'Demo Advanced',
    email: 'advanced@wordmaster.com',
    image: null,
    type: 'advanced',
  },
];

export default function SettingsPage() {
  const { t } = useTranslation('common');
  const { data: session, status } = useSession();
  const [hasGoogleAuth, setHasGoogleAuth] = useState(false);
  const [userLevel, setUserLevel] = useState('Not determined');
  const { refreshQuest, isLoading: isQuestLoading } = useDailyQuestStore();
  const targetLang = useUiStore((s) => s.targetLang);

  // Global state for UI and demo mode
  const {
    isAdmin,
    assessmentLength,
    setAssessmentLength,
    setIsAdmin,
    isDemoMode,
    demoUser,
    setDemoMode,
  } = useUiStore();

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

  const currentUser = isDemoMode ? demoUser : session?.user;
  const isLoading = status === 'loading' && !isDemoMode;

  const handleDemoSignIn = (demoUserType: DemoUser) => {
    setDemoMode(true, demoUserType);

    // Set appropriate user level based on demo type
    let level = 'intermediate';
    switch (demoUserType.type) {
      case 'beginner':
        level = 'beginner';
        break;
      case 'advanced':
        level = 'advanced';
        break;
      default:
        level = 'intermediate';
    }

    localStorage.setItem('userLevel', level);
    setUserLevel(level);

    // Check and set admin status
    const adminStatus = isAdminUser(demoUserType.email);
    setIsAdmin(adminStatus);

    if (adminStatus) {
      toast.success(
        `Demo mode activated: ${demoUserType.name} (Admin privileges enabled)`,
      );
    } else {
      toast.success(`Demo mode activated: ${demoUserType.name}`);
    }
  };

  const handleDemoSignOut = () => {
    setDemoMode(false, null);
    setIsAdmin(false);
    toast.success('Demo mode deactivated');
  };

  const handleRefreshQuest = async () => {
    console.log('Refresh Quest clicked:', { userLevel, isQuestLoading });
    if (userLevel !== 'Not determined') {
      toast(t('settings.refreshingQuest'));

      try {
        await refreshQuest(
          userLevel as 'beginner' | 'intermediate' | 'advanced',
          targetLang,
        );
        toast.success(t('settings.questRefreshed'));
      } catch {
        toast.error(t('settings.refreshError'));
      }
    } else {
      toast.error(t('settings.cannotRefreshQuest'));
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
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">
                        {isDemoMode
                          ? t('settings.demoMode')
                          : t('settings.authenticated')}
                      </Badge>
                      {isDemoMode && demoUser && (
                        <Badge variant="outline" className="capitalize">
                          {demoUser.type}
                        </Badge>
                      )}
                    </div>
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
                <div className="flex gap-2 justify-center mb-4">
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
                </div>

                {/* Demo Mode Buttons */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    Try Demo Modes
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {DEMO_USERS.map((demoUser) => (
                      <Button
                        key={demoUser.type}
                        variant="outline"
                        onClick={() => handleDemoSignIn(demoUser)}
                        className="justify-start text-left h-auto py-3 px-4"
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{demoUser.name}</span>
                          <span className="text-xs text-gray-500 capitalize">
                            {demoUser.type} user
                          </span>
                        </div>
                      </Button>
                    ))}
                  </div>
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
                disabled={isQuestLoading || userLevel === 'Not determined'}
                className={
                  userLevel === 'Not determined'
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }
              >
                {isQuestLoading
                  ? t('settings.refreshing')
                  : userLevel === 'Not determined'
                    ? t('settings.completeAssessmentFirst')
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

        {/* Admin Settings - Only visible to admins */}
        {isAdmin && (
          <Card className="border-2 border-purple-200 bg-purple-50 dark:bg-purple-950 dark:border-purple-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">👑</span>
                Admin Settings
                <Badge className="bg-purple-600 text-white">Admin Only</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Assessment Length</h3>
                  <p className="text-sm text-gray-600">
                    Number of words to learn per session (default: 3)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setAssessmentLength(Math.max(1, assessmentLength - 1))
                    }
                    disabled={assessmentLength <= 1}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center font-semibold">
                    {assessmentLength}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setAssessmentLength(Math.min(10, assessmentLength + 1))
                    }
                    disabled={assessmentLength >= 10}
                  >
                    +
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Admin Status</h3>
                  <p className="text-sm text-gray-600">
                    You have administrator privileges
                  </p>
                </div>
                <Badge className="bg-green-600 text-white">Active</Badge>
              </div>
            </CardContent>
          </Card>
        )}

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
