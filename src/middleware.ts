import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PATHS = ['/signal'];
const COOKIE_NAME = 'signal_auth';
const COOKIE_VALUE = 'granted';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some(p =>
    pathname === p || pathname.startsWith(p + '/')
  );

  if (!isProtected) return NextResponse.next();

  // Allow login page through
  if (pathname === '/signal/login') return NextResponse.next();

  // Check auth cookie
  const auth = request.cookies.get(COOKIE_NAME);
  if (auth?.value === COOKIE_VALUE) return NextResponse.next();

  // Redirect to login
  const loginUrl = new URL('/signal/login', request.url);
  loginUrl.searchParams.set('from', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/signal', '/signal/:path*'],
};
