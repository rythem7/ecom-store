import { requireAdmin } from "@/lib/auth-guard";

const AdminSingleProductPage = async () => {
	await requireAdmin();
	return (
		<>
			<h1>Admin Product</h1>
		</>
	);
};

export default AdminSingleProductPage;
