"use client";

import type { User } from "@supabase/supabase-js";
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

	// Fetch posts on load and whenever category filter changes
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

	return (
		<div className="space-y-8">
			{/* Page Header */}
			<div>
				<h1 className="text-3xl font-black text-gray-900">
					Welcome back, {displayName} 👋
				</h1>
				<p className="mt-1 text-gray-500">
					Browse the latest updates from skilled professionals near you.
				</p>
			</div>

			{/* Stats Row */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<Card className="p-5">
					<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
						Saved
					</p>
					<p className="mt-1.5 text-3xl font-black text-gray-900">0</p>
				</Card>
				<Card className="p-5">
					<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
						My Reviews
					</p>
					<p className="mt-1.5 text-3xl font-black text-gray-900">0</p>
				</Card>
				<Card className="p-5">
					<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
						Bookmarks
					</p>
					<p className="mt-1.5 text-3xl font-black text-gray-900">0</p>
				</Card>
				<Card className="p-5">
					<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
						Feed Updates
					</p>
					<p className="mt-1.5 text-3xl font-black text-primary-600">
						{posts.length}
					</p>
				</Card>
			</div>

			{/* Main Content: Feed + Sidebar */}
			<div className="grid gap-6 lg:grid-cols-[1fr_280px]">
				{/* Feed Column */}
				<div className="space-y-5">
					{/* Feed Header */}
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-black text-gray-900">Recent Updates</h2>
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

				{/* Right Sidebar */}
				<div className="space-y-5">
					{/* Quick Actions */}
					<Card className="p-5 space-y-3">
						<h3 className="text-sm font-black text-gray-900">Quick Actions</h3>
						<Button
							className="w-full text-sm h-10"
							onClick={() => router.push("/search")}
						>
							🔍 Find Professionals
						</Button>
						<Button
							variant="secondary"
							className="w-full text-sm h-10"
							onClick={() => router.push("/dashboard/customer/reviews")}
						>
							⭐ Write a Review
						</Button>
						<Button
							variant="outline"
							className="w-full text-sm h-10"
							onClick={() => router.push("/dashboard/customer/bookmarks")}
						>
							🔖 My Bookmarks
						</Button>
					</Card>

					{/* Browse by Category */}
					<Card className="p-5">
						<h3 className="text-sm font-black text-gray-900 mb-3">
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
									className={`w-full text-left text-xs font-medium px-3 py-2 rounded-xl transition-all ${
										activeCategory === cat
											? "bg-primary-50 text-primary-700 font-semibold"
											: "text-gray-600 hover:bg-gray-50"
									}`}
								>
									{cat}
								</button>
							))}
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
