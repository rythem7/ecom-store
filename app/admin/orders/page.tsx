import { requireAdmin } from "@/lib/auth-guard";
import { auth } from "@/auth";
import { Metadata } from "next";
import { getAllOrders } from "@/lib/actions/order.actions";

export const metadata: Metadata = {
	title: "Admin Orders",
};

const AdminOrdersPage = async (props: {
	searchParams: Promise<{ page: string }>;
}) => {
	await requireAdmin();
	const { page = 1 } = await props.searchParams;
	const session = await auth();

	const { data, totalPages } = await getAllOrders({
		page: Number(page),
		limit: 2,
	});

	return (
		<>
			<h1>Admin Orders</h1>
		</>
	);
};

export default AdminOrdersPage;
