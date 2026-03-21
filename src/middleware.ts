import { NextResponse, type NextRequest } from "next/server";

async function getSession(request: NextRequest) {
  const url = `${request.nextUrl.origin}/api/auth/get-session`;
  const response = await fetch(url, {
    headers: { cookie: request.headers.get("cookie") ?? "" },
  });
  if (!response.ok) return null;
  return response.json();
}

export async function middleware(request: NextRequest) {
  const session = await getSession(request);
  const { pathname } = request.nextUrl;

  if (!session && pathname.startsWith("/inbox"))
    return NextResponse.redirect(new URL("/login", request.url));
  if (session && pathname.startsWith("/login"))
    return NextResponse.redirect(new URL("/inbox", request.url));

  return NextResponse.next();
}

export const config = { matcher: ["/inbox/:path*", "/login"] };
