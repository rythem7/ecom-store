import {
	Card,
	CardContent,
	CardHeader,
	CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import ProductPrice from "./product-price";
import { Product } from "@/types";
import Rating from "./rating";

const ProductCard = ({ product }: { product: Product }) => {
	return (
		<Card className="w-full flex flex-col justify-between max-w-sm">
			<CardHeader className="p-0 h-2/3 items-center">
				<Link href={`/product/${product.slug}`}>
					<Image
						src={product.images[0]}
						alt={product.name}
						height={300}
						width={300}
						className="object-cover h-auto w-auto rounded-t-lg"
					/>
				</Link>
			</CardHeader>
			<CardContent className="p-4 grid gap-4">
				<div className="text-xs">{product.brand}</div>
				<Link href={`/product/${product.slug}`}>
					<h2 className="text-sm font-medium">{product.name}</h2>
				</Link>
				<div className="flex flex-wrap justify-between items-center gap-4">
					<Rating value={Number(product.rating)} />
					{product.stock > 0 ?
						<ProductPrice value={Number(product.price)} />
					:	<p className="text-destructive">Out Of Stock</p>}
				</div>
			</CardContent>
			<CardFooter></CardFooter>
		</Card>
	);
};

export default ProductCard;
