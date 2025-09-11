"use server";

import {
	signInFormSchema,
	signUpFormSchema,
	paymentMethodSchema,
} from "../validators";
import { auth, signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt";
import { prisma } from "@/db/prisma";
import { formatError } from "../utils";
import { ShippingAddress } from "@/types";
import * as z from "zod";

// Define PaymentMethod
type PaymentMethod = z.infer<typeof paymentMethodSchema>;

// Sign in the user with credentials
export async function signInWithCredentials(
	prevState: unknown,
	formData: FormData
) {
	try {
		const user = signInFormSchema.parse({
			email: formData.get("email"),
			password: formData.get("password"),
		});

		await signIn("credentials", user);

		return { success: true, message: "Signed in successfully" };
	} catch (error) {
		if (isRedirectError(error)) {
			throw error;
		}

		return { success: false, message: "Invalid email or password" };
	}
}

// Sign user out
export async function signOutUser() {
	await signOut();
}

// Sign up user
export async function signUpUser(prevState: unknown, formData: FormData) {
	try {
		const user = signUpFormSchema.parse({
			name: formData.get("name"),
			email: formData.get("email"),
			password: formData.get("password"),
			confirmPassword: formData.get("confirmPassword"),
		});

		const plainPassword = user.password;
		user.password = hashSync(user.password, 10);

		await prisma.user.create({
			data: {
				name: user.name,
				email: user.email,
				password: user.password,
			},
		});

		await signIn("credentials", {
			email: user.email,
			password: plainPassword,
		});

		return { success: true, message: "User registered successfully" };
	} catch (error) {
		if (isRedirectError(error)) {
			throw error;
		}

		return { success: false, message: formatError(error) };
	}
}

// Get user by the ID
export async function getUserById(userId: string) {
	const user = await prisma.user.findFirst({
		where: { id: userId },
	});
	if (!user) throw new Error("User Not Found");
	return user;
}

// Update user's shipping address
export async function updateUserAddress(address: ShippingAddress) {
	try {
		const session = await auth();
		const currentUser = await prisma.user.findFirst({
			where: { id: session?.user?.id as string },
		});
		if (!currentUser) throw new Error("User not found");

		await prisma.user.update({
			where: { id: currentUser.id },
			data: { address },
		});
		return { success: true, message: "Address updated successfully" };
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}

// Update user's payment method
export async function updateUserPaymentMethod(data: PaymentMethod) {
	try {
		const paymentMethod = paymentMethodSchema.parse(data).type;
		const session = await auth();
		const currentUser = await prisma.user.findFirst({
			where: { id: session?.user?.id as string },
		});
		if (!currentUser) throw new Error("User not found");

		await prisma.user.update({
			where: { id: currentUser.id },
			data: { paymentMethod },
		});
		return {
			success: true,
			message: "Payment method updated successfully",
		};
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}

// Update user profile
export async function updateUserProfile(data: {
	name: string;
	email?: string;
}) {
	try {
		const session = await auth();
		const userId = session?.user?.id as string;
		const currentUser = await prisma.user.findFirst({
			where: { id: userId },
		});
		if (!currentUser) throw new Error("User not found");

		await prisma.user.update({
			where: { id: currentUser.id },
			data: { name: data.name },
		});
		return {
			success: true,
			message: "Profile updated successfully",
		};
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}
