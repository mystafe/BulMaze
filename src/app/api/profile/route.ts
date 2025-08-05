import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { requiredXP } from '@/lib/levels';

type Profile = {
  cefr: string;
  levelNumeric: number;
  xp: number;
  requiredXp: number;
  history: number[];
};

const authEnabled = process.env.FEATURE_AUTH === 'true';

let profile: Profile = {
  cefr: 'A1',
  levelNumeric: 1,
  xp: 0,
  requiredXp: requiredXP(1),
  history: [],
};

export async function GET() {
  if (authEnabled) {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }
  return NextResponse.json(profile);
}

export async function POST(request: Request) {
  if (authEnabled) {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }
  const data = await request.json();
  profile = data as Profile;
  return NextResponse.json(profile);
}
