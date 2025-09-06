"use client";

import { Button } from "@/components/ui/button";
import { Plus, Minus, Loader } from "lucide-react";
import { CartItem } from "@/types";
import { toast } from "sonner";
import { removeItemFromCart, addItemToCart } from "@/lib/actions/cart.actions";
import { useRouter } from "next/navigation";
import { Cart } from "@/types";
import { useTransition } from "react";

const AddToCartButton = ({ item, cart }: { item: CartItem; cart?: Cart }) => {
	const router = useRouter();

	const [isPending, startTransition] = useTransition();

	const handleAddToCart = async () => {
		startTransition(async () => {
			const res = await addItemToCart(item);

			if (!res.success) {
				toast.error(res.message);
				return;
			}

			toast.success(res.message, {
				action: {
					label: "Go To Cart",
					onClick: () => router.push("/cart"),
				},
				duration: 3000,
			});
			return;
		});
	};

	// const handleRemoveFromCart = async () => {
	// 	startTransition(async () => {
	// 		const res = await removeItemFromCart(item.productId);

	// 		if (!res.success) {
	// 			toast.error(res.message);
	// 			return;
	// 		}

	// 		toast.success(res.message, {
	// 			action: {
	// 				label: "Go To Cart",
	// 				onClick: () => router.push("/cart"),
	// 			},
	// 			duration: 3000,
	// 		});
	// 		return;
	// 	});
	// };

	// Check if item exists in cart
	const existingItem =
		cart && cart.items.find((x) => x.productId === item.productId);

	return existingItem ? (
		<div>
			<RemoveButton productId={item.productId} />
			<span className="px-2">{existingItem.qty}</span>
			<Button
				type="button"
				variant={"outline"}
				onClick={handleAddToCart}
				disabled={isPending}
			>
				{isPending ? (
					<Loader className="w-4 h-4 animate-spin" />
				) : (
					<Plus className="h-4 w-4" />
				)}
			</Button>
		</div>
	) : (
		<Button
			className="w-full cursor-pointer"
			type="button"
			onClick={handleAddToCart}
			disabled={isPending}
		>
			{isPending ? (
				<Loader className="w-4 h-4 animate-spin" />
			) : (
				<Plus className="h-4 w-4" />
			)}{" "}
			Add To Cart
		</Button>
	);
};

export default AddToCartButton;

export function AddButton({ item }: { item: CartItem }) {
	const [isPending, startTransition] = useTransition();

	const handleAddToCart = async () => {
		startTransition(async () => {
			const res = await addItemToCart(item);

			if (!res.success) {
				toast.error(res.message);
				return;
			}

			toast.success(res.message, { duration: 3000 });
			return;
		});
	};

	return (
		<Button
			type="button"
			variant={"outline"}
			onClick={handleAddToCart}
			disabled={isPending}
		>
			{isPending ? (
				<Loader className="w-4 h-4 animate-spin" />
			) : (
				<Plus className="w-4 h-4" />
			)}
		</Button>
	);
}

export function RemoveButton({ productId }: { productId: string }) {
	const [isPending, startTransition] = useTransition();

	const handleRemoveFromCart = async () => {
		startTransition(async () => {
			const res = await removeItemFromCart(productId);

			if (!res.success) {
				toast.error(res.message);
				return;
			}

			toast.success(res.message, { duration: 3000 });
			return;
		});
	};

	return (
		<Button
			type="button"
			variant={"outline"}
			onClick={handleRemoveFromCart}
			disabled={isPending}
		>
			{isPending ? (
				<Loader className="w-4 h-4 animate-spin" />
			) : (
				<Minus className="w-4 h-4" />
			)}
		</Button>
	);
}
