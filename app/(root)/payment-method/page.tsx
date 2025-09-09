import { Metadata } from "next";
import { auth } from "@/auth";
import { getUserById } from "@/lib/actions/user.actions";
import PaymentMethodForm from "./payment-method-form";
import CheckoutSteps from "@/components/shared/checkout-steps";

export const metadata: Metadata = {
	title: "Payment Method",
};
const PaymentMethodPage = async () => {
	const session = await auth();
	const userId = session?.user?.id as string;

	if (!userId) throw new Error("User not found");

	const user = await getUserById(userId);

	return (
		<div>
			<CheckoutSteps current={2} />
			<PaymentMethodForm
				preferredPaymentMethod={user.paymentMethod || undefined}
			/>
		</div>
	);
};

export default PaymentMethodPage;
