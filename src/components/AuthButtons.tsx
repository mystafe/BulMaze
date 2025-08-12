'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';

export default function AuthButtons() {
  const { data: session, status } = useSession();
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoUser, setDemoUser] = useState<any>(null);
  const [hasGoogleAuth, setHasGoogleAuth] = useState(false);
  const { toast } = useToast();
  const prevStatus = useRef(status);

  useEffect(() => {
    // Check for login
    if (prevStatus.current === 'loading' && status === 'authenticated') {
      toast({
        title: 'Signed In',
        description: `Welcome back, ${session?.user?.name || 'User'}!`,
      });
    }

    // Check for demo mode login
    if (!demoUser && isDemoMode) {
      toast({
        title: 'Demo Mode Activated',
        description: 'You are now browsing as a demo user.',
      });
    }

    prevStatus.current = status;
  }, [status, session, toast, isDemoMode, demoUser]);

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
        image: null, // Use local avatar instead
      });
    } else {
      // Use current window location as callback URL
      const callbackUrl = window.location.origin;
      signIn('google', { callbackUrl });
    }
  };

  const handleSignOut = async () => {
    if (isDemoMode) {
      setDemoUser(null);
      setIsDemoMode(false);
      toast({
        title: 'Signed Out',
        description: 'You have signed out of demo mode.',
      });
    } else {
      await signOut({ redirect: false });
      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
      });
    }
  };

  if (status === 'loading' && !isDemoMode) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  // Use demo user if in demo mode, otherwise use session
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
          // Local avatar for demo mode
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
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={handleSignIn} size="sm">
      {hasGoogleAuth ? 'Sign In' : 'Try Demo'}
    </Button>
  );
}
