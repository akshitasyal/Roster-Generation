import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value; // NOTE: if using localStorage, cookies might not be present.
  
  // As this is a client-side heavy app using localStorage for tokens,
  // true middleware cookie checking only works if the backend sets a cookie.
  // We'll add basic route protection, but keep the AuthContext client-side protection as the primary.
  
  const isAuthPage = request.nextUrl.pathname === '/login' || 
                     request.nextUrl.pathname === '/signup' || 
                     request.nextUrl.pathname === '/';
                     
  // We cannot reliably redirect here if the app strictly uses localStorage because middleware 
  // only sees cookies. We will let the client-side AuthContext handle it, which we've just fixed.
  // The primary fix was removing all hardcoded "/associate/dashboard" defaults from the routing.
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
