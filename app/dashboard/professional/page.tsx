"use client";

import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PostList from "@/components/feed/PostList";
import { Button } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { usePosts } from "@/hooks/usePosts";
import { supabase } from "@/utils/supabase/client";

export default function ProfessionalDashboardPage() {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	const {
		posts,
		loading: postsLoading,
		error: postsError,
		fetchPosts,
		handleLike,
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

	// Professionals see their own posts feed by default
	useEffect(() => {
		if (user) {
			// For now, show all posts (as own posts are mixed in by authorId)
			// When real DB is connected, use fetchPostsByAuthor(user.id)
			fetchPosts();
		}
	}, [user, fetchPosts]);

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
		<div className="space-y-8">
			{/* Page Header */}
			<div className="flex items-start justify-between gap-4">
				<div>
					<h1 className="text-3xl font-black text-gray-900">
						Welcome back, {displayName} 👋
					</h1>
					<p className="mt-1 text-gray-500">
						Manage your profile, showcase your work, and connect with customers.
					</p>
				</div>
				<Button
					className="flex-shrink-0 h-10 px-5 text-sm"
					onClick={() => router.push("/dashboard/professional/posts/new")}
				>
					+ New Post
				</Button>
			</div>

			{/* Stats Row */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<Card className="p-5">
					<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
						Profile Views
					</p>
					<p className="mt-1.5 text-3xl font-black text-gray-900">0</p>
				</Card>
				<Card className="p-5">
					<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
						Active Posts
					</p>
					<p className="mt-1.5 text-3xl font-black text-primary-600">
						{posts.length}
					</p>
				</Card>
				<Card className="p-5">
					<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
						Reviews
					</p>
					<p className="mt-1.5 text-3xl font-black text-gray-900">0</p>
				</Card>
				<Card className="p-5">
					<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
						Portfolio Items
					</p>
					<p className="mt-1.5 text-3xl font-black text-gray-900">0</p>
				</Card>
			</div>

			{/* Main Content: Feed + Sidebar */}
			<div className="grid gap-6 lg:grid-cols-[1fr_260px]">
				{/* Feed Column */}
				<div className="space-y-5">
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-black text-gray-900">
							Recent Platform Updates
						</h2>
						<span className="text-xs text-gray-400">
							{posts.length} post{posts.length !== 1 ? "s" : ""}
						</span>
					</div>

					<PostList
						posts={posts}
						loading={postsLoading}
						error={postsError}
						currentUserId={user.id}
						currentUserName={
							user.user_metadata?.fullname || user.email || "Professional"
						}
						currentUserRole="professional"
						onLike={handleLike}
						onDelete={handleDeletePost}
						showDelete={false}
						emptyMessage="No platform updates yet."
					/>
				</div>

				{/* Right Sidebar */}
				<div className="space-y-5">
					{/* Profile Actions */}
					<Card className="p-5 space-y-3">
						<h3 className="text-sm font-black text-gray-900">Profile</h3>
						<Button
							className="w-full text-sm h-10"
							onClick={() => router.push("/dashboard/professional/profile")}
						>
							✏️ Edit Profile
						</Button>
						<Button
							variant="secondary"
							className="w-full text-sm h-10"
							onClick={() => router.push("/dashboard/professional/portfolio")}
						>
							🖼️ Manage Portfolio
						</Button>
						<Button
							variant="outline"
							className="w-full text-sm h-10"
							onClick={() => router.push("/dashboard/professional/reviews")}
						>
							⭐ View Reviews
						</Button>
					</Card>

					{/* Tips Card */}
					<Card className="p-5 bg-gradient-to-br from-primary-50 to-green-50 border-primary-100">
						<h3 className="text-sm font-black text-primary-900 mb-2">
							💡 Pro Tip
						</h3>
						<p className="text-xs text-primary-700 leading-relaxed">
							Share regular posts with photos of your completed work to attract
							more customers and boost your profile views.
						</p>
					</Card>

					{/* Post Settings */}
					<Card className="p-5 space-y-3">
						<h3 className="text-sm font-black text-gray-900">Manage Posts</h3>
						<Button
							variant="secondary"
							className="w-full text-sm h-10"
							onClick={() => router.push("/dashboard/professional/posts")}
						>
							📋 All My Posts
						</Button>
						<Button
							variant="outline"
							className="w-full text-sm h-10"
							onClick={() => router.push("/dashboard/professional/posts/new")}
						>
							+ Create New Post
						</Button>
					</Card>
				</div>
			</div>
		</div>
	);
}
