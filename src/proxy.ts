import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        if (
          pathname.startsWith("/auth/login") ||
          pathname.startsWith("/auth/register") ||
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/")
        ) {
          return true;
        }

        return !!token;
      },
    },
  },
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    "/orderStatus","/api/orders","/lib/server_actions/payment.server.action" ],
};
