import * as z from "zod";
import { formatNumberWithDecimal } from "./utils";

const currency = z
	.string()
	.refine(
		(v) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(v))),
		"Price must have exactly two decimal places"
	);

// Schema for inserting Products
export const insertProductSchema = z.object({
	name: z.string().min(3, "Name must be atleast 3 characters"),
	slug: z.string().min(3, "Slug must be atleast 3 characters"),
	category: z.string().min(3, "Category must be atleast 3 characters"),
	brand: z.string().min(3, "Brand must be atleast 3 characters"),
	description: z.string().min(3, "Description must be atleast 3 characters"),
	stock: z.coerce.number(),
	images: z.array(z.string()).min(1, "Product must have atleast one image"),
	isFeatured: z.boolean(),
	banner: z.string().nullable(),
	price: currency,
});

export const signInFormSchema = z.object({
	email: z.email("Invalid Email Address"),
	password: z.string().min(6, "Password must be atleast 6 characters"),
});

export const signUpFormSchema = z
	.object({
		name: z.string().min(3, "Name must be at least 3 characters"),
		email: z.string().email("Invalid Email Address"),
		password: z.string().min(6, "Password must be atleast 6 characters"),
		confirmPassword: z
			.string()
			.min(6, "Confirm Password must be atleast 6 characters"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export const cartItemSchema = z.object({
	productId: z.string().min(1, "Product Id is required"),
	name: z.string().min(1, "Product Name is required"),
	slug: z.string().min(1, "Slug is required"),
	qty: z.number().int().nonnegative("Quantity must be a positive number"),
	image: z.string().min(1, "Image is required"),
	price: currency,
});

export const insertCartSchema = z.object({
	items: z.array(cartItemSchema),
	itemsPrice: currency,
	totalPrice: currency,
	shippingPrice: currency,
	taxPrice: currency,
	sessionCartId: z.string().min(1, "Session cart id is required"),
	userId: z.string().optional().nullable(),
});

// Schema for shipping address
export const shippingAddressSchema = z.object({
	fullName: z.string().min(3, "Name must be atleast 3 characters"),
	streetAddress: z.string().min(3, "Address must be atleast 3 characters"),
	city: z.string().min(3, "City must be atleast 3 characters"),
	postalCode: z.string().min(4, "Postal Code must be atleast 4 characters"),
	country: z.string().min(3, "Country Name must be atleast 3 characters"),
	lat: z.number().optional(),
	lng: z.number().optional(),
});
