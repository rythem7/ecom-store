import NextAuth, { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt";

export const config: NextAuthConfig = {
	pages: {
		signIn: "/sign-in",
		error: "/sign-in",
	},
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	adapter: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
			credentials: {
				email: {
					label: "Email",
					type: "email",
				},
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (credentials == null) return null;

				// Find user in database
				const user = await prisma.user.findFirst({
					where: {
						email: credentials.email as string,
					},
				});

				// Check if user exists and if the password matches
				if (user && user.password) {
					const isMatch = compareSync(
						credentials.password as string,
						user.password
					);

					// If pass is correct, return user
					if (isMatch) {
						return {
							id: user.id,
							name: user.name,
							email: user.email,
							role: user.role,
						};
					}
				}

				// If user does not exist or if the password does not match return null
				return null;
			},
		}),
	],
	callbacks: {
		async session({ session, user, trigger, token }: any) {
			// Set the user ID from the token
			session.user.id = token.sub;

			// If there is an update, set the user name
			if (trigger === "update") {
				session.user.name = user.name;
			}

			return session;
		},
	},
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
