import { withAuth } from "next-auth/middleware";
import { userSession } from "./hooks/userSession";

export default withAuth({
  callbacks: {
    authorized: async ({ req }) => {
      const { id } = await userSession();
      return !!id;
    },
  },
  pages: {
    signIn: "/signin",
  },
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|icons|favicon.ico).*)"],
};
