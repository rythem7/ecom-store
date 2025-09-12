import { requireAdmin } from "@/lib/auth-guard";

const ProductsCreatePage = async () => {
	await requireAdmin();
	return (
		<>
			<h1>Create Product</h1>
		</>
	);
};

export default ProductsCreatePage;
