import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as z from "zod";
import { Prisma } from "./generated/prisma";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Capitalize first letter of a String
function capitalize(str = "") {
	if (typeof str !== "string" || str.length === 0) return "";
	return str.charAt(0).toUpperCase() + str.slice(1);
}

// Convert prisma object to regular JS Object
export function convertToPlainObject<T>(value: T): object {
	return JSON.parse(JSON.stringify(value));
}

// Format number with decimal places
export function formatNumberWithDecimal(num: number): string {
	// const [int, decimal] = num.toString().split(".");
	// return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;

	return num.toLocaleString("en-US", {
		style: "decimal",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

// Format errors

export function formatError<T>(error: T) {
	if (error instanceof z.ZodError) {
		// Handle Zod Error
		const flattened = z.flattenError(error);

		const fieldErrors = Object.keys(flattened.fieldErrors)
			.map((field: string) => {
				const messagesArr = (
					flattened.fieldErrors as Record<string, string[]>
				)[field];
				return Array.isArray(messagesArr) ? messagesArr.join(", ") : "";
			})
			.join(". ");

		return fieldErrors;
	} else if (error instanceof Prisma.PrismaClientKnownRequestError) {
		// Handle Prisma Error
		if (error.code === "P2002") {
			const string = `${error.meta?.target} already exists, Please Sign In`;
			return capitalize(string);
		}
	} else {
		// Handle other errors
		if (error instanceof Error) {
			return typeof error.message === "string"
				? error.message
				: JSON.stringify(error.message);
		}
	}
}

// For ZOD errors:
// import * as z from "zod";
// use z.flattenError() to retrieve a clean, shallow error object
// Type- { errors: string[], properties: { [key: string]: string[] } }

// {
//   formErrors: [ 'Unrecognized key: "extraKey"' ],
//   fieldErrors: {
//     username: [ 'Invalid input: expected string, received number' ],
//     favoriteNumbers: [ 'Invalid input: expected number, received string' ]
//   }
// }

export function round2(value: number | string) {
	return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}
