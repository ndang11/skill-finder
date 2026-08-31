// app/dashboard/professional/posts/page.tsx
"use client";

import type { User } from "@supabase/supabase-js";
import {
	ArrowLeft,
	Calendar,
	Eye,
	FileText,
	Filter,
	Heart,
	MessageCircle,
	Search,
	TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PostList from "@/components/feed/PostList";
import { Button } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { usePosts } from "@/hooks/usePosts";
import { supabase } from "@/utils/supabase/client";

const POST_TYPES = [
	{ id: "all", label: "All Posts", icon: FileText },
	{ id: "showcase", label: "Showcase", icon: Eye },
	{ id: "tip", label: "Pro Tips", icon: TrendingUp },
	{ id: "availability", label: "Availability", icon: Calendar },
	{ id: "announcement", label: "Announcements", icon: Filter },
];

export default function ProfessionalPostsPage() {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [activeFilter, setActiveFilter] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");

	const {
		posts,
		loading: postsLoading,
		error: postsError,
		fetchPostsByAuthor,
		handleLike,
		handleAddComment,
		handleDeletePost,
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
			fetchPostsByAuthor(user.id);
		}
	}, [user, fetchPostsByAuthor]);

	const filteredPosts = posts.filter((post) => {
		const matchesType =
			activeFilter === "all" || post.postType === activeFilter;
		const matchesSearch =
			!searchQuery ||
			post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			post.content?.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesType && matchesSearch;
	});

	const stats = {
		total: posts.length,
		likes: posts.reduce((acc, p) => acc + p.likes.length, 0),
		comments: posts.reduce((acc, p) => acc + p.comments.length, 0),
		showcase: posts.filter((p) => p.postType === "showcase").length,
	};

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

	const displayName =
		user.user_metadata?.fullname?.split(" ")[0] || "Professional";

	return (
		<div className="space-y-6 sm:space-y-8 bg-gradient-to-br from-primary-50/50 via-white to-green-50/30 -mx-6 -mt-6 px-6 py-6 sm:-mx-8 sm:px-8 sm:py-8 lg:-mx-10 lg:px-10 lg:py-10 min-h-[calc(100vh-4rem)]">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<button
						type="button"
						onClick={() => router.back()}
						className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-all hover:border-gray-300 hover:text-gray-800 active:scale-95 shadow-sm"
						aria-label="Go back"
					>
						<ArrowLeft className="h-5 w-5" />
					</button>
					<div>
						<h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
							My Posts
						</h1>
						<p className="text-sm text-gray-500">
							Manage and track your published content, {displayName}.
						</p>
					</div>
				</div>
				<Button
					className="w-full sm:w-auto flex-shrink-0 h-10 px-5 text-sm font-semibold shadow-sm"
					onClick={() => router.push("/dashboard/professional/posts/new")}
				>
					<FileText className="h-4 w-4 mr-2" />
					Create New Post
				</Button>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
				{[
					{
						label: "Total Posts",
						value: stats.total,
						icon: FileText,
						color: "text-primary-600",
						bg: "bg-primary-50",
					},
					{
						label: "Total Likes",
						value: stats.likes,
						icon: Heart,
						color: "text-red-600",
						bg: "bg-red-50",
					},
					{
						label: "Comments",
						value: stats.comments,
						icon: MessageCircle,
						color: "text-blue-600",
						bg: "bg-blue-50",
					},
					{
						label: "Showcases",
						value: stats.showcase,
						icon: Eye,
						color: "text-amber-600",
						bg: "bg-amber-50",
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

			{/* Filters */}
			<Card className="p-4 sm:p-6 space-y-4">
				<div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
					<div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
						{POST_TYPES.map((type) => (
							<button
								key={type.id}
								type="button"
								onClick={() => setActiveFilter(type.id)}
								className={[
									"flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0",
									activeFilter === type.id
										? "bg-primary-500 text-white shadow-sm shadow-primary-500/20"
										: "bg-gray-100 text-gray-600 hover:bg-gray-200",
								].join(" ")}
							>
								<type.icon className="h-4 w-4" />
								{type.label}
							</button>
						))}
					</div>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
						<input
							type="text"
							placeholder="Search posts..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="h-10 w-full sm:w-64 rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100"
						/>
					</div>
				</div>
			</Card>

			{/* Posts */}
			<div>
				<div className="flex items-center justify-between mb-4">
					<p className="text-sm font-semibold text-gray-600">
						{filteredPosts.length}{" "}
						{filteredPosts.length === 1 ? "post" : "posts"} found
					</p>
					{activeFilter !== "all" && (
						<button
							type="button"
							onClick={() => setActiveFilter("all")}
							className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
						>
							Clear filters
						</button>
					)}
				</div>
				<PostList
					posts={filteredPosts}
					loading={postsLoading}
					error={postsError}
					currentUserId={user.id}
					currentUserName={
						user.user_metadata?.fullname || user.email || "Professional"
					}
					currentUserRole="professional"
					onLike={handleLike}
					onAddComment={handleAddComment}
					onDelete={handleDeletePost}
					showDelete={true}
					emptyMessage={
						searchQuery
							? "No posts match your search."
							: "You haven't published any posts yet."
					}
				/>
			</div>
		</div>
	);
}
