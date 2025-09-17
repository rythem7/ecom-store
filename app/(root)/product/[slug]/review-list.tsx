"use client";

import type { ReviewType } from "@/types";
import Link from "next/link";
import { useState } from "react";

const ReviewList = ({
	userId,
	productId,
	productSlug,
}: {
	userId: string;
	productId: string;
	productSlug: string;
}) => {
	const [reviews, setReviews] = useState<ReviewType[]>([]);
	return (
		<div className="space-y-4">
			{reviews.length === 0 && <p>No reviews yet.</p>}
			{userId ? (
				<>{/* REVIEW FORM HERE */}</>
			) : (
				<div>
					Please{" "}
					<Link href={`/sign-in?callbackUrl=/product/${productSlug}`}>
						sign in
					</Link>{" "}
					to leave a review.
				</div>
			)}
			<div className="flex flex-col gap-3">{/* REVIEWS HERE */}</div>
		</div>
	);
};

export default ReviewList;
