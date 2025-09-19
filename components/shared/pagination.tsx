"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";

type PaginationProps = {
	page: number | string;
	totalPages: number;
	paramName?: string;
};

const Pagination = ({ page, totalPages }: PaginationProps) => {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();

	const handleClick = (btnType: string) => {
		const currentPage =
			btnType === "next" ? Number(page) + 1 : Number(page) - 1;

		const newSearchParams = new URLSearchParams(searchParams.toString());
		newSearchParams.set("page", currentPage.toString());

		const newPathname = `${pathname}?${newSearchParams.toString()}`;

		router.push(newPathname);

		// router.replace(`${pathname}?page=${currentPage}`);
	};

	return (
		<div className="flex items-center justify-between">
			<Button
				variant={"outline"}
				size={"lg"}
				className="w-28"
				disabled={Number(page) <= 1}
				onClick={() => handleClick("prev")}
			>
				Previous
			</Button>
			<span className="px-4 text-sm">
				Page {page} of {totalPages}
			</span>
			<Button
				variant={"outline"}
				size={"lg"}
				className="w-28"
				disabled={Number(page) >= totalPages}
				onClick={() => handleClick("next")}
			>
				Next
			</Button>
		</div>
	);
};

export default Pagination;
