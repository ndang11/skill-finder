// components/layout/DashboardSidebar.tsx
"use client";

import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/context/LanguageContext";
import { supabase } from "@/utils/supabase/client";

const navItemsPerRole: Record<
	string,
	Array<{ href: string; labelKey: string }>
> = {
	professional: [
		{ href: "/dashboard/professional", labelKey: "dashboardItems.overview" },
		{
			href: "/dashboard/professional/profile",
			labelKey: "dashboardItems.profile",
		},
		{
			href: "/dashboard/professional/portfolio",
			labelKey: "dashboardItems.portfolio",
		},
		{ href: "/dashboard/professional/posts", labelKey: "dashboardItems.posts" },
		{
			href: "/dashboard/professional/reviews",
			labelKey: "dashboardItems.reviews",
		},
		{
			href: "/dashboard/professional/settings",
			labelKey: "dashboardItems.settings",
		},
	],
	customer: [
		{ href: "/dashboard/customer", labelKey: "dashboardItems.overview" },
		{ href: "/search", labelKey: "dashboardItems.findProfessional" },
		{ href: "/dashboard/customer/profile", labelKey: "dashboardItems.profile" },
		{
			href: "/dashboard/customer/bookmarks",
			labelKey: "dashboardItems.bookmarks",
		},
		{
			href: "/dashboard/customer/reviews",
			labelKey: "dashboardItems.myReviews",
		},
		{
			href: "/dashboard/customer/settings",
			labelKey: "dashboardItems.settings",
		},
	],
	admin: [
		{ href: "/dashboard/admin", labelKey: "dashboardItems.overview" },
		{ href: "/dashboard/admin/users", labelKey: "dashboardItems.users" },
		{
			href: "/dashboard/admin/professionals",
			labelKey: "dashboardItems.professionals",
		},
		{ href: "/dashboard/admin/posts", labelKey: "dashboardItems.posts" },
		{
			href: "/dashboard/admin/categories",
			labelKey: "dashboardItems.categories",
		},
		{
			href: "/dashboard/admin/verifications",
			labelKey: "dashboardItems.verifications",
		},
		{
			href: "/dashboard/admin/analytics",
			labelKey: "dashboardItems.analytics",
		},
	],
};

export default function DashboardSidebar() {
	const pathname = usePathname();
	const router = useRouter();
	const { language, t } = useTranslation();
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		supabase.auth.getUser().then(({ data }) => {
			setUser(data.user);
		});
	}, []);

	const role = user?.user_metadata?.role || "customer";
	const navItems = navItemsPerRole[role] || navItemsPerRole.customer;
	const displayName = user?.user_metadata?.fullname || user?.email || "User";

	const handleLogout = async () => {
		await supabase.auth.signOut();
		router.push("/login");
	};

	const isActive = (href: string) => {
		if (
			href === "/dashboard/customer" ||
			href === "/dashboard/professional" ||
			href === "/dashboard/admin"
		) {
			return pathname === href;
		}
		return pathname === href || pathname.startsWith(`${href}/`);
	};

	return (
		<aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-gray-200 bg-white md:flex">
			<div className="flex h-full w-full flex-col">
				<div className="flex h-16 items-center gap-3 px-6 border-b border-gray-100">
					<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-400 to-green-600 text-lg font-black text-white shadow-md shadow-primary-500/20">
						S
					</div>
					<span className="text-lg font-black tracking-tight text-gray-900">
						Skill<span className="text-primary-500">Finder</span>
					</span>
				</div>

				<nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
					{navItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={[
								"flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
								isActive(item.href)
									? "bg-primary-50 text-primary-900"
									: "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
							].join(" ")}
						>
							<span>{t(item.labelKey as any)}</span>
						</Link>
					))}
				</nav>

				<div className="border-t border-gray-100 p-4 space-y-3">
					<div className="flex items-center gap-3 px-2">
						{user?.user_metadata?.avatar_url ? (
							<div className="flex h-9 w-9 flex-shrink-0 overflow-hidden rounded-full border border-gray-200 shadow-sm">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								{/* biome-ignore lint/performance/noImgElement: dynamic user avatar */}
								<img
									src={user.user_metadata.avatar_url}
									alt="Avatar"
									className="h-full w-full object-cover"
								/>
							</div>
						) : (
							<div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-bold text-sm">
								{displayName.charAt(0).toUpperCase()}
							</div>
						)}
						<div className="min-w-0">
							<p className="truncate text-sm font-semibold text-gray-900">
								{displayName}
							</p>
							<p className="truncate text-xs text-gray-500 capitalize">
								{role === "professional"
									? t("auth.roleProfessional")
									: t("auth.roleCustomer")}
							</p>
						</div>
					</div>
					<Button variant="outline" className="w-full" onClick={handleLogout}>
						{t("nav.logout")}
					</Button>
				</div>
			</div>
		</aside>
	);
}
