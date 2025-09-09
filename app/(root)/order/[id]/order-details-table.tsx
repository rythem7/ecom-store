"use client";

import { Order } from "@/types";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import PlaceOrderForm from "../../place-order/place-order-form";

const OrderDetailsTable = ({ order }: { order: Order }) => {
	const {
		id,
		shippingAddress,
		orderitems,
		itemsPrice,
		shippingPrice,
		taxPrice,
		totalPrice,
		paymentMethod,
		isDelivered,
		isPaid,
		paidAt,
		deliveredAt,
	} = order;
	return (
		<>
			<h2 className="text-2xl py-4">Order {formatId(id)}</h2>
			<div className="grid md:grid-cols-3 gap-5">
				<div className="col-span-2 space-y-4 overflow-x-auto">
					<Card>
						<CardContent className="p-4 gap-4">
							<h2 className="text-xl pb-4">Payment Method</h2>
							<p className="mb-2">{paymentMethod}</p>
							{isPaid ? (
								<Badge variant={"secondary"}>
									Paid at {formatDateTime(paidAt!).dateTime}
								</Badge>
							) : (
								<Badge variant={"destructive"}>Not paid</Badge>
							)}
						</CardContent>
					</Card>
					<Card className="my-2">
						<CardContent className="p-4 gap-4">
							<h2 className="text-xl pb-4">Shipping Address</h2>
							<p>{shippingAddress.fullName}</p>
							<p>
								{shippingAddress.streetAddress},{" "}
								{shippingAddress.city}
							</p>
							<p className="mb-2">
								{shippingAddress.postalCode},{" "}
								{shippingAddress.country}
							</p>
							{isDelivered ? (
								<Badge variant={"secondary"}>
									Delivered at{" "}
									{formatDateTime(deliveredAt!).dateTime}
								</Badge>
							) : (
								<Badge variant={"destructive"}>
									Not delivered
								</Badge>
							)}
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4 gap-4">
							<h2 className="text-xl pb-4">Order Items</h2>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Item</TableHead>
										<TableHead>Quantity</TableHead>
										<TableHead className="text-right">
											Price
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{orderitems.map((item) => (
										<TableRow key={item.slug}>
											<TableCell>
												<Link
													href={`/product/${item.slug}`}
													className="hover:underline flex items-center gap-2"
												>
													<Image
														src={item.image}
														alt={item.name}
														width={50}
														height={50}
													/>
													{item.name}
												</Link>
											</TableCell>
											<TableCell>
												<span className="px-2">
													{item.qty}
												</span>
											</TableCell>
											<TableCell className="text-right">
												<span className="px-2">
													${item.price}
												</span>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</div>
				<div>
					<Card>
						<CardContent className="p-4 gap-4 space-y-4">
							<div className="flex justify-between">
								<div>Items</div>
								<div>{formatCurrency(itemsPrice)}</div>
							</div>
							<div className="flex justify-between">
								<div>Tax</div>
								<div>{formatCurrency(taxPrice)}</div>
							</div>
							<div className="flex justify-between">
								<div>Shipping</div>
								<div>{formatCurrency(shippingPrice)}</div>
							</div>
							<hr className="my-4 w-full" />
							<div className="flex justify-between">
								<div>Total</div>
								<div>{formatCurrency(totalPrice)}</div>
							</div>
							<PlaceOrderForm />
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	);
};

export default OrderDetailsTable;
