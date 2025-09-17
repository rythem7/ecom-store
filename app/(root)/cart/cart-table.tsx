"use client";

import { Cart } from "@/types";
import { formatCurrency } from "@/lib/utils";
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
import { Card, CardContent } from "@/components/ui/card";
import { formatNumberToCurrency } from "@/lib/utils";
import {
	AddButton,
	RemoveButton,
	GoToCheckout,
} from "@/components/shared/product/add-to-cart";

const CartTable = ({ cart }: { cart?: Cart }) => {
	return (
		<>
			<h1 className="py-4 font-bold text-2xl lg:text-3xl">
				Shopping Cart
			</h1>
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
										<TableCell className="flex justify-center items-center gap-2">
											<RemoveButton
												productId={item.productId}
											/>
											<span>{item.qty}</span>
											<AddButton item={item} />
										</TableCell>
										<TableCell className="text-right">
											{formatNumberToCurrency(item.price)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
					<Card>
						<CardContent className="p-4 gap-4">
							<div className="pb-3 text-xl">
								Subtotal (
								{cart.items.reduce((a, c) => a + c.qty, 0)}):
								<span className="font-bold">
									{" "}
									{formatCurrency(cart.itemsPrice)}
								</span>
							</div>
							<GoToCheckout />
						</CardContent>
					</Card>
				</div>
			)}
		</>
	);
};

export default CartTable;
