import { NextResponse } from 'next/server';
import { signUpAction } from '@/actions/auth';

type SignUpBody = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
};

export async function POST(request: Request) {
  try {
    const { fullName, email, password, confirmPassword, acceptedTerms } = (await request.json()) as SignUpBody;
    const result = await signUpAction({ fullName, email, password, confirmPassword, acceptedTerms });
    if (!result || (typeof result === 'object' && 'ok' in result && !result.ok)) {
      return NextResponse.json({ ok: false, error: 'Invalid sign up data' }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Unexpected error' }, { status: 500 });
  }
}


