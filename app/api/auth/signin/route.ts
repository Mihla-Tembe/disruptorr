import { NextResponse } from 'next/server';
import { signInAction } from '@/actions/auth';

type SignInBody = { email: string; password: string };

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as SignInBody;
    const result = await signInAction({ email, password });
    if (!result || (typeof result === 'object' && 'ok' in result && !result.ok)) {
      return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Unexpected error' }, { status: 500 });
  }
}


