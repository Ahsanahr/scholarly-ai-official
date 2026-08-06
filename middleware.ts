import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SECURED_ROUTES = ['/api/search', '/api/sop', '/api/matchup'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (SECURED_ROUTES.some((route) => path.startsWith(route))) {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing or invalid Authorization header.' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: Empty token.' },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
