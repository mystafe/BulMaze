'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useUiStore } from '@/lib/store';
import { isAdminUser } from '@/lib/adminUsers';
import { useTranslation } from 'react-i18next';

interface DemoUser {
  name: string;
  email: string;
  image: string | null;
}

export default function AuthButtons() {
  const { t } = useTranslation('common');
  const { data: session, status } = useSession();
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoUser, setDemoUser] = useState<DemoUser | null>(null);
  const [hasGoogleAuth, setHasGoogleAuth] = useState(false);

  const prevStatus = useRef(status);

  // Admin control
  const setIsAdmin = useUiStore((s) => s.setIsAdmin);

  useEffect(() => {
    // Check for login
    if (prevStatus.current === 'loading' && status === 'authenticated') {
      toast.success(
        `${t('welcome_back', { defaultValue: 'Welcome back' })}, ${session?.user?.name || 'User'}!`,
      );
    }

    // Check for demo mode login
    if (!demoUser && isDemoMode) {
      toast.success(t('demo_mode_on', { defaultValue: 'Demo Mode Activated' }));
    }

    // Check admin status
    const currentUser = isDemoMode ? demoUser : session?.user;
    if (currentUser?.email) {
      const adminStatus = isAdminUser(currentUser.email);
      setIsAdmin(adminStatus);
      if (adminStatus) {
        toast.success(
          t('admin_on', { defaultValue: 'Admin privileges activated' }),
        );
      }
    }

    prevStatus.current = status;
  }, [status, session, isDemoMode, demoUser, setIsAdmin, t]);

  // Check if Google OAuth is properly configured on mount
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
  }, []);

  const handleSignIn = () => {
    // If no Google OAuth configured or in development, use demo mode
    if (!hasGoogleAuth || process.env.NODE_ENV === 'development') {
      setIsDemoMode(true);
      setDemoUser({
        name: 'Demo User',
        email: 'demo@wordmaster.com',
        image: null,
      });
    } else {
      const callbackUrl = window.location.origin;
      // Force account chooser to avoid auto-signing into the last Google account
      signIn('google', { callbackUrl, prompt: 'select_account' } as any);
    }
  };

  const handleSignOut = async () => {
    if (isDemoMode) {
      setDemoUser(null);
      setIsDemoMode(false);
      toast.success(
        t('signed_out_demo', { defaultValue: 'Signed out of demo mode' }),
      );
    } else {
      await signOut({ redirect: false });
      toast.success(
        t('signed_out', { defaultValue: 'Successfully signed out' }),
      );
    }
  };

  if (status === 'loading' && !isDemoMode) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
        <span className="text-sm text-gray-600">
          {t('loading', { defaultValue: 'Loading...' })}
        </span>
      </div>
    );
  }

  const currentUser = isDemoMode ? demoUser : session?.user;

  if (currentUser) {
    return (
      <div className="flex items-center gap-3">
        {currentUser.image ? (
          <Image
            src={currentUser.image}
            alt={currentUser.name || 'User'}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {currentUser.name?.charAt(0) || 'D'}
          </div>
        )}
        <span className="text-sm font-medium hidden sm:inline">
          {currentUser.name || currentUser.email}
          {isDemoMode && (
            <span className="text-xs text-gray-500 ml-1">(Demo)</span>
          )}
        </span>
        <Button onClick={handleSignOut} variant="outline" size="sm">
          {t('sign_out', { defaultValue: 'Sign Out' })}
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={handleSignIn} size="sm">
      {hasGoogleAuth
        ? t('sign_in', { defaultValue: 'Sign In' })
        : t('try_demo', { defaultValue: 'Try Demo' })}
    </Button>
  );
}
