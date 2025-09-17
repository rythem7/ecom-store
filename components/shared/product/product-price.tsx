import { cn } from "@/lib/utils";
import { formatNumberToCurrency } from "@/lib/utils";

const ProductPrice = ({
	value,
	className,
}: {
	value: number;
	className?: string;
}) => {
	const price = formatNumberToCurrency(value);
	const [intValue, floatValue] = price.split(".");

	return (
		<p className={cn("text-2xl", className)}>
			{/* <span className="text-xs align-super">&#8377;</span> */}
			{intValue}
			<span className="text-xs align-super">.{floatValue}</span>
		</p>
	);
};

export default ProductPrice;
