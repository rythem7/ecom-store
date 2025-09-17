import { cn } from "@/lib/utils";

const ProductPrice = ({
	value,
	className,
}: {
	value: number;
	className?: string;
}) => {
	const priceString = value.toFixed(2);
	const [intValue, floatValue] = priceString.split(".");

	return (
		<p className={cn("text-2xl", className)}>
			<span className="text-xs align-super">&#8377;</span>
			{intValue}
			<span className="text-xs align-super">.{floatValue}</span>
		</p>
	);
};

export default ProductPrice;
