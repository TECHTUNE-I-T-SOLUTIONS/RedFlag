# RedFlag Authentication Rebuild - Implementation Guide

## Overview
Complete switch from Supabase Auth → NextAuth.js
- Database: PostgreSQL (no RLS policies)
- Auth: NextAuth.js with custom Credentials provider
- Sessions: NextAuth (JWT or Database sessions)
- Security: Bcrypt passwords, HTTPS, CSRF protection built-in

## Architecture

```
User Login
    ↓
NextAuth Credentials Provider
    ↓
Verify against users table (email + bcrypt password)
    ↓
Create session (JWT in cookie)
    ↓
Access protected /dashboard routes
    ↓
Proxy middleware checks session cookie validity
    ↓
Dashboard loads, uses session to make API calls
```

## Phase 1: Database Setup

### 1.1 Run the SQL To reset everything:
```bash
# Execute reset-database.sql in Supabase dashboard
# Or via psql:
psql -h your-db-host -U postgres -d redflag -f scripts/reset-database.sql
```

This creates:
- `users` table (email, password_hash, last_signin_at)
- `profiles` table (user info)
- `analyses` table (no RLS)
- `notifications` table (with auto-delete notifications via trigger)
- Triggers for timestamps, auto-deletion, and notifications

### 1.2 Verify by running in Supabase:
```sql
SELECT * FROM users;
SELECT * FROM analyses;
SELECT * FROM notifications;
```

## Phase 2: Install NextAuth

```bash
npm install next-auth bcryptjs
npm install -D @types/next-auth
```

## Phase 3: Database Utilities

Create `lib/db.ts`:
```typescript
import { Pool } from 'pg'; // or use your DB client

// Query helper (replace with your DB client)
export async function queryDB(sql: string, params: any[] = []) {
  // Use your database connection
  // Example with pg:
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const result = await pool.query(sql, params);
  await pool.end();
  return result.rows;
}
```

Create `lib/auth-utils.ts`:
```typescript
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Get user from DB
export async function getUserByEmail(email: string) {
  // Query: SELECT id, email FROM users WHERE email = $1
}

// Create user
export async function createUser(email: string, password: string) {
  const passwordHash = await hashPassword(password);
  // Query: INSERT INTO users (email, password_hash) VALUES ($1, $2)
}
```

## Phase 4: NextAuth Configuration

Create `lib/auth-config.ts`:
```typescript
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyPassword, getUserByEmail } from './auth-utils';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        // Get user from database
        const user = await getUserByEmail(credentials.email);
        
        if (!user) {
          throw new Error('No user found with this email');
        }

        // Verify password
        const isValid = await verifyPassword(credentials.password, user.password_hash);
        
        if (!isValid) {
          throw new Error('Invalid password');
        }

        // Update last signin
        // Query: UPDATE users SET last_signin_at = NOW() WHERE id = $1

        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt', // or 'database' if you want to track all sessions
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user!.id = token.id as string;
      session.user!.email = token.email as string;
      return session;
    },
  },
};
```

Create `app/api/auth/[...nextauth]/route.ts`:
```typescript
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth-config';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

## Phase 5: Authentication Pages

Update `app/auth/login/page.tsx`:
```typescript
'use client'

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else if (result?.ok) {
      router.push('/dashboard');
    }
  };

  return (
    // Your login form JSX
    // On submit, call handleLogin()
  );
}
```

Create `app/auth/signup/page.tsx`:
```typescript
'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Call signup API
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Signup failed');
      }

      // Auto-login after signup
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Your signup form JSX
    // On submit, call handleSignup()
  );
}
```

Create `app/api/auth/signup/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Create user
    await createUser(email, password);

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Signup failed' },
      { status: 500 }
    );
  }
}
```

## Phase 6: Session Middleware (Optional - Can use Proxy instead)

If you want middleware for session validation:

Create `middleware.ts`:
```typescript
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
```

## Phase 7: Dashboard Updates

Update `app/dashboard/page.tsx` to use NextAuth:

```typescript
'use client'

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    // Load data if authenticated
    if (status === 'authenticated') {
      loadDashboardData();
    }
  }, [status, router]);

  const loadDashboardData = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <h1>Welcome, {session.user?.email}</h1>
      {/* Dashboard content */}
      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
}
```

## Phase 8: API Routes Security

Update API routes to check NextAuth session:

```typescript
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get the session from cookies
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const userId = session.user.id;

  // Fetch data for this specific user
  // Your API logic here...
}
```

## Phase 9: Environment Variables

Add to `.env.local`:
```
NEXTAUTH_URL=http://localhost:3000 # or your Vercel URL
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
DATABASE_URL=postgresql://...
```

## Security Checklist

- ✅ Passwords hashed with bcrypt
- ✅ NextAuth handles session encryption
- ✅ CSRF protection built into NextAuth
- ✅ API routes validate session
- ✅ Use HTTPS in production
- ✅ Database connection uses environment variables
- ✅ Sensitive data: consider encryption at rest
- ✅ Rate limiting on auth endpoints (optional: add later)

## Testing

1. Reset database: Run `reset-database.sql`
2. Install dependencies: `npm install next-auth bcryptjs`
3. Set environment variables
4. Implement auth config, pages, and API routes (Phases 3-7)
5. Test signup: Create a new user
6. Test login: Login with created user
7. Test dashboard: Verify redirects working
8. Test logout: Verify session clears

## Advantages of This Approach

✅ Full control over authentication
✅ No Supabase Auth subscription costs
✅ NextAuth is industry-standard
✅ Sessions managed securely by NextAuth
✅ Can customize everything
✅ Better performance (no external auth service)
✅ Data stays in your database
✅ Easy to add 2FA, OAuth later if needed

## Questions?

- Need encryption for sensitive data? Add crypto.js or use pg-crypto
- Want rate limiting? Add express-rate-limit middleware
- Need logging? Add to auth callbacks
- Want 2FA? NextAuth supports TOTP providers
