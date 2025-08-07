import { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import AppleProvider from 'next-auth/providers/apple';

const providers =
  process.env.FEATURE_AUTH === 'true'
    ? [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        AppleProvider({
          clientId: process.env.APPLE_CLIENT_ID!,
          clientSecret: process.env.APPLE_CLIENT_SECRET!,
        }),
      ]
    : [];

export const authOptions: NextAuthOptions = {
  providers,
};
