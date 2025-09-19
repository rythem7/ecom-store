import sampleData from "@/db/sample-data";
import { formatNumberToCurrency } from "@/lib/utils";
import { Order } from "@/types";
import "dotenv/config";

import {
	Body,
	Column,
	Container,
	Head,
	Heading,
	Html,
	Img,
	Preview,
	Row,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";

interface OrderInformationProps {
	order: Order;
}

const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

EmailTemplate.PreviewProps = {
	order: {
		id: crypto.randomUUID(),
		userId: "123",
		user: {
			name: "Raghav",
			email: "user@example.com",
		},
		paymentMethod: "Stripe",
		shippingAddress: {
			fullName: "Raghav",
			streetAddress: "123 Main St",
			city: "New York",
			postalCode: "10001",
			country: "USA",
		},
		createdAt: new Date(),
		totalPrice: "100",
		itemsPrice: "80",
		shippingPrice: "10",
		orderitems: sampleData.products.map((x) => ({
			name: x.name,
			orderId: "123",
			productId: "123",
			slug: x.slug,
			qty: x.stock,
			price: x.price.toString(),
			image: x.images[0],
		})),
		taxPrice: "10",
		isPaid: true,
		paidAt: new Date(),
		isDelivered: true,
		deliveredAt: new Date(),
		paymentResult: {
			id: "123",
			status: "succeeded",
			pricePaid: "100",
			email_address: "user@example.com",
		},
	},
} satisfies OrderInformationProps;

export default function EmailTemplate({ order }: OrderInformationProps) {
	return (
		<Html>
			<Preview>View Order Receipt</Preview>
			<Tailwind>
				<Head />
				<Body className="font-sans bg-white">
					<Container className="max-w-xl">
						<Heading>Purchase Receipt</Heading>
						<Section>
							<Row>
								<Column>
									<Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap">
										Order ID:
									</Text>
									<Text className="mt-0 mr-4">
										{order.id.toString()}
									</Text>
								</Column>
								<Column>
									<Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap">
										Purchase Date:
									</Text>
									<Text className="mt-0 mr-4">
										{dateFormatter.format(order.createdAt)}
									</Text>
								</Column>
								<Column>
									<Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap">
										Price Paid:
									</Text>
									<Text className="mt-0 mr-4">
										{formatNumberToCurrency(
											order.totalPrice
										)}
									</Text>
								</Column>
							</Row>
						</Section>
						<Section className="border border-solid border-gray-500 rounded-lg p-4 md:p-6 my-4">
							{order.orderitems.map((item) => (
								<Row key={item.productId} className="mt-8">
									<Column className="w-20">
										<Img
											width={80}
											src={
												item.image.startsWith("/") ?
													`${process.env.NEXT_PUBLIC_SERVER_URL}${item.image}`
												:	item.image
											}
											alt={item.name}
											className="h-auto rounded"
										/>
									</Column>
									<Column className="align-top">
										{item.name} x {item.qty}
									</Column>
									<Column align="right" className="align-top">
										{formatNumberToCurrency(item.price)}
									</Column>
								</Row>
							))}
							{/* Prices Summary */}
							{[
								{ name: "Items", price: order.itemsPrice },
								{ name: "Tax", price: order.taxPrice },
								{
									name: "Shipping",
									price: order.shippingPrice,
								},
								{ name: "Total", price: order.totalPrice },
							].map(({ name, price }) => (
								<Row key={name} className="py-1">
									<Column align="right">
										<Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap">
											{name}:
										</Text>
									</Column>
									<Column
										align="right"
										className="align-top"
										width={70}
									>
										<Text className="m-0">
											{formatNumberToCurrency(price)}
										</Text>
									</Column>
								</Row>
							))}
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
