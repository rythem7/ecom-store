import { requireAdmin } from "@/lib/auth-guard";

const AdminUsersPage = async () => {
	await requireAdmin();
	return (
		<>
			<h1>Admin Users</h1>
		</>
	);
};

export default AdminUsersPage;
