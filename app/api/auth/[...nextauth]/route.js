import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  secret: "23423423556",
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    // ...add more providers here
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      return "/";
    },
  },
  page: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
});

export { handler as GET, handler as POST };
