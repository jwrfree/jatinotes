# Testing JatiNotes

## Overview
JatiNotes is a Next.js 16 blog using the `proxy.ts` convention (NOT `middleware.ts`). Key testable areas: admin auth, CSP headers, accessibility, SEO/JSON-LD, security headers.

## Framework
- Next.js 16.1.x with App Router and `proxy.ts` (replaces middleware.ts)
- Sanity CMS for content
- Deployed on Vercel

## Devin Secrets Needed
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` — for testing authenticated admin access
- `SANITY_WEBHOOK_SECRET` — for testing webhook endpoint authentication
- Vercel team access — for accessing preview deployments (Vercel SSO protects previews)

## Testing Environments
- **Production**: https://jatinotes.com — always accessible, ISR cache may serve stale pages (60-3600s)
- **Vercel Preview**: Generated per-PR but protected by Vercel SSO. You likely cannot access previews without team login. Design tests around production instead.
- **Local build**: `npm run build` requires `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` env vars. Without them, build fails at page generation (but TypeScript compilation succeeds).

## Key Test Commands

### Admin Basic Auth
```bash
# Should return 401 + WWW-Authenticate header
curl -sI https://jatinotes.com/admin/dashboard | grep -i "HTTP/\|www-authenticate"
```

### Route-Specific CSP
```bash
# Homepage should NOT have unsafe-eval
curl -sI https://jatinotes.com/ | grep -i content-security-policy | tr ';' '\n' | grep script-src

# /studio SHOULD have unsafe-eval
curl -sI https://jatinotes.com/studio | grep -i content-security-policy | tr ';' '\n' | grep script-src
```

### Security Headers
```bash
curl -sI https://jatinotes.com/ | grep -i "strict-transport\|x-frame-options\|x-content-type\|referrer-policy\|permissions-policy\|x-robots-tag"
```

### JSON-LD Schemas
```bash
# Check schema types on homepage
curl -s https://jatinotes.com/ | grep -o '"@type":"[^"]*"'

# Verify no SearchAction
curl -s https://jatinotes.com/ | grep -c SearchAction
```

### Skip-to-Content (Browser)
1. Load https://jatinotes.com/
2. Press Tab — "Skip to content" button should appear top-left
3. Status bar should show `#main-content` anchor

### Hamburger Menu Accessibility (Browser)
1. Resize viewport to mobile width (<768px)
2. Check hamburger button has `aria-expanded` attribute
3. Toggle menu and verify `aria-expanded` changes between `true`/`false`

## Known Gotchas
- Vercel preview deployments are SSO-protected — you'll get 401 with `_vercel_sso_nonce` cookie on all routes. This is NOT the admin auth; it's Vercel team protection.
- Production pages may be cached via ISR. The proxy.ts runs at request time (so /admin auth and CSP always reflect latest code), but static page HTML may be stale.
- `next.config.ts` headers and `proxy.ts` headers can conflict if both set CSP. Only proxy.ts should set CSP.
- The build requires Sanity env vars. If build fails with `Missing NEXT_PUBLIC_SANITY_DATASET`, the Sanity env vars aren't configured on Vercel.
