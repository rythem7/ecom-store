"use server";
import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { prisma } from "@/db/prisma";
import { Product } from "@/types";
import { formatError } from "../utils";
import { revalidatePath } from "next/cache";
import { insertProductSchema, updateProductSchema } from "../validators";
import * as z from "zod";
import { Prisma } from "../generated/prisma";

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

// Get a single product by id
export async function getProductById(id: string) {
	const data = await prisma.product.findFirst({
		where: { id },
	});
	return convertToPlainObject(data) as Product;
}

// Get all products (for admin)
export async function getAllProducts({
	query,
	limit = PAGE_SIZE,
	page,
	category,
}: {
	query?: string;
	limit?: number;
	page: number;
	category?: string;
}) {
	const queryFilter: Prisma.ProductWhereInput =
		query && query !== "all"
			? {
					name: {
						contains: query,
						mode: "insensitive",
					} as Prisma.StringFilter,
			  }
			: {};

	const data = await prisma.product.findMany({
		where: { ...queryFilter },
		skip: (page - 1) * limit,
		take: limit,
		orderBy: { createdAt: "desc" },
	});
	const totalItems = await prisma.product.count();

	return {
		products: convertToPlainObject(data) as Product[],
		totalPages: Math.ceil(totalItems / limit),
	};
}

// Create a new product
// export async function createProduct(productData: {
// 	name: string;
// 	slug: string;
// 	description: string;
// 	price: number;
// 	countInStock: number;
// 	image: string;
// }) {
// 	const newProduct = await prisma.product.create({
// 		data: productData,
// 	});

// 	return convertToPlainObject(newProduct) as Product;
// }

// Update an existing product
// export async function updateProduct(
// 	id: string,
// 	updateData: {
// 		name?: string;
// 		slug?: string;
// 		description?: string;
// 		price?: number;
// 		countInStock?: number;
// 		image?: string;
// 	}
// ) {
// 	const updatedProduct = await prisma.product.update({
// 		where: { id },
// 		data: updateData,
// 	});

// 	return convertToPlainObject(updatedProduct) as Product;
// }

// Delete a product
export async function deleteProduct(id: string) {
	try {
		const product = await prisma.product.findFirst({ where: { id } });
		if (!product) throw new Error("Product not found");

		await prisma.product.delete({
			where: { id },
		});

		revalidatePath("/admin/products");
		return { success: true, message: "Product deleted successfully." };
	} catch (error) {
		return { success: false, message: formatError(error) as string };
	}
}

// Create a product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
	try {
		const product = insertProductSchema.parse(data);

		await prisma.product.create({ data: product });
		revalidatePath("/admin/products");

		return { success: true, message: "Product created successfully." };
	} catch (error) {
		return { success: false, message: formatError(error) as string };
	}
}

// Update a product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
	try {
		const product = updateProductSchema.parse(data);
		const productExists = await prisma.product.findFirst({
			where: { id: product.id },
		});
		if (!productExists) throw new Error("Product not found");

		await prisma.product.update({
			where: { id: product.id },
			data: product,
		});
		revalidatePath("/admin/products");

		return { success: true, message: "Product updated successfully." };
	} catch (error) {
		return { success: false, message: formatError(error) as string };
	}
}

// Get all categories
export async function getAllCategories() {
	const data = await prisma.product.groupBy({
		by: ["category"],
		_count: true,
	});
	return data;
}

// Get featured products
export async function getFeaturedProducts() {
	const featured = await prisma.product.findMany({
		where: { isFeatured: true },
		take: 4,
		orderBy: { createdAt: "desc" },
	});

	return convertToPlainObject(featured);
}
