// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get("authToken");
//   const isAuthPage = request.nextUrl.pathname.startsWith("/auth");

//   if (!token && !isAuthPage && request.nextUrl.pathname !== "/") {
//     return NextResponse.redirect(new URL("/auth/login", request.url));
//   }

//   if (token && isAuthPage) {
//     return NextResponse.redirect(new URL("/airdrop-reminder", request.url));
//   }

//   if (token && isAuthPage) {
//     return NextResponse.redirect(new URL("/subscription", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };
