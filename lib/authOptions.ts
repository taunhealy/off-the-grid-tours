import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { CustomPrismaAdapter } from "./auth-adapter";
import { prisma } from "./prisma";

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    sub?: string;
    role?: string;
    picture?: string;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
    };
  }

  interface User {
    id: string;
    role?: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: CustomPrismaAdapter(),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "your-fallback-secret-key",
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // If already on the signin page and trying to redirect there again, go to home
      if (url.includes("/auth/signin") && url.includes("callbackUrl")) {
        return baseUrl;
      }

      // Standard redirect logic
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      } else if (url.startsWith("http")) {
        return url;
      }
      return baseUrl;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) || "CUSTOMER"; // Default to CUSTOMER if no role
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;

        // Fetch user info from database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            role: true,
          },
        });

        token.role = dbUser?.role || "CUSTOMER";
      }
      return token;
    },
  },
  debug: process.env.NODE_ENV === "development",
};
