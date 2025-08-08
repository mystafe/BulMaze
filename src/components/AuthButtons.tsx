'use client';

// Basit state yönetimi ile animasyonlu giriş/çıkış butonları
import Image from 'next/image';
import { useState } from 'react';

type User = {
  name: string;
  avatar: string;
};

export default function AuthButtons() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const fakeDelay = () => new Promise((r) => setTimeout(r, 1000));

  const handleSignIn = async () => {
    setLoading(true);
    await fakeDelay();
    setUser({ name: 'Ahmet', avatar: 'https://i.pravatar.cc/100?img=3' });
    setLoading(false);
  };

  const handleSignOut = async () => {
    setLoading(true);
    await fakeDelay();
    setUser(null);
    setLoading(false);
  };

  const Button = ({
    label,
    onClick,
    variant,
  }: {
    label: string;
    onClick: () => void;
    variant: 'primary' | 'danger';
  }) => (
    <button
      onClick={onClick}
      disabled={loading}
      className={`flex items-center justify-center px-4 py-2 rounded-md text-white font-medium shadow transition-all disabled:opacity-50 hover:scale-105 active:scale-95 ${
        variant === 'primary'
          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
          : 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'
      }`}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <span>{label}</span>
      )}
    </button>
  );

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Image
          src={user.avatar}
          alt={user.name}
          width={32}
          height={32}
          className="rounded-full"
        />
        <span className="text-sm font-medium">{user.name}</span>
        <Button label="Çıkış" onClick={handleSignOut} variant="danger" />
      </div>
    );
  }

  return <Button label="Giriş" onClick={handleSignIn} variant="primary" />;
}

