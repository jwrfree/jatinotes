import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // --- Route-specific CSP Configuration ---
  const isStudio = pathname.startsWith('/studio')

  const scriptSrc = isStudio
    ? "'self' 'unsafe-eval' 'unsafe-inline' https://cdn.sanity.io"
    : "'self' 'unsafe-inline' https://www.googletagmanager.com https://va.vercel-scripts.com"

  const cspHeader = `
    default-src 'self';
    script-src ${scriptSrc};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://*.jatinotes.com https://jatinotes.com https://cdn.sanity.io https://secure.gravatar.com https://*.gravatar.com https://images.unsplash.com https://*.wp.com https://*.googleapis.com https://*.gstatic.com https://www.google-analytics.com https://ui-avatars.com;
    connect-src 'self' https://jatinotes.com https://cdn.sanity.io https://*.api.sanity.io https://www.google-analytics.com https://analytics.google.com;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim()

  const response = NextResponse.next()
  response.headers.set('Content-Security-Policy', cspHeader)

  // --- Basic Auth for Admin routes ---
  if (pathname.startsWith('/admin')) {
    const basicAuth = request.headers.get('authorization')

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1]
      try {
        const decoded = atob(authValue)
        const colonIdx = decoded.indexOf(':')
        const [user, pwd] = colonIdx === -1 ? [decoded, ''] : [decoded.slice(0, colonIdx), decoded.slice(colonIdx + 1)]
        if (user === process.env.ADMIN_USERNAME && pwd === process.env.ADMIN_PASSWORD) {
          return response
        }
      } catch {
        // Invalid base64
      }
    }

    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    })
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
