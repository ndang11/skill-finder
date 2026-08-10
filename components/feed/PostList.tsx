// components/feed/PostList.tsx
"use client";

import { Inbox } from "lucide-react";
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
	savedPostIds?: string[];
	onToggleSave?: (postId: string) => void;
}

export default function PostList({
	posts,
	loading,
	error,
	currentUserId,
	currentUserName,
	currentUserRole,
	onLike,
	onAddComment,
	onDelete,
	showDelete = false,
	emptyMessage = "No updates found.",
	savedPostIds = [],
	onToggleSave,
}: PostListProps) {
	if (loading) {
		return (
			<div className="space-y-6">
				<PostCardSkeleton />
				<PostCardSkeleton />
				<PostCardSkeleton />
			</div>
		);
	}

	if (error) {
		return (
			<div className="rounded-3xl border border-red-200 bg-red-50/50 p-8 text-center space-y-2">
				<p className="text-red-700 font-black text-sm">
					Failed to load community updates
				</p>
				<p className="text-red-500 text-xs font-medium">{error}</p>
			</div>
		);
	}

	if (posts.length === 0) {
		return (
			<div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center space-y-3">
				<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-xs">
					<Inbox className="h-7 w-7 text-emerald-600" />
				</div>
				<div className="space-y-1">
					<p className="text-slate-800 font-black text-sm">{emptyMessage}</p>
					<p className="text-slate-500 text-xs font-medium max-w-sm mx-auto">
						Check back soon for recent project showcases, tips, and service
						updates from verified providers.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
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
					isSaved={savedPostIds.includes(post.id)}
					onToggleSave={onToggleSave}
				/>
			))}
		</div>
	);
}
