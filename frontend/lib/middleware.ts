import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const isAuthenticated = Boolean(token);

  if (!isAuthenticated)
    return NextResponse.redirect(new URL("/landing/login", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/post/new"],
};
