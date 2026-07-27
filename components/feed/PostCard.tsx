// components/feed/PostCard.tsx
"use client";

import * as React from "react";
import type { Post } from "@/types/post.types";
import { cn } from "@/utils/cn";

function timeAgo(dateString: string): string {
	const now = Date.now();
	const then = new Date(dateString).getTime();
	const diff = Math.floor((now - then) / 1000);
	if (diff < 60) return `${diff}s ago`;
	if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
	if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
	if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
	return new Date(dateString).toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
	});
}

function categoryEmoji(category: string): string {
	const map: Record<string, string> = {
		"Solar Installer": "☀️",
		Electrician: "⚡",
		Plumber: "🔧",
		Mechanic: "🔩",
		Carpenter: "🪵",
		"Mason/Bricklayer": "🏗️",
		Painter: "🎨",
		Welder: "🔥",
		Hairdresser: "💇",
		"Tailor/Fashion Designer": "👗",
		"AC Technician": "❄️",
		Other: "🛠️",
	};
	return map[category] || "🛠️";
}

interface PostCardProps {
	post: Post;
	currentUserId?: string;
	currentUserName?: string;
	currentUserRole?: "customer" | "professional" | "admin";
	onLike?: (postId: string, userId: string) => void;
	onDelete?: (postId: string) => void;
	showDelete?: boolean;
}

