/* eslint-disable @typescript-eslint/no-explicit-any */

import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

export const authConfig = {
	providers: [],
	callbacks: {
		authorized({ request, auth }: any) {
			// Check for session cart cookie
			if (!request.cookies.get("sessionCartId")) {
				// Generate new session cart id cookie
				const sessionCartId = crypto.randomUUID();

				// Clone the request headers
				const newReqHeaders = new Headers(request.headers);

				// Create new response and add the new headers
				const response = NextResponse.next({
					request: {
						headers: newReqHeaders,
					},
				});

				// Set newly generated sessionCartId in the response cookies
				response.cookies.set("sessionCartId", sessionCartId);

				return response;
			} else {
				return true;
			}
		},
	},
} satisfies NextAuthConfig;
