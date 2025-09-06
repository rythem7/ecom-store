"use client";

import { Cart } from "@/types";
import { useRouter } from "next/router";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
	TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/types";
import {
	AddButton,
	RemoveButton,
} from "@/components/shared/product/add-to-cart";

const CartTable = ({ cart }: { cart?: Cart }) => {
	return (
		<>
			<h1 className="py-4 h2-bold">Shopping Cart</h1>
			{!cart || cart.items.length === 0 ? (
				<div>
					Cart is empty. <Link href={"/"}>Go Shopping</Link>
				</div>
			) : (
				<div className="grid md:grid-cols-4 md:gap-5">
					<div className="overflow-x-auto md:col-span-3">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Item</TableHead>
									<TableHead className="text-center">
										Quantity
									</TableHead>
									<TableHead className="text-right">
										Price
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{cart.items.map((item) => (
									<TableRow key={item.slug}>
										<TableCell>
											<Link
												href={`/product/${item.slug}`}
												className="flex items-center"
											>
												<Image
													src={item.image}
													alt={item.name}
													width={50}
													height={50}
												/>
												<span className="px-2">
													{item.name}
												</span>
											</Link>
										</TableCell>
										<TableCell className="flex-center gap-2">
											<RemoveButton
												productId={item.productId}
											/>
											<span>{item.qty}</span>
											<AddButton item={item} />
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
			)}
		</>
	);
};

export default CartTable;
