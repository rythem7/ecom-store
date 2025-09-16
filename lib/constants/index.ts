export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Prostore";
export const APP_DESCRIPTION =
	process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
	"A modern store built with Next.js";
export const SERVER_URL =
	process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const LATEST_PRODUCTS_LIMIT =
	Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const signInDefaultValues = {
	email: "",
	password: "",
};

export const signUpDefaultValues = {
	name: "",
	email: "",
	password: "",
	confirmPassword: "",
};

export const shippingAddressDefaultValues = {
	fullName: "",
	streetAddress: "",
	city: "",
	postalCode: "",
	country: "",
};

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
	? process.env.PAYMENT_METHODS.split(", ")
	: ["PayPal", "Stripe", "CashOnDelivery"];

export const DEFAULT_PAYMENT_METHOD =
	process.env.DEFAULT_PAYMENT_METHOD || "PayPal";

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 12;

export const productDefaultValues = {
	name: "",
	slug: "",
	category: "",
	brand: "",
	description: "",
	stock: 0,
	rating: "0",
	images: [] as string[],
	isFeatured: false,
	banner: null,
	price: "0",
	numReviews: "0",
};

export const USER_ROLES = process.env.USER_ROLES
	? process.env.USER_ROLES.split(", ")
	: ["admin", "user"];

export const PRICE_RANGES = [
	{ name: "$1 to $50", value: "1-50" },
	{ name: "$51 to $100", value: "51-100" },
	{ name: "$101 to $200", value: "101-200" },
	{ name: "$201 to $500", value: "201-500" },
	{ name: "$501 to $1000", value: "501-1000" },
];

export const RATINGS = [1, 2, 3, 4];
export const SORT_OPTIONS = [
	{ name: "Newest Arrivals", value: "newest" },
	{ name: "Price: Low to High", value: "lowest" },
	{ name: "Price: High to Low", value: "highest" },
	{ name: "Avg. Customer Review", value: "rating" },
];
