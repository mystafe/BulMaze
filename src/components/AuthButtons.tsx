'use client';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function AuthButtons() {
  const { data: session } = useSession();
  if (process.env.FEATURE_AUTH !== 'true') return null;
  return session ? (
    <button onClick={() => signOut()} className="px-3 py-1 bg-red-500 text-white rounded">
      Sign out
    </button>
  ) : (
    <button onClick={() => signIn('google')} className="px-3 py-1 bg-blue-500 text-white rounded">
      Sign in
    </button>
  );
}