export default function PostCard({
	post,
	currentUserId = "guest",
	currentUserName = "Guest",
	currentUserRole = "customer",
	onLike,
	onDelete,
	showDelete = false,
}: PostCardProps) {
	const [showComments, setShowComments] = React.useState(false);
	const [commentInput, setCommentInput] = React.useState("");
	const [localComments, setLocalComments] = React.useState(post.comments);
	const [localLikes, setLocalLikes] = React.useState(post.likes);
	const [isLiking, setIsLiking] = React.useState(false);
	const [likeAnimating, setLikeAnimating] = React.useState(false);

	const isLiked = localLikes.includes(currentUserId);
	const avatarInitials = post.authorName
		.split(" ")
		.map((n) => n[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	const whatsAppLink = post.authorPhone
		? `https://wa.me/${post.authorPhone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${post.authorName}, I saw your post on Skill Finder and I'd like to enquire about your services.`)}`
		: null;

	const handleLike = async () => {
		if (isLiking || !onLike) return;
		setIsLiking(true);
		setLikeAnimating(true);
		const newLikes = isLiked
			? localLikes.filter((id) => id !== currentUserId)
			: [...localLikes, currentUserId];
		setLocalLikes(newLikes);
		await onLike(post.id, currentUserId);
		setIsLiking(false);
		setTimeout(() => setLikeAnimating(false), 300);
	};

	const handleComment = () => {
		if (!commentInput.trim()) return;
		const newComment = {
			id: `c-${Date.now()}`,
			postId: post.id,
			authorId: currentUserId,
			authorName: currentUserName,
			authorRole: currentUserRole,
			content: commentInput.trim(),
			createdAt: new Date().toISOString(),
		};
		setLocalComments((prev) => [...prev, newComment]);
		setCommentInput("");
	};

	return (
		<article className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
			{/* Card Header */}
			<div className="flex items-center justify-between px-5 pt-5 pb-3">
				<div className="flex items-center gap-3 min-w-0">
					{/* Avatar */}
					{post.authorAvatar ? (
						<div className="flex-shrink-0 w-11 h-11 rounded-full overflow-hidden border border-gray-200 shadow-sm">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							{/* biome-ignore lint/performance/noImgElement: dynamic author avatar */}
							<img
								src={post.authorAvatar}
								alt={post.authorName}
								className="w-full h-full object-cover"
							/>
						</div>
					) : (
						<div className="flex-shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-primary-400 to-green-600 flex items-center justify-center text-white text-sm font-black shadow-sm">
							{avatarInitials}
						</div>
					)}
					{/* Author Info */}
					<div className="min-w-0">
						<div className="flex items-center gap-1.5 flex-wrap">
							<p className="text-sm font-bold text-gray-900 leading-tight truncate">
								{post.authorName}
							</p>
							{/* Verified Badge */}
							<span
								className="inline-flex items-center justify-center p-0.5 rounded-full bg-primary-100 text-primary-700"
								title="Verified Professional"
							>
								<svg
									className="w-3.5 h-3.5"
									fill="currentColor"
									viewBox="0 0 20 20"
									aria-label="Verified"
									role="img"
								>
									<path
										fillRule="evenodd"
										d="M6.267 3.585a2.625 2.625 0 014.966 0l.071.217a.75.75 0 00.91.503l.218-.071a2.625 2.625 0 013.51 3.51l-.071.218a.75.75 0 00.503.91l.217.071a2.625 2.625 0 010 4.966l-.217.07a.75.75 0 00-.503.91l.071.218a2.625 2.625 0 01-3.51 3.51l-.218-.07a.75.75 0 00-.91.503l-.071.217a2.625 2.625 0 01-4.966 0l-.071-.217a.75.75 0 00-.91-.503l-.218.07a2.625 2.625 0 01-3.51-3.51l.071-.218a.75.75 0 00-.503-.91l-.217-.07a2.625 2.625 0 010-4.966l.217-.07a.75.75 0 00.503-.91l-.071-.218a2.625 2.625 0 013.51-3.51l.218.07a.75.75 0 00.91-.503l.071-.217zM10 12.75a2.75 2.75 0 100-5.5 2.75 2.75 0 000 5.5z"
										clipRule="evenodd"
									/>
								</svg>
							</span>
						</div>
						<p className="text-xs text-gray-500 truncate">
							{categoryEmoji(post.authorCategory)} {post.authorCategory}
							{post.authorLocation ? ` · ${post.authorLocation}` : ""}
						</p>
					</div>
				</div>
				{/* Right side: timestamp + optional delete */}
				<div className="flex items-center gap-2 flex-shrink-0">
					<span className="text-xs text-gray-400 font-medium whitespace-nowrap">
						{timeAgo(post.createdAt)}
					</span>
					{showDelete && onDelete && (
						<button
							type="button"
							onClick={() => onDelete(post.id)}
							className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
							title="Delete post"
						>
							<svg
								className="w-4 h-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={2}
								aria-label="Delete"
								role="img"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
								/>
							</svg>
						</button>
					)}
				</div>
			</div>

			{/* Post Body */}
			<div className="px-5 pb-3">
				<p className="text-sm text-gray-800 leading-relaxed">{post.content}</p>
			</div>

			{/* Post Image */}
			{post.imageUrl && (
				<div className="overflow-hidden w-full my-3 bg-gray-50/50 border-y border-gray-100 flex items-center justify-center">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					{/* biome-ignore lint/performance/noImgElement: Next.js <Image> requires pre-configuring arbitrary external domains for dynamic user uploads */}
					<img
						src={post.imageUrl}
						alt={`Work showcase by ${post.authorName}`}
						className="w-full max-h-[550px] object-cover transition-transform duration-300 hover:scale-[1.01]"
						loading="lazy"
					/>
				</div>
			)}

			{/* Action Bar */}
			<div className="px-5 pb-4 flex items-center gap-2">
				{/* Like Button */}
				<button
					type="button"
					onClick={handleLike}
					disabled={isLiking}
					className={cn(
						"flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all",
						isLiked
							? "bg-red-50 text-red-500 hover:bg-red-100"
							: "bg-gray-100 text-gray-600 hover:bg-gray-200",
						likeAnimating && "scale-110",
					)}
				>
					<svg
						className={cn(
							"w-4 h-4 transition-transform",
							likeAnimating && "scale-125",
						)}
						fill={isLiked ? "currentColor" : "none"}
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
						aria-label="Like"
						role="img"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
						/>
					</svg>
					{localLikes.length > 0 && <span>{localLikes.length}</span>}
					<span>{isLiked ? "Liked" : "Like"}</span>
				</button>

				{/* Comment Button */}
				<button
					type="button"
					onClick={() => setShowComments((v) => !v)}
					className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
				>
					<svg
						className="w-4 h-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
						aria-label="Comments"
						role="img"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
						/>
					</svg>
					{localComments.length > 0 && <span>{localComments.length}</span>}
					<span>Comment</span>
				</button>

				{/* WhatsApp CTA — only shown when professional has a phone number */}
				{whatsAppLink && (
					<a
						href={whatsAppLink}
						target="_blank"
						rel="noopener noreferrer"
						className="ml-auto flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba5a] active:scale-[0.98] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm shadow-green-500/20 transition-all"
					>
						<svg
							className="w-4 h-4 fill-current"
							viewBox="0 0 24 24"
							aria-label="WhatsApp"
							role="img"
						>
							<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
						</svg>
						Chat Now
					</a>
				)}
			</div>

			{/* Comments Section */}
			{showComments && (
				<div className="border-t border-gray-100 px-5 py-4 space-y-3 bg-gray-50/50">
					{localComments.length === 0 && (
						<p className="text-xs text-gray-400 text-center py-2">
							No comments yet. Be the first!
						</p>
					)}
					{localComments.map((comment) => (
						<div key={comment.id} className="flex gap-2.5 items-start">
							<div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">
								{comment.authorName.charAt(0).toUpperCase()}
							</div>
							<div className="bg-white border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-0">
								<p className="text-xs font-semibold text-gray-900">
									{comment.authorName}
								</p>
								<p className="text-xs text-gray-700 mt-0.5">
									{comment.content}
								</p>
							</div>
						</div>
					))}
					{/* Comment Input */}
					<div className="flex gap-2 items-center pt-1">
						<div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs font-bold">
							{currentUserName.charAt(0).toUpperCase()}
						</div>
						<div className="flex-1 flex gap-2">
							<input
								type="text"
								value={commentInput}
								onChange={(e) => setCommentInput(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && handleComment()}
								placeholder="Write a comment..."
								className="flex-1 text-xs bg-white border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
							/>
							<button
								type="button"
								onClick={handleComment}
								disabled={!commentInput.trim()}
								className="text-xs font-semibold px-3 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-40 disabled:pointer-events-none transition-all"
							>
								Post
							</button>
						</div>
					</div>
				</div>
			)}
		</article>
	);
}
