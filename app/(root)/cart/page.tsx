import { Cart } from "@/types";
import CartTable from "./cart-table";
import { getMyCart } from "@/lib/actions/cart.actions";

export const metadata = {
	title: "Cart",
};

const CartPage = async () => {
	const cart = (await getMyCart()) as Cart | undefined;

	return (
		<>
			<CartTable cart={cart} />
		</>
	);
};

export default CartPage;
