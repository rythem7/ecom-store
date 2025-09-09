import { Metadata } from "next";
import { getOrderById } from "@/lib/actions/order.actions";
import { notFound } from "next/navigation";
import { formatId } from "@/lib/utils";
import OrderDetailsTable from "./order-details-table";
import { Order } from "@/types";

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

	return (
		<div>
			<h1>Order Details</h1>
			<p>Order ID: {formatId(id)}</p>
			<OrderDetailsTable order={order} />
		</div>
	);
};

export default OrderDetailsPage;
