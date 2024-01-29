import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: async ({ token }) => {
      return !!token;
    },
  },
  pages: {
    signIn: "/signin",
  },
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|icons|favicon.ico).*)"],
};
