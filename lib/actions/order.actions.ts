"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { formatError, convertToPlainObject } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { getMyCart } from "./cart.actions";
import { GetCart } from "@/types";
import { getUserById } from "./user.actions";
import { insertOrderSchema } from "../validators";

// Create order and the order items
export async function createOrder() {
	try {
		const session = await auth();
		if (!session) throw new Error("User is not authenticated");

		const cart = (await getMyCart()) as GetCart | null;
		if (!cart || cart.items.length === 0) {
			return {
				success: false,
				message: "Your Cart is empty",
				redirectTo: "/cart",
			};
		}

		const userId = session?.user?.id as string;
		if (!userId) throw new Error("User not found");

		const user = await getUserById(userId);
		if (!user.address) {
			return {
				success: false,
				message: "Shipping address not found",
				redirectTo: "/shipping-address",
			};
		}
		if (!user.paymentMethod) {
			return {
				success: false,
				message: "Payment method not found",
				redirectTo: "/payment-method",
			};
		}

		// Create the order
		const order = insertOrderSchema.parse({
			userId: user.id,
			shippingAddress: user.address,
			paymentMethod: user.paymentMethod,
			itemsPrice: cart.itemsPrice,
			shippingPrice: cart.shippingPrice,
			taxPrice: cart.taxPrice,
			totalPrice: cart.totalPrice,
		});

		// Create a transaction to create order and order items in db
		const insertedOrderId = await prisma.$transaction(async (tx) => {
			const newOrder = await tx.order.create({ data: order });

			for (const item of cart.items) {
				await tx.orderItem.create({
					data: {
						...item,
						price: item.price, // Ensure price is a number
						orderId: newOrder.id,
					},
				});
			}

			// Clear the cart
			await tx.cart.update({
				where: { id: cart.id },
				data: {
					items: [],
					itemsPrice: 0,
					taxPrice: 0,
					totalPrice: 0,
					shippingPrice: 0,
				},
			});

			return newOrder.id;
		});

		console.log("Inserted Order ID:", insertedOrderId); // Debugging line to check inserted order ID

		if (!insertedOrderId) {
			throw new Error("Failed to create order");
		}

		return {
			success: true,
			message: "Order placed successfully",
			redirectTo: `/order/${insertedOrderId}`,
		};
	} catch (error) {
		if (isRedirectError(error)) throw error;
		return { success: false, message: formatError(error) };
	}
}

// Get order by ID
export async function getOrderById(orderId: string) {
	const order = await prisma.order.findFirst({
		where: { id: orderId },
		include: {
			orderitems: true,
			user: { select: { name: true, email: true } },
		},
	});

	if (!order) {
		return { success: false, message: "Order not found" };
	}

	return convertToPlainObject(order);
}
