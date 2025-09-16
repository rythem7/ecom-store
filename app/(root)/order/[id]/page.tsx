import { Metadata } from "next";
import { getOrderById } from "@/lib/actions/order.actions";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./order-details-table";
import { Order, ShippingAddress } from "@/types";
import { auth } from "@/auth";

export const metadata: Metadata = {
	title: "Order Details",
};

const OrderDetailsPage = async ({
	params,
}: {
	params: Promise<{ id: string }>;
}) => {
	const { id } = await params;

	const order = (await getOrderById(id)) as Order | null;

	if (!order) notFound();

	const session = await auth();

	return (
		<div>
			<h1>Order Details</h1>
			<OrderDetailsTable
				order={{
					...order,
					shippingAddress: order.shippingAddress as ShippingAddress,
				}}
				paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
				isAdmin={session?.user?.role === "admin" ? true : false}
			/>
		</div>
	);
};

export default OrderDetailsPage;
