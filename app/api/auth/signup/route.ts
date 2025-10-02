import { NextResponse } from 'next/server';
import { signUpAction } from '@/actions/auth';

export async function POST(request: Request) {
  try {
    const { fullName, email, password, confirmPassword, acceptedTerms } = await request.json();
    const result = await signUpAction({ fullName, email, password, confirmPassword, acceptedTerms });
    if (!(result as any)?.ok) {
      return NextResponse.json({ ok: false, error: 'Invalid sign up data' }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: 'Unexpected error' }, { status: 500 });
  }
}


