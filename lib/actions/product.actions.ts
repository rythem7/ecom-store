"use server";
import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";
import { prisma } from "@/db/prisma";
import { Product } from "@/types";

// Get latest products
export async function getLatestProducts() {
	const data = await prisma.product.findMany({
		take: LATEST_PRODUCTS_LIMIT,
		orderBy: { createdAt: "desc" },
	});

	// Ensure the return type is Product[]
	return convertToPlainObject(data) as Product[];
}

// Get a single product by slug
export async function getProductBySlug(slug: string) {
	return await prisma.product.findFirst({
		where: { slug },
	});
}
