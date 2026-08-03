// components/feed/PostList.tsx
"use client";

import PostCard from "@/components/feed/PostCard";
import { PostCardSkeleton } from "@/components/ui/Skeleton";
import type { Post } from "@/types/post.types";

interface PostListProps {
	posts: Post[];
	loading: boolean;
	error?: string | null;
	currentUserId?: string;
	currentUserName?: string;
	currentUserRole?: "customer" | "professional" | "admin";
	onLike?: (postId: string, userId: string) => void;
	onAddComment?: (
		postId: string,
		content: string,
		authorId: string,
		authorName: string,
		authorRole: "customer" | "professional" | "admin",
	) => void;
	onDelete?: (postId: string) => void;
	showDelete?: boolean;
	emptyMessage?: string;
}

export default function PostList({
	posts,
	loading,
	error,
	currentUserId,
	currentUserName,
	currentUserRole,
	onLike,
	onDelete,
	showDelete = false,
	emptyMessage = "No updates found.",
}: PostListProps) {
	if (loading) {
		return (
			<div className="space-y-5">
				<PostCardSkeleton />
				<PostCardSkeleton />
				<PostCardSkeleton />
			</div>
		);
	}

	if (error) {
		return (
			<div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
				<p className="text-red-600 font-semibold text-sm">
					Failed to load posts
				</p>
				<p className="text-red-400 text-xs mt-1">{error}</p>
			</div>
		);
	}

	if (posts.length === 0) {
		return (
			<div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
				<p className="text-4xl mb-3">📭</p>
				<p className="text-gray-700 font-semibold text-sm">{emptyMessage}</p>
				<p className="text-gray-400 text-xs mt-1">
					Check back soon for new updates from professionals.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-5">
			{posts.map((post) => (
				<PostCard
					key={post.id}
					post={post}
					currentUserId={currentUserId}
					currentUserName={currentUserName}
					currentUserRole={currentUserRole}
					onLike={onLike}
					onAddComment={onAddComment}
					onDelete={onDelete}
					showDelete={showDelete}
				/>
			))}
		</div>
	);
}
