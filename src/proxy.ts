import { NextRequest, NextResponse } from 'next/server';

/**
 * Decodes the JWT payload segment (base64url) WITHOUT cryptographic
 * verification — only used to read the `exp` claim before the route
 * handler re-validates the signature server-side.
 */
function getTokenExpiry(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return typeof payload.exp === 'number' ? payload.exp : null;
  } catch {
    return null;
  }
}

function isTokenExpired(token: string | undefined): boolean {
  if (!token) return true;
  const exp = getTokenExpiry(token);
  if (exp === null) return true;
  return exp < Math.floor(Date.now() / 1000);
}

export default async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  // ✅ Access token is still valid — proceed immediately
  if (!isTokenExpired(accessToken)) {
    return NextResponse.next();
  }

  // ❌ Refresh token is also expired/missing — redirect to login
  if (isTokenExpired(refreshToken)) {
    return redirectToLogin(request);
  }

  // 🔄 Access token expired but refresh token is valid — call refresh endpoint
  try {
    const refreshUrl = new URL('/api/auth?type=refresh', request.url);

    const refreshResponse = await fetch(refreshUrl.toString(), {
      method: 'POST',
      headers: {
        // Forward the existing cookies so the refresh endpoint can read refreshToken
        cookie: request.headers.get('cookie') ?? '',
      },
    });

    if (!refreshResponse.ok) {
      return redirectToLogin(request);
    }

    const newCookies = refreshResponse.headers.getSetCookie();

    // Parse the new cookie values out of the Set-Cookie headers so we can
    // inject them into the *request* headers. This is necessary because
    // Next.js server components read cookies() from the incoming request,
    // not from the response Set-Cookie headers. Without this, withAuth()
    // would still see the expired accessToken during the same render and
    // return null — forcing the user to refresh the page.
    const newCookieMap = new Map<string, string>();
    newCookies.forEach((setCookie) => {
      const [nameValue] = setCookie.split(';');
      const eqIdx = nameValue.indexOf('=');
      if (eqIdx !== -1) {
        const name = nameValue.slice(0, eqIdx).trim();
        const value = nameValue.slice(eqIdx + 1).trim();
        newCookieMap.set(name, value);
      }
    });

    // Merge the new values over the existing cookie header
    const existingCookies = new Map<string, string>();
    request.cookies.getAll().forEach(({ name, value }) => existingCookies.set(name, value));
    const mergedCookieHeader = [...new Map([...existingCookies, ...newCookieMap]).entries()]
      .map(([name, value]) => `${name}=${value}`)
      .join('; ');

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('cookie', mergedCookieHeader);

    // ✅ Refresh succeeded — forward new cookies both to the request (so
    // server components see fresh tokens this render) and to the response
    // (so the browser stores them for all subsequent requests).
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    newCookies.forEach((cookie) => response.headers.append('Set-Cookie', cookie));

    return response;
  } catch {
    return redirectToLogin(request);
  }
}

/**
 * Redirects to /login, signals the client to clear its auth state, and
 * expires the auth cookies so the middleware doesn't loop on the next request.
 * NOTE: store.dispatch(logout()) cannot be called here — this code runs on
 * the Edge runtime and has no access to the browser's Redux/localStorage store.
 * The client handles the state clear via the sessionExpired query param.
 */
function redirectToLogin(request: NextRequest): NextResponse {
  const loginUrl = new URL('/login?sessionExpired=true', request.url);
  const response = NextResponse.redirect(loginUrl);
  // Expire the cookies so they are not re-sent on the login page request
  response.cookies.delete('accessToken');
  response.cookies.delete('refreshToken');
  return response;
}

export const config = {
  // Run only on dashboard pages — route group names don't appear in URLs
  matcher: ['/chat/:path*', '/documents/:path*', '/account-settings/:path*'],
};
