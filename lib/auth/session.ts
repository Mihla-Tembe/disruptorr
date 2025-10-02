// lib/auth.ts
import bcrypt from 'bcrypt';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// Make sure your secret is at least 32 characters
const SECRET = process.env.AUTH_SECRET!;
const encoder = new TextEncoder();
const key = encoder.encode(SECRET);

export type NewUser = { id: string; email?: string };

// -----------------------
// Password utilities
// -----------------------

export async function comparePasswords(
  plainTextPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainTextPassword, hashedPassword);
}

// -----------------------
// Session / JWT
// -----------------------
export type SessionData = {
  user: { id: string; email?: string };
  expires: string;
};

// Create a JWT
export async function signToken(payload: SessionData): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d') // 1 day
    .setSubject(payload.user.id)
    .sign(key);
}

// Verify a JWT
export async function verifyToken(token: string): Promise<SessionData> {
  const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
  return payload as SessionData;
}

// -----------------------
// Cookie helpers
// -----------------------

// Get session from cookies
export async function getSession(): Promise<SessionData | null> {
  const cookie = (await cookies()).get('session')?.value;
  if (!cookie) return null;

  try {
    return await verifyToken(cookie);
  } catch (err) {
    return null; // Invalid or expired token
  }
}

// Set session cookie
export async function setSession(user: NewUser) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
  const session: SessionData = {
    user: { id: user.id, email: user.email },
    expires: expires.toISOString(),
  };

  const token = await signToken(session);

  (await cookies()).set({
    name: 'session',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires,
  });
}

// Clear session cookie
export async function clearSession() {
  (await cookies()).set({
    name: 'session',
    value: '',
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
}
