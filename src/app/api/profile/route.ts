import { NextRequest, NextResponse } from 'next/server';

let profile: Record<string, unknown> | null = null;

export async function GET() {
  return NextResponse.json(profile || {});
}

export async function POST(req: NextRequest) {
  profile = await req.json();
  return NextResponse.json({ ok: true });
}
