'use client';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function AuthButtons() {
  const { data: session } = useSession();
  if (session) {
    return (
      <button
        onClick={() => signOut()}
        className="px-3 py-1 bg-red-500 text-white rounded"
      >
        Sign out
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => signIn('google')}
        className="px-3 py-1 bg-blue-500 text-white rounded"
      >
        Google
      </button>
      <button
        onClick={() => signIn('apple')}
        className="px-3 py-1 bg-black text-white rounded"
      >
        Apple
      </button>
    </div>
  );
}
