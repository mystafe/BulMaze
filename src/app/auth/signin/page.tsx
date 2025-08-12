'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';

function SignInContent() {
  const [callbackUrl, setCallbackUrl] = useState('/');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setCallbackUrl(searchParams.get('callbackUrl') || '/');
  }, []);

  const handleSignIn = async (provider: string) => {
    await signIn(provider, { callbackUrl });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Sign In to WordMaster
            </CardTitle>
            <p className="text-center text-gray-600 dark:text-gray-300">
              Choose your preferred sign-in method
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => handleSignIn('google')}
              className="w-full"
              size="lg"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </Button>

            <Button
              onClick={() => handleSignIn('apple')}
              className="w-full"
              size="lg"
              variant="outline"
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Sign in with Apple
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Don&apos;t have an account?{' '}
                <Link href="/" className="text-blue-600 hover:text-blue-500">
                  Go back to home
                </Link>
              </p>
            </div>

            <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                Setup Instructions
              </h3>
              <div className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                <p>To enable Google OAuth, add these to your .env.local:</p>
                <code className="block bg-yellow-100 dark:bg-yellow-800 p-2 rounded mt-2">
                  NEXTAUTH_URL=http://localhost:3001
                  <br />
                  NEXTAUTH_SECRET=your-secret-key
                  <br />
                  GOOGLE_CLIENT_ID=your-google-client-id
                  <br />
                  GOOGLE_CLIENT_SECRET=your-google-client-secret
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
