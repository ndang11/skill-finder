// app/dashboard/customer/page.tsx
"use client";

import type { User } from "@supabase/supabase-js";
import {
	ArrowRight,
	Bookmark,
	Heart,
	MessageCircle,
	Search,
	Sparkles,
	Star,
	TrendingUp,
	Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PostList from "@/components/feed/PostList";
import { Button } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { usePosts } from "@/hooks/usePosts";
import { supabase } from "@/utils/supabase/client";

const CATEGORIES = [
	"All",
	"Electrician",
	"Plumber",
	"Mechanic",
	"Carpenter",
	"Solar Installer",
	"AC Technician",
	"Hairdresser",
	"Tailor/Fashion Designer",
];

export default function CustomerDashboardPage() {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [activeCategory, setActiveCategory] = useState("All");

	const {
		posts,
		loading: postsLoading,
		error: postsError,
		fetchPosts,
		handleLike,
		handleAddComment,
	} = usePosts();

	useEffect(() => {
		supabase.auth.getUser().then(({ data }) => {
			setUser(data.user);
			setLoading(false);
		});
	}, []);

	useEffect(() => {
		if (!loading && !user) {
			router.push("/login");
		}
	}, [user, loading, router]);

	useEffect(() => {
		if (user) {
			fetchPosts(activeCategory === "All" ? undefined : activeCategory);
		}
	}, [user, activeCategory, fetchPosts]);

	if (loading) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
			</div>
		);
	}

	if (!user) {
		return null;
	}

	const displayName = user.user_metadata?.fullname?.split(" ")[0] || "Customer";
	const userInitial = (user.user_metadata?.fullname || user.email || "U")
		.charAt(0)
		.toUpperCase();

	return (
		<div className="space-y-6 sm:space-y-8 bg-gradient-to-br from-primary-50/50 via-white to-green-50/30 -mx-6 -mt-6 px-6 py-6 sm:-mx-8 sm:px-8 sm:py-8 lg:-mx-10 lg:px-10 lg:py-10 min-h-[calc(100vh-4rem)]">
			{/* Welcome Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<div className="relative h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-100 to-green-100 ring-2 ring-white shadow-md">
						{user.user_metadata?.avatar_url ? (
							<img
								src={user.user_metadata.avatar_url}
								alt={displayName}
								className="h-full w-full object-cover"
							/>
						) : (
							<div className="flex h-full w-full items-center justify-center text-xl sm:text-2xl font-black text-primary-700">
								{userInitial}
							</div>
						)}
					</div>
					<div>
						<h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
							Welcome back, {displayName}
						</h1>
						<p className="text-sm text-gray-500 mt-1">
							Discover trusted professionals and browse community updates.
						</p>
					</div>
				</div>
				<Button
					className="w-full sm:w-auto flex-shrink-0 h-10 px-5 text-sm font-semibold shadow-sm"
					onClick={() => router.push("/search")}
				>
					<Search className="h-4 w-4 mr-2" />
					Find Professionals
				</Button>
			</div>

			{/* Stats Grid */}
			<div className="grid gap-4 sm:gap-5 grid-cols-2 lg:grid-cols-4">
				{[
					{
						label: "Saved",
						value: "0",
						icon: Bookmark,
						color: "text-primary-600",
						bg: "bg-primary-50",
					},
					{
						label: "My Reviews",
						value: "0",
						icon: Star,
						color: "text-amber-600",
						bg: "bg-amber-50",
					},
					{
						label: "Bookmarks",
						value: "0",
						icon: Heart,
						color: "text-red-600",
						bg: "bg-red-50",
					},
					{
						label: "Feed Updates",
						value: posts.length,
						icon: MessageCircle,
						color: "text-primary-600",
						bg: "bg-primary-50",
					},
				].map((stat) => (
					<Card
						key={stat.label}
						className="p-4 sm:p-5 transition-all hover:shadow-md hover:border-gray-300"
					>
						<div className="flex items-center gap-3">
							<div
								className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}
							>
								<stat.icon className="h-5 w-5" />
							</div>
							<div>
								<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
									{stat.label}
								</p>
								<p className="text-xl sm:text-2xl font-black text-gray-900">
									{stat.value}
								</p>
							</div>
						</div>
					</Card>
				))}
			</div>

			{/* Main Content */}
			<div className="grid gap-6 lg:grid-cols-[1fr_280px]">
				{/* Feed Column */}
				<div className="space-y-5">
					{/* Feed Header */}
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
							<Sparkles className="h-5 w-5 text-primary-500" />
							Recent Updates
						</h2>
						<span className="text-xs text-gray-400">
							{posts.length} post{posts.length !== 1 ? "s" : ""}
						</span>
					</div>

					{/* Category Filter Chips */}
					<div className="flex gap-2 flex-wrap">
						{CATEGORIES.map((cat) => (
							<button
								key={cat}
								type="button"
								onClick={() => setActiveCategory(cat)}
								className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all ${
									activeCategory === cat
										? "bg-primary-500 text-white border-primary-500 shadow-sm shadow-primary-500/30"
										: "bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-600"
								}`}
							>
								{cat}
							</button>
						))}
					</div>

					{/* Feed */}
					<div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm">
						<PostList
							posts={posts}
							loading={postsLoading}
							error={postsError}
							currentUserId={user.id}
							currentUserName={
								user.user_metadata?.fullname || user.email || "Customer"
							}
							currentUserRole="customer"
							onLike={handleLike}
							onAddComment={handleAddComment}
							emptyMessage={
								activeCategory === "All"
									? "No updates yet from professionals."
									: `No recent updates from ${activeCategory} professionals.`
							}
						/>
					</div>
				</div>

				{/* Right Sidebar */}
				<div className="space-y-5 hidden lg:block">
					{/* Quick Actions */}
					<Card className="p-5 space-y-3">
						<h3 className="text-sm font-black text-gray-900">Quick Actions</h3>
						<Button
							className="w-full text-sm h-10"
							onClick={() => router.push("/search")}
						>
							<Search className="h-4 w-4 mr-2" />
							Find Professionals
						</Button>
						<Button
							variant="secondary"
							className="w-full text-sm h-10"
							onClick={() => router.push("/dashboard/customer/reviews")}
						>
							<Star className="h-4 w-4 mr-2" />
							Write a Review
						</Button>
						<Button
							variant="outline"
							className="w-full text-sm h-10"
							onClick={() => router.push("/dashboard/customer/bookmarks")}
						>
							<Bookmark className="h-4 w-4 mr-2" />
							My Bookmarks
						</Button>
					</Card>

					{/* Browse by Category */}
					<Card className="p-5">
						<h3 className="text-sm font-black text-gray-900 mb-3 flex items-center gap-2">
							<TrendingUp className="h-4 w-4 text-primary-500" />
							Browse by Category
						</h3>
						<div className="space-y-1">
							{CATEGORIES.slice(1).map((cat) => (
								<button
									key={cat}
									type="button"
									onClick={() => {
										setActiveCategory(cat);
										window.scrollTo({ top: 0, behavior: "smooth" });
									}}
									className={`w-full text-left text-xs font-medium px-3 py-2 rounded-xl transition-all flex items-center justify-between group ${
										activeCategory === cat
											? "bg-primary-50 text-primary-700 font-semibold"
											: "text-gray-600 hover:bg-gray-50"
									}`}
								>
									<span>{cat}</span>
									<ArrowRight
										className={`h-3 w-3 transition-transform ${activeCategory === cat ? "text-primary-500" : "text-gray-300 group-hover:text-gray-400"}`}
									/>
								</button>
							))}
						</div>
					</Card>

					{/* Tips Card */}
					<Card className="p-5 bg-gradient-to-br from-primary-50 to-green-50 border-primary-100 space-y-3">
						<h3 className="text-sm font-black text-primary-900 flex items-center gap-2">
							<Sparkles className="h-4 w-4" />
							Pro Tip
						</h3>
						<p className="text-xs text-primary-700 leading-relaxed">
							Use the category filters to discover professionals in your area.
							Bookmark trusted experts for future projects.
						</p>
					</Card>
				</div>
			</div>
		</div>
	);
}
