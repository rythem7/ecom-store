import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { getAllCategories } from "@/lib/actions/product.actions";
import { SearchIcon } from "lucide-react";

const Search = async () => {
	const categories = await getAllCategories();
	return (
		<form action="/search" method="GET">
			<div className="flex w-full max-w-sm space-x-2 items-center">
				<Select name="category">
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="All" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all" key={"All"}>
							All
						</SelectItem>
						{categories.map((x) => (
							<SelectItem value={x.category} key={x.category}>
								{x.category}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Input
					name="q"
					type="text"
					className="md:w-[100px] lg:w-[300px]"
					placeholder="Search..."
				/>
				<Button type="submit">
					<SearchIcon />
				</Button>
			</div>
		</form>
	);
};

export default Search;
