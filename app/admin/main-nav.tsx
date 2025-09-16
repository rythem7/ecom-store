"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import React from "react";

const links = [
	{ href: "/admin/overview", title: "Overview" },
	{ href: "/admin/products", title: "Products" },
	{ href: "/admin/orders", title: "Orders" },
	{ href: "/admin/users", title: "Users" },
];

const MainNav = ({
	className,
	...props
}: React.HTMLAttributes<HTMLElement>) => {
	const pathname = usePathname();

	return (
		<nav
			className={cn(
				"flex items-center space-x-4 lg:space-x-6",
				className
			)}
			{...props}
		>
			{links.map((link) => {
				const isActive = link.href === pathname;
				return (
					<Link
						key={link.href}
						href={link.href}
						className={cn(
							"text-sm font-medium transition-colors hover:text-primary",
							isActive ? "text-primary" : "text-muted-foreground"
						)}
					>
						{link.title}
					</Link>
				);
			})}
		</nav>
	);
};

export default MainNav;
