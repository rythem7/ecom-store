import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import Menu from "./menu";
import CategoryDrawer from "./category-drawer";
import Search from "./search";

const Header = async () => {
	return (
		<header className="w-full border-b">
			<div className="max-w-7xl lg:mx-auto p-5 md:px-10 w-full flex justify-between items-center">
				<div className="flex justify-start items-center">
					<CategoryDrawer />
					<Link
						href="/"
						className="flex justify-start items-center gap-4 ml-4"
					>
						<Image
							src="/images/logo.svg"
							alt={`${APP_NAME} logo`}
							width={48}
							height={48}
							priority
						/>
						<span className="hidden lg:block font-bold text-2xl">
							{APP_NAME}
						</span>
					</Link>
				</div>
				<div className="hidden md:block">
					<Search />
				</div>
				<Menu />
			</div>
		</header>
	);
};

export default Header;
