import { NextRequest, NextResponse } from "next/server"

const DEFAULT_REGION = (
  process.env.NEXT_PUBLIC_DEFAULT_REGION || "in"
).toLowerCase()

// Additional non-default regions that keep their URL prefix if explicitly visited
const NON_DEFAULT_REGIONS = new Set(["us", "gb"])

/**
 * Clean-URL region middleware:
 * - Default region ("in") is served via internal NextResponse.rewrite so URLs stay clean
 *   (e.g. imotora.com/, imotora.com/store, imotora.com/products/...) with NO "/in" prefix.
 * - Direct visits to "/in" or "/in/..." are redirected to the clean URL without "/in".
 * - Non-default regions ("/us", "/gb") continue to work with their prefix.
 * - Never blocks on a live backend fetch during Render cold-starts.
 */
export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // Skip static assets with file extensions
  if (pathname.includes(".")) {
    return NextResponse.next()
  }

  const cacheIdCookie = request.cookies.get("_medusa_cache_id")
  const cacheId = cacheIdCookie?.value || crypto.randomUUID()

  const firstSegment = pathname.split("/")[1]?.toLowerCase() || ""

  // 1. Strip "/in" (default region) if present in the URL
  if (firstSegment === DEFAULT_REGION) {
    const strippedPath = pathname.slice(DEFAULT_REGION.length + 1) || "/"
    const cleanUrl = new URL(`${strippedPath}${search}`, request.url)
    const response = NextResponse.redirect(cleanUrl, 308)
    if (!cacheIdCookie) {
      response.cookies.set("_medusa_cache_id", cacheId, {
        maxAge: 60 * 60 * 24,
      })
    }
    return response
  }

  // 2. Allow explicit non-default region prefixes (e.g. /us, /gb)
  if (NON_DEFAULT_REGIONS.has(firstSegment)) {
    const response = NextResponse.next()
    if (!cacheIdCookie) {
      response.cookies.set("_medusa_cache_id", cacheId, {
        maxAge: 60 * 60 * 24,
      })
    }
    return response
  }

  // 3. Rewrite clean URLs internally to "/in/..." without changing the browser URL
  const targetPath =
    pathname === "/"
      ? `/${DEFAULT_REGION}`
      : `/${DEFAULT_REGION}${pathname}`
  const rewriteUrl = new URL(`${targetPath}${search}`, request.url)
  const response = NextResponse.rewrite(rewriteUrl)

  if (!cacheIdCookie) {
    response.cookies.set("_medusa_cache_id", cacheId, {
      maxAge: 60 * 60 * 24,
    })
  }

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
