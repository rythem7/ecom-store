import ProductList from "@/components/shared/product/product-list";
import ProductCarousel from "@/components/shared/product/product-carousel";
import {
	getLatestProducts,
	getFeaturedProducts,
} from "@/lib/actions/product.actions";

const HomePage = async () => {
	const latestProducts = await getLatestProducts();
	const featuredProducts = await getFeaturedProducts();
	return (
		<>
			{Array.isArray(featuredProducts) && featuredProducts.length > 0 && (
				<ProductCarousel data={featuredProducts} />
			)}
			<ProductList
				data={latestProducts}
				title="Newest Arrivals"
				limit={4}
			/>
		</>
	);
};

export default HomePage;
