import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Cek apakah user sudah login atau punya akses admin
  // Sementara kita gunakan basic auth atau environment variable
  
  const basicAuth = request.headers.get('authorization')
  
  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')
    
    if (user === process.env.ADMIN_USERNAME && pwd === process.env.ADMIN_PASSWORD) {
      return NextResponse.next()
    }
  }
  
  // Jika tidak ada auth, minta login
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin Area"',
    },
  })
}

export const config = {
  matcher: ['/admin/:path*']
}