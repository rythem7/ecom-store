// Import Zod for schema-based type inference
import * as z from "zod";
// Import the product validation schema
import {
	insertProductSchema,
	insertCartSchema,
	cartItemSchema,
} from "@/lib/validators";

/**
 * Product type definition
 *
 * We use z.infer<typeof insertProductSchema> to automatically generate
 * a TypeScript type from our Zod validation schema. This keeps our types
 * and validation rules in sync, so any change to the schema updates the type.
 *
 * The extra fields (id, rating, createdAt) are added here because they exist
 * in the database but are not part of the insert schema (which is for new products).
 */
export type Product = z.infer<typeof insertProductSchema> & {
	id: string; // Unique product ID from the database
	rating: string; // Product rating (stored as string)
	createdAt: Date; // Timestamp when product was created
};

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
