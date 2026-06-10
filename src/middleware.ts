import { NextRequest, NextResponse } from 'next/server';

const COOKIE_VALUE = 'granted';

// Each gated area: its base path, its auth cookie, and its login route.
const GATES = [
  { base: '/signal', cookie: 'signal_auth', login: '/signal/login' },
  { base: '/dashboard', cookie: 'dash_auth', login: '/dashboard/login' },
  { base: '/pab-landing', cookie: 'pab_auth', login: '/pab-landing/login' },
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const gate = GATES.find(g => pathname === g.base || pathname.startsWith(g.base + '/'));
  if (!gate) return NextResponse.next();

  // Allow the gate's own login page through
  if (pathname === gate.login) return NextResponse.next();

  // Check auth cookie
  if (request.cookies.get(gate.cookie)?.value === COOKIE_VALUE) return NextResponse.next();

  // Redirect to the gate's login
  const loginUrl = new URL(gate.login, request.url);
  loginUrl.searchParams.set('from', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/signal', '/signal/:path*', '/dashboard', '/dashboard/:path*', '/pab-landing', '/pab-landing/:path*'],
};
