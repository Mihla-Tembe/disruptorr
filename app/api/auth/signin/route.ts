import { NextResponse } from 'next/server';
import { signInAction } from '@/actions/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const result = await signInAction({ email, password });
    if (!(result as any)?.ok) {
      return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: 'Unexpected error' }, { status: 500 });
  }
}


