import { NextResponse } from 'next/server';

const DEMO_USERS = [
  {
    email: 'demo@anhquoc.com',
    password: 'password123',
    name: 'Demo Customer',
  },
  {
    email: 'admin@anhquoc.com',
    password: 'admin123',
    name: 'Store Admin',
  },
];

export async function POST(request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const matchedUser = DEMO_USERS.find(
      (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password
    );

    if (!matchedUser) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        email: matchedUser.email,
        name: matchedUser.name,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Something went wrong while signing in.' },
      { status: 500 }
    );
  }
}
