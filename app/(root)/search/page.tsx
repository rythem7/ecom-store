import ProductCard from "@/components/shared/product/product-card";
import {
	getAllProducts,
	getAllCategories,
} from "@/lib/actions/product.actions";
import Link from "next/link";
import { PRICE_RANGES, RATINGS, SORT_OPTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/shared/pagination";

export async function generateMetadata({
	searchParams,
}: {
	searchParams: Promise<{
		q: string;
		category: string;
		price: string;
		rating: string;
	}>;
}) {
	const {
		q = "all",
		category = "all",
		price = "all",
		rating = "all",
	} = await searchParams;

	const isQuerySet = q && q !== "all" && q.trim() !== "";
	const isCategorySet =
		category && category !== "all" && category.trim() !== "";
	const isPriceSet = price && price !== "all" && price.trim() !== "";
	const isRatingSet = rating && rating !== "all" && rating.trim() !== "";

	if (!isQuerySet && !isCategorySet && !isPriceSet && !isRatingSet) {
		return {
			title: "Search Products",
		};
	}

	return {
		title: `Search ${isQuerySet ? `for "${q}"` : ""}${
			isCategorySet ? ` in "${category}"` : ""
		}${isPriceSet ? ` with price "${price}"` : ""}${
			isRatingSet ? ` with rating "${rating} & up"` : ""
		}`,
	};
}

const SearchPage = async (props: {
	searchParams: Promise<{
		q?: string;
		category?: string;
		price?: string;
		sort?: string;
		page?: string;
		rating?: string;
	}>;
}) => {
	const {
		q = "all",
		category = "all",
		price = "all",
		sort = "newest",
		page = "1",
		rating = "all",
	} = await props.searchParams;

	// Construct filter url
	const getFilterUrl = ({
		c,
		s,
		p,
		r,
		pg,
	}: {
		c?: string;
		s?: string;
		p?: string;
		r?: string;
		pg?: string;
	}) => {
		const params = { q, category, price, rating, sort, page };
		if (c) params.category = c;
		if (s) params.sort = s;
		if (p) params.price = p;
		if (r) params.rating = r;
		if (pg) params.page = pg;
		return `/search?` + new URLSearchParams(params).toString();
	};

	const products = await getAllProducts({
		query: q,
		category,
		price,
		rating,
		limit: 6,
		sort,
		page: Number(page),
	});

	const categories = await getAllCategories();
	return (
		<div className="grid md:grid-cols-5 md:gap-5 w-full">
			<div className="filter-links hidden md:block md:col-span-1">
				{/* Category Links */}
				<div className="text-xl mb-2 mt-3">Department</div>
				<div>
					<ul className="space-y-1">
						<li>
							<Link
								href={getFilterUrl({ c: "all" })}
								className={
									category === "all" || category === ""
										? "font-bold"
										: ""
								}
							>
								Any
							</Link>
						</li>
						{categories.map((x) => (
							<li key={x.category}>
								<Link
									href={getFilterUrl({ c: x.category })}
									className={
										x.category === category
											? "font-bold"
											: ""
									}
								>
									{x.category}
								</Link>
							</li>
						))}
					</ul>
				</div>
				{/* Price Links */}
				<div className="text-xl mb-2 mt-8">Price</div>
				<div>
					<ul className="space-y-1">
						<li>
							<Link
								href={getFilterUrl({ p: "all" })}
								className={price === "all" ? "font-bold" : ""}
							>
								Any
							</Link>
						</li>
						{PRICE_RANGES.map((p) => (
							<li key={p.value}>
								<Link
									href={getFilterUrl({ p: p.value })}
									className={
										p.value === price ? "font-bold" : ""
									}
								>
									{p.name}
								</Link>
							</li>
						))}
					</ul>
				</div>

				{/* Ratings Links */}
				<div className="text-xl mb-2 mt-8">Customer Ratings</div>
				<div>
					<ul className="space-y-1">
						<li>
							<Link
								href={getFilterUrl({ r: "all" })}
								className={rating === "all" ? "font-bold" : ""}
							>
								Any
							</Link>
						</li>
						{RATINGS.map((r) => (
							<li key={r}>
								<Link
									href={getFilterUrl({ r: r.toString() })}
									className={
										r.toString() === rating
											? "font-bold"
											: ""
									}
								>
									{r} Star{r > 1 ? "s" : ""} &amp; Up
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
			<div className="md:col-span-4 space-y-4">
				<div className="flex justify-between flex-col md:flex-row my-4">
					<div className="flex items-center">
						{q !== "all" && q !== "" && 'Query: "' + q + '"'}{" "}
						{category !== "all" &&
							category !== "" &&
							'Category: "' + category + '"'}{" "}
						{price !== "all" &&
							price !== "" &&
							'Price: "' + price + '"'}{" "}
						{rating !== "all" &&
							rating !== "" &&
							'Rating: "' + rating + ' & up"'}
						&nbsp;
						{(q !== "all" && q !== "") ||
						(category !== "all" && category !== "") ||
						(price !== "all" && price !== "") ||
						(rating !== "all" && rating !== "") ? (
							<Button variant="link" asChild>
								<Link href="/search">Clear Filters</Link>
							</Button>
						) : null}
					</div>
					<div className="max-w-md text-2xs mb-2 flex items-center gap-4">
						<div className="font-bold">Sort by:</div>
						<div className="grid grid-cols-2 gap-1">
							{SORT_OPTIONS.map((s) => (
								<Link
									key={s.value}
									href={getFilterUrl({ s: s.value })}
									className={`${
										s.value === sort && "font-bold"
									}`}
								>
									{s.name}
								</Link>
							))}
						</div>
					</div>
				</div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{products.data.length === 0 && <div>No Products Found</div>}
					{products.data.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
				{products.totalPages > 1 && (
					<Pagination page={page} totalPages={products.totalPages} />
				)}
			</div>
		</div>
	);
};

export default SearchPage;
