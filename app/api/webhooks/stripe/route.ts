import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updateOrderToPaid } from "@/lib/actions/order.actions";

export async function POST(req: NextRequest) {
	const body = await req.text();
	const event = Stripe.webhooks.constructEvent(
		body,
		req.headers.get("Stripe-Signature") as string,
		process.env.STRIPE_WEBHOOK_SECRET as string
	);

	if (event.type === "charge.succeeded") {
		const { object } = event.data;

		// Fulfill the purchase...
		await updateOrderToPaid({
			orderId: object.metadata.orderId,
			paymentResult: {
				id: object.id,
				status: "COMPLETED",
				email_address: object.billing_details.email!,
				pricePaid: (object.amount / 100).toFixed(),
			},
		});

		return NextResponse.json({
			message: "updateOrderToPaid was successful",
		});
	}

	return NextResponse.json({
		message: "event is not charge.succeeded",
	});
}
