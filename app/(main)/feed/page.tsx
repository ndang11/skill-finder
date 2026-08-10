"use client";

import type { User } from "@supabase/supabase-js";
import {
	ArrowUpDown,
	Bookmark,
	MapPin,
	Plus,
	Search,
	Sparkles,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import PostList from "@/components/feed/PostList";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/context/LanguageContext";
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

const CITIES = [
	"All Cities",
	"Douala",
	"Yaoundé",
	"Bamenda",
	"Buea",
	"Bafoussam",
	"Garoua",
	"Maroua",
	"Kribi",
	"Limbe",
];

export default function FeedPage() {
	const { t } = useTranslation();
	const [user, setUser] = useState<User | null>(null);
	const [userRole, setUserRole] = useState<
		"customer" | "professional" | "admin"
	>("customer");
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [selectedCity, setSelectedCity] = useState("All Cities");
	const [sortBy, setSortBy] = useState<"latest" | "likes" | "comments">(
		"latest",
	);
	const [activeTab, setActiveTab] = useState<"all" | "saved">("all");
	const [savedPostIds, setSavedPostIds] = useState<string[]>([]);

	const {
		posts,
		loading,
		error,
		fetchPosts,
		handleLike,
		handleAddComment,
		handleDeletePost,
	} = usePosts();

	useEffect(() => {
		supabase.auth.getUser().then(({ data }) => {
			if (data.user) {
				setUser(data.user);
				const role = data.user.user_metadata?.role || "customer";
				setUserRole(role);
			}
		});

		try {
			const saved = localStorage.getItem("sf_saved_posts");
			if (saved) {
				setSavedPostIds(JSON.parse(saved));
			}
		} catch (_e) {
			// fallback
		}

		fetchPosts();
	}, [fetchPosts]);

	const toggleSavePost = (postId: string) => {
		setSavedPostIds((prev) => {
			const updated = prev.includes(postId)
				? prev.filter((id) => id !== postId)
				: [...prev, postId];
			try {
				localStorage.setItem("sf_saved_posts", JSON.stringify(updated));
			} catch (_e) {
				// ignore
			}
			return updated;
		});
	};

	let filteredPosts = posts.filter((post) => {
		const matchesCategory =
			selectedCategory === "All" ||
			post.authorCategory?.toLowerCase() === selectedCategory.toLowerCase();

		const matchesCity =
			selectedCity === "All Cities" ||
			post.authorLocation?.toLowerCase().includes(selectedCity.toLowerCase());

		const matchesSearch =
			!searchQuery.trim() ||
			post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
			post.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			post.authorCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
			post.tags?.some((tag) =>
				tag.toLowerCase().includes(searchQuery.toLowerCase()),
			);

		const matchesTab = activeTab === "all" || savedPostIds.includes(post.id);

		return matchesCategory && matchesCity && matchesSearch && matchesTab;
	});

	// Apply Sorting
	filteredPosts = [...filteredPosts].sort((a, b) => {
		if (sortBy === "likes") {
			return b.likes.length - a.likes.length;
		}
		if (sortBy === "comments") {
			return b.comments.length - a.comments.length;
		}
		return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
	});

	return (
		<div className="min-h-screen bg-slate-50/50 py-8">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
				{/* Hero Header */}
				<div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-primary-950 to-emerald-950 text-white p-6 sm:p-10 shadow-xl shadow-slate-900/10">
					<div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
					<div className="absolute left-1/3 bottom-0 -mb-20 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

					<div className="relative z-10 space-y-4">
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
							<Sparkles className="h-3.5 w-3.5" />
							<span>Cameroon Service Community</span>
						</div>

						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
							<div className="space-y-1">
								<h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
									Activity Feed & Showcases
								</h1>
								<p className="text-sm text-slate-300 font-medium">
									Discover recent project showcases, professional tips, and
									announcements from verified Cameroon service providers.
								</p>
							</div>

							{userRole === "professional" && (
								<Link href="/dashboard/professional/posts/new">
									<Button className="h-11 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 rounded-xl flex items-center justify-center gap-2 whitespace-nowrap">
										<Plus className="h-4 w-4" />
										<span>Post Showcase</span>
									</Button>
								</Link>
							)}
						</div>

						{/* Search Bar */}
						<div className="relative max-w-xl pt-2">
							<Search className="absolute left-4 top-5 h-4.5 w-4.5 text-slate-400" />
							<input
								type="text"
								placeholder="Search feed by service, hashtag, or provider..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all font-medium"
							/>
						</div>
					</div>
				</div>

				{/* Navigation Tabs (All Feed vs Saved Posts) */}
				<div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3">
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => setActiveTab("all")}
							className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
								activeTab === "all"
									? "bg-slate-900 text-white shadow-md"
									: "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
							}`}
						>
							<TrendingUp className="h-3.5 w-3.5" />
							<span>All Community Feed</span>
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("saved")}
							className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
								activeTab === "saved"
									? "bg-amber-500 text-white shadow-md"
									: "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
							}`}
						>
							<Bookmark className="h-3.5 w-3.5" />
							<span>Saved Posts ({savedPostIds.length})</span>
						</button>
					</div>

					{/* Sorting Dropdown */}
					<div className="flex items-center gap-2">
						<div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs">
							<ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
							<select
								value={sortBy}
								onChange={(e) =>
									setSortBy(e.target.value as "latest" | "likes" | "comments")
								}
								className="bg-transparent focus:outline-none font-bold text-xs cursor-pointer"
							>
								<option value="latest">Latest Posts</option>
								<option value="likes">Most Liked 🔥</option>
								<option value="comments">Most Active 💬</option>
							</select>
						</div>
					</div>
				</div>

				{/* City & Category Filter Controls */}
				<div className="space-y-3">
					{/* City Filter Chips */}
					<div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
						<span className="text-xs font-black text-slate-400 flex items-center gap-1 flex-shrink-0 pr-1">
							<MapPin className="h-3.5 w-3.5 text-emerald-600" />
							Location:
						</span>
						{CITIES.map((city) => (
							<button
								key={city}
								type="button"
								onClick={() => setSelectedCity(city)}
								className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
									selectedCity === city
										? "bg-slate-800 text-white shadow-xs"
										: "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
								}`}
							>
								{city}
							</button>
						))}
					</div>

					{/* Category Filter Chips */}
					<div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
						{CATEGORIES.map((cat) => (
							<button
								key={cat}
								type="button"
								onClick={() => setSelectedCategory(cat)}
								className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
									selectedCategory === cat
										? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-105"
										: "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
								}`}
							>
								{cat === "All"
									? "🌟 All Services"
									: t(`categories.${cat}`) || cat}
							</button>
						))}
					</div>
				</div>

				{/* Feed Stream */}
				<div className="space-y-4">
					<div className="flex items-center justify-between px-1">
						<div className="flex items-center gap-2">
							<TrendingUp className="h-4 w-4 text-emerald-600" />
							<h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">
								{activeTab === "saved" ? "Saved Posts" : "Community Updates"}
							</h2>
						</div>
						<span className="text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
							{filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""}
						</span>
					</div>

					<div className="bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-6 shadow-sm">
						<PostList
							posts={filteredPosts}
							loading={loading}
							error={error}
							currentUserId={user?.id || "guest"}
							currentUserName={
								user?.user_metadata?.fullname || user?.email || "Guest"
							}
							currentUserRole={userRole}
							onLike={handleLike}
							onAddComment={handleAddComment}
							onDelete={handleDeletePost}
							showDelete={userRole === "admin"}
							savedPostIds={savedPostIds}
							onToggleSave={toggleSavePost}
							emptyMessage={
								activeTab === "saved"
									? "You haven't saved any posts yet. Click the bookmark icon on any post to save it here!"
									: searchQuery ||
											selectedCategory !== "All" ||
											selectedCity !== "All Cities"
										? "No posts matched your filter criteria."
										: "No updates posted yet."
							}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
