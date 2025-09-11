"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { formatError, convertToPlainObject } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { getMyCart } from "./cart.actions";
import { GetCart, PaymentResult } from "@/types";
import { paypal } from "../paypal";
import { revalidatePath } from "next/cache";
import { getUserById } from "./user.actions";
import { insertOrderSchema } from "../validators";
import { PAGE_SIZE } from "../constants";

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

// Create new PayPal order
export async function createPayPalOrder(orderId: string) {
	try {
		// Get order from database
		const order = await prisma.order.findFirst({
			where: {
				id: orderId,
			},
		});
		if (order) {
			// Create a paypal order
			const paypalOrder = await paypal.createOrder(
				Number(order.totalPrice)
			);

			// Update the order with the paypal order id
			await prisma.order.update({
				where: {
					id: orderId,
				},
				data: {
					paymentResult: {
						id: paypalOrder.id,
						email_address: "",
						status: "",
						pricePaid: "0",
					},
				},
			});

			// Return the paypal order id
			return {
				success: true,
				message: "PayPal order created successfully",
				data: paypalOrder.id,
			};
		} else {
			throw new Error("Order not found");
		}
	} catch (err) {
		return { success: false, message: formatError(err) };
	}
}

// Approve paypal order and update order to paid
export async function approvePayPalOrder(
	orderId: string,
	data: { orderID: string }
) {
	try {
		const order = await prisma.order.findFirst({
			where: { id: orderId },
		});
		if (!order) throw new Error("Order not found");

		// Capture the payment
		const captureData = await paypal.capturePayment(data.orderID);
		if (
			!captureData ||
			captureData.id !== (order.paymentResult as PaymentResult)?.id ||
			captureData.status !== "COMPLETED"
		) {
			throw new Error("Payment not completed");
		}

		// Update order to paid
		// await updateOrderToPaid(orderId, {
		// 	id: captureData.id,
		// 	status: captureData.status,
		// 	email_address: captureData.payer.email_address,
		// 	pricePaid:
		// 		captureData.purchase_units[0]?.payments?.captures[0]?.amount
		// 			?.value,
		// });

		await updateOrderToPaid({
			orderId,
			paymentResult: {
				id: captureData.id,
				status: captureData.status,
				email_address: captureData.payer.email_address,
				pricePaid:
					captureData.purchase_units[0]?.payments?.captures[0]?.amount
						?.value,
			},
		});

		revalidatePath(`/order/${order.id}`);
		return { success: true, message: "Order paid successfully" };
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}

// Update order to paid
async function updateOrderToPaid({
	orderId,
	paymentResult,
}: {
	orderId: string;
	paymentResult?: PaymentResult;
}) {
	const order = await prisma.order.findFirst({
		where: { id: orderId },
		include: { orderitems: true },
	});
	if (!order) throw new Error("Order not found");
	if (order.isPaid) throw new Error("Order is already paid");

	// Transaction to update order and product stock
	await prisma.$transaction(async (tx) => {
		// Update product stock
		for (const item of order.orderitems) {
			await tx.product.update({
				where: { id: item.productId },
				data: { stock: { increment: -item.qty } },
			});
		}

		// Update order to paid
		await tx.order.update({
			where: { id: order.id },
			data: {
				isPaid: true,
				paidAt: new Date(),
				paymentResult,
			},
		});
	});

	// Get updated order after transaction
	const updatedOrder = await prisma.order.findFirst({
		where: { id: orderId },
		include: {
			orderitems: true,
			user: { select: { name: true, email: true } },
		},
	});
	if (!updatedOrder) throw new Error("Failed to fetch updated order");
}

// Get orders for a user
export async function getMyOrders({
	page,
	limit = PAGE_SIZE,
}: {
	page: number;
	limit?: number;
}) {
	const session = await auth();
	if (!session) throw new Error("User is not authenticated");
	const userId = session?.user?.id as string;
	if (!userId) throw new Error("User not found");

	// Fetch orders with pagination
	const orders = await prisma.order.findMany({
		where: { userId },
		skip: (page - 1) * limit,
		take: limit,
		orderBy: { createdAt: "desc" },
		include: { orderitems: true },
	});

	const totalOrders = await prisma.order.count({ where: { userId } });
	const totalPages = Math.ceil(totalOrders / limit);

	return {
		data: orders,
		totalPages,
	};
}
