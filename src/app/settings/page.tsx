'use client';

import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LanguageSelector from '@/components/LanguageSelector';
import ThemeToggle from '@/components/ThemeToggle';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useDailyQuestStore } from '@/lib/store';
import { useToast } from '@/components/ui/use-toast';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoUser, setDemoUser] = useState<any>(null);
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
        title: 'Refreshing Quest...',
        description: 'Fetching new words from our AI.',
      });
      await fetchQuest(userLevel as 'beginner' | 'intermediate' | 'advanced');
      toast({
        title: 'Quest Refreshed!',
        description: 'Your new daily quest is ready.',
      });
    } else {
      toast({
        title: 'Cannot Refresh Quest',
        description: 'Please complete the level assessment first.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Settings</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Customize your learning experience and manage your account
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">👤</span>
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                <span>Loading account information...</span>
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
                      {isDemoMode ? 'Demo Mode' : 'Authenticated'}
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
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-4">
                  Sign in to access your account settings
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
                      Sign In with Google
                    </Button>
                  )}
                  <Button variant="outline" onClick={handleDemoSignIn}>
                    Try Demo Mode
                  </Button>
                </div>
                {!hasGoogleAuth && (
                  <p className="text-xs text-gray-500 mt-2">
                    Google OAuth not configured. Using demo mode.
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
              Learning Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Language</h3>
              <LanguageSelector />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Theme</h3>
              <ThemeToggle />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Your Level</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{userLevel}</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (window.location.href = '/career')}
                >
                  Retake Assessment
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
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Daily Reminders</h3>
                <p className="text-sm text-gray-600">
                  Get reminded to study daily
                </p>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Progress Updates</h3>
                <p className="text-sm text-gray-600">
                  Receive updates on your learning progress
                </p>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Achievement Notifications</h3>
                <p className="text-sm text-gray-600">
                  Get notified when you unlock achievements
                </p>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🔒</span>
              Data & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Refresh Daily Quest</h3>
                <p className="text-sm text-gray-600">
                  Get a new set of words for today's quest.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshQuest}
                disabled={isQuestLoading}
              >
                {isQuestLoading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Export Data</h3>
                <p className="text-sm text-gray-600">
                  Download your learning data
                </p>
              </div>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Delete Account</h3>
                <p className="text-sm text-gray-600">
                  Permanently delete all your account data.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">ℹ️</span>
              About WordMaster
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Version: 1.0.0</p>
              <p className="text-sm text-gray-600">
                Built with Next.js, TypeScript, and Tailwind CSS
              </p>
              <p className="text-sm text-gray-600">
                © 2024 WordMaster - Master English vocabulary through
                interactive learning
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
