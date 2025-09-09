"use client";

import { useFormStatus } from "react-dom";
import { createOrder } from "@/lib/actions/order.actions";
import { Check, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const PlaceOrderForm = () => {
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const res = await createOrder();

		if (res.redirectTo) {
			router.push(res.redirectTo);
		}
	};

	const PlaceOrderButton = () => {
		const { pending } = useFormStatus();
		return (
			<Button disabled={pending} className="w-full" variant={"default"}>
				{pending ? (
					<Loader className="w-4 h-4 animate-spin" />
				) : (
					<Check className="w-4 h-4" />
				)}{" "}
				Place Order
			</Button>
		);
	};
	return (
		<>
			<form className="w-full" onSubmit={handleSubmit}>
				<PlaceOrderButton />
			</form>
		</>
	);
};

export default PlaceOrderForm;
