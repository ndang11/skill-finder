"use client";

import type { User } from "@supabase/supabase-js";
import {
	AlertTriangle,
	BarChart2,
	CheckCircle2,
	ClipboardList,
	Shield,
	Users,
	Wrench,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PostList from "@/components/feed/PostList";
import { Button } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { usePosts } from "@/hooks/usePosts";
import { supabase } from "@/utils/supabase/client";

export default function AdminDashboardPage() {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	const {
		posts,
		loading: postsLoading,
		error: postsError,
		fetchPosts,
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
			fetchPosts(); // Admins see all posts across the platform
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

	return (
		<div className="space-y-8">
			{/* Page Header */}
			<div>
				<h1 className="text-3xl font-black text-gray-900">Platform Overview</h1>
				<p className="mt-1 text-gray-500">
					Monitor users, professionals, and moderate all content activity.
				</p>
			</div>

			{/* Stats Row */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<Card className="p-5">
					<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
						Total Users
					</p>
					<p className="mt-1.5 text-3xl font-black text-gray-900">0</p>
				</Card>
				<Card className="p-5">
					<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
						Professionals
					</p>
					<p className="mt-1.5 text-3xl font-black text-gray-900">0</p>
				</Card>
				<Card className="p-5">
					<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
						Total Posts
					</p>
					<p className="mt-1.5 text-3xl font-black text-primary-600">
						{posts.length}
					</p>
				</Card>
				<Card className="p-5">
					<p className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
						Pending Reviews
					</p>
					<p className="mt-1.5 text-3xl font-black text-primary-600">0</p>
				</Card>
			</div>

			{/* Main Content: Feed + Sidebar */}
			<div className="grid gap-6 lg:grid-cols-[1fr_260px]">
				{/* Feed Column (with moderation) */}
				<div className="space-y-5">
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-black text-gray-900">
							All Platform Posts
						</h2>
						<span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
							<Shield className="h-3.5 w-3.5" /> Moderation View
						</span>
					</div>

					<PostList
						posts={posts}
						loading={postsLoading}
						error={postsError}
						currentUserId={user.id}
						currentUserName="Admin"
						currentUserRole="admin"
						onLike={handleLike}
						onAddComment={handleAddComment}
						onDelete={handleDeletePost}
						showDelete={true}
						emptyMessage="No posts on the platform yet."
					/>
				</div>

				{/* Admin Quick Actions Sidebar */}
				<div className="space-y-5">
					<Card className="p-5 space-y-3">
						<h3 className="text-sm font-black text-gray-900">Moderation</h3>
						<Button
							className="w-full text-sm h-10 flex items-center gap-2"
							onClick={() => router.push("/dashboard/admin/verifications")}
						>
							<CheckCircle2 className="h-4 w-4" /> Review Verifications
						</Button>
						<Button
							variant="secondary"
							className="w-full text-sm h-10 flex items-center gap-2"
							onClick={() => router.push("/dashboard/admin/posts")}
						>
							<ClipboardList className="h-4 w-4" /> All Posts
						</Button>
					</Card>

					<Card className="p-5 space-y-3">
						<h3 className="text-sm font-black text-gray-900">Management</h3>
						<Button
							variant="outline"
							className="w-full text-sm h-10 flex items-center gap-2"
							onClick={() => router.push("/dashboard/admin/users")}
						>
							<Users className="h-4 w-4" /> Manage Users
						</Button>
						<Button
							variant="outline"
							className="w-full text-sm h-10 flex items-center gap-2"
							onClick={() => router.push("/dashboard/admin/professionals")}
						>
							<Wrench className="h-4 w-4" /> Professionals
						</Button>
						<Button
							variant="outline"
							className="w-full text-sm h-10 flex items-center gap-2"
							onClick={() => router.push("/dashboard/admin/analytics")}
						>
							<BarChart2 className="h-4 w-4" /> View Analytics
						</Button>
					</Card>

					{/* Admin Info Card */}
					<Card className="p-5 bg-gradient-to-br from-orange-50 to-red-50 border-orange-100">
						<h3 className="text-sm font-black text-orange-900 mb-2 flex items-center gap-1.5">
							<AlertTriangle className="h-4 w-4" /> Moderation
						</h3>
						<p className="text-xs text-orange-700 leading-relaxed">
							Flagged or inappropriate posts can be removed using the delete
							icon on each post card above.
						</p>
					</Card>
				</div>
			</div>
		</div>
	);
}
