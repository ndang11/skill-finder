// components/feed/PostCard.tsx
"use client";

import {
	Bookmark,
	Check,
	MapPin,
	MessageSquare,
	Share2,
	Star,
	Tag,
	Trash2,
	Wrench,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { CATEGORY_ICONS } from "@/constants/categories";
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

const POST_TYPE_CONFIG: Record<
	string,
	{ label: string; bg: string; text: string; border: string; icon: string }
> = {
	showcase: {
		label: "Portfolio Showcase",
		bg: "bg-emerald-50",
		text: "text-emerald-700",
		border: "border-emerald-200",
		icon: "🖼️",
	},
	tip: {
		label: "Pro Tip",
		bg: "bg-amber-50",
		text: "text-amber-700",
		border: "border-amber-200",
		icon: "💡",
	},
	availability: {
		label: "Available Now",
		bg: "bg-indigo-50",
		text: "text-indigo-700",
		border: "border-indigo-200",
		icon: "⚡",
	},
	announcement: {
		label: "Notice",
		bg: "bg-blue-50",
		text: "text-blue-700",
		border: "border-blue-200",
		icon: "📢",
	},
	offer: {
		label: "Special Offer",
		bg: "bg-rose-50",
		text: "text-rose-700",
		border: "border-rose-200",
		icon: "🎁",
	},
};

interface PostCardProps {
	post: Post;
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
	isSaved?: boolean;
	onToggleSave?: (postId: string) => void;
}

export default function PostCard({
	post,
	currentUserId = "guest",
	currentUserName = "Guest",
	currentUserRole = "customer",
	onLike,
	onAddComment,
	onDelete,
	showDelete = false,
	isSaved = false,
	onToggleSave,
}: PostCardProps) {
	const [showComments, setShowComments] = React.useState(false);
	const [commentInput, setCommentInput] = React.useState("");
	const [localComments, _setLocalComments] = React.useState(post.comments);
	const [localLikes, setLocalLikes] = React.useState(post.likes);
	const [isLiking, setIsLiking] = React.useState(false);
	const [likeAnimating, setLikeAnimating] = React.useState(false);
	const [copied, setCopied] = React.useState(false);
	const [savedLocal, setSavedLocal] = React.useState(isSaved);

	const isLiked = localLikes.includes(currentUserId);
	const avatarInitials = post.authorName
		.split(" ")
		.map((n) => n[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	const typeConfig =
		POST_TYPE_CONFIG[post.postType?.toLowerCase()] || POST_TYPE_CONFIG.showcase;

	const whatsAppLink = post.authorPhone
		? `https://wa.me/${post.authorPhone.replace(/\D/g, "")}?text=${encodeURIComponent(
				`Hello ${post.authorName}, I saw your post "${post.title || "showcase"}" on Skill Finder and I'd like to enquire about your services.`,
			)}`
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

	const handleComment = async () => {
		if (!commentInput.trim() || !onAddComment) return;
		try {
			await onAddComment(
				post.id,
				commentInput.trim(),
				currentUserId,
				currentUserName,
				currentUserRole,
			);
			setCommentInput("");
		} catch (err) {
			console.error("Failed to post comment:", err);
		}
	};

	const handleShare = async () => {
		const postUrl = `${window.location.origin}/feed/${post.id}`;
		if (navigator.share) {
			try {
				await navigator.share({
					title: post.title || `Post by ${post.authorName}`,
					text: post.content.slice(0, 100),
					url: postUrl,
				});
				return;
			} catch (_err) {
				// Fallback to copy clipboard if share dismissed
			}
		}
		try {
			await navigator.clipboard.writeText(postUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 2500);
		} catch (err) {
			console.error("Failed to copy link:", err);
		}
	};

	const handleSaveClick = () => {
		setSavedLocal((prev) => !prev);
		if (onToggleSave) {
			onToggleSave(post.id);
		}
	};

	return (
		<article className="rounded-3xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative">
			{/* Copy Toast Alert */}
			{copied && (
				<div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-slate-900 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-bounce">
					<Check className="h-3.5 w-3.5 text-emerald-400" />
					<span>Post link copied to clipboard!</span>
				</div>
			)}

			{/* Card Top Header Pill */}
			<div className="px-5 pt-4 flex items-center justify-between border-b border-slate-100/60 pb-2.5">
				<span
					className={cn(
						"inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border",
						typeConfig.bg,
						typeConfig.text,
						typeConfig.border,
					)}
				>
					<span>{typeConfig.icon}</span>
					<span>{typeConfig.label}</span>
				</span>

				<div className="flex items-center gap-1.5">
					{/* Save / Bookmark Button */}
					<button
						type="button"
						onClick={handleSaveClick}
						className={cn(
							"p-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1",
							savedLocal
								? "bg-amber-50 text-amber-600 border border-amber-200"
								: "text-slate-400 hover:text-slate-600 hover:bg-slate-50",
						)}
						title={savedLocal ? "Saved post" : "Save post for later"}
					>
						<Bookmark
							className={cn(
								"h-4 w-4",
								savedLocal && "fill-amber-500 text-amber-500",
							)}
						/>
						<span className="text-[10px] hidden sm:inline">
							{savedLocal ? "Saved" : "Save"}
						</span>
					</button>

					{/* Time Ago */}
					<span className="text-[11px] text-slate-400 font-semibold bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
						{timeAgo(post.createdAt)}
					</span>

					{/* Delete Post */}
					{showDelete && onDelete && (
						<button
							type="button"
							onClick={() => onDelete(post.id)}
							className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-xl hover:bg-red-50"
							title="Delete post"
						>
							<Trash2 className="w-4 h-4" />
						</button>
					)}
				</div>
			</div>

			{/* Author Header */}
			<div className="flex items-center justify-between px-5 pt-3.5 pb-2">
				<div className="flex items-center gap-3.5 min-w-0">
					{/* Avatar */}
					{post.authorAvatar ? (
						<div className="flex-shrink-0 w-11 h-11 rounded-2xl overflow-hidden border border-slate-200 shadow-sm ring-2 ring-emerald-500/10">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							{/* biome-ignore lint/performance/noImgElement: dynamic author avatar */}
							<img
								src={post.authorAvatar}
								alt={post.authorName}
								className="w-full h-full object-cover"
							/>
						</div>
					) : (
						<div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white text-sm font-black shadow-sm ring-2 ring-emerald-500/20">
							{avatarInitials}
						</div>
					)}

					{/* Author Info */}
					<div className="min-w-0">
						<div className="flex items-center gap-1.5 flex-wrap">
							<p className="text-sm font-black text-slate-900 leading-tight truncate">
								{post.authorName}
							</p>
							{/* Verified Badge */}
							<span
								className="inline-flex items-center justify-center p-0.5 rounded-full bg-emerald-100 text-emerald-700"
								title="Verified Service Provider"
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
										d="M6.267 3.585a2.625 2.625 0 014.966 0l.071.217a.75.75 0 00.91.503l.218-.071a2.625 2.625 0 013.51 3.51l-.071.218a.75.75 0 00.503.91l.217.071a2.625 2.625 0 010 4.966l-.217.07a.75.75 0 00-.503.91l.071.218a2.625 2.625 0 01-3.51 3.51l-.218-.07a.75.75 0 00-.91.503l-.071-.217a2.625 2.625 0 01-4.966 0l-.071-.217a.75.75 0 00-.91-.503l-.218.07a2.625 2.625 0 01-3.51-3.51l.071-.218a.75.75 0 00-.503-.91l-.217-.07a2.625 2.625 0 010-4.966l.217-.07a.75.75 0 00.503-.91l-.071-.218a2.625 2.625 0 013.51-3.51l.218.07a.75.75 0 00.91-.503l.071-.217zM10 12.75a2.75 2.75 0 100-5.5 2.75 2.75 0 000 5.5z"
										clipRule="evenodd"
									/>
								</svg>
							</span>

							{/* Rating Badge if available */}
							{post.authorDetail?.averageRating ? (
								<span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded-md">
									<Star className="h-3 w-3 fill-amber-400 text-amber-500" />
									<span>{post.authorDetail.averageRating.toFixed(1)}</span>
								</span>
							) : null}
						</div>

						<div className="flex items-center gap-2 text-xs text-slate-500 truncate mt-0.5 font-medium">
							<span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
								{(() => {
									const IconComp =
										CATEGORY_ICONS[post.authorCategory] || Wrench;
									return <IconComp className="h-3 w-3 text-emerald-600" />;
								})()}
								<span>{post.authorCategory}</span>
							</span>
							{post.authorLocation && (
								<span className="inline-flex items-center gap-0.5 text-slate-400">
									<MapPin className="h-3 w-3 text-slate-400" />
									<span>{post.authorLocation}</span>
								</span>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Post Title & Content */}
			<div className="px-5 py-2 space-y-1.5">
				{post.title && (
					<h3 className="text-base font-black text-slate-900 leading-snug">
						{post.title}
					</h3>
				)}
				<p className="text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-wrap">
					{post.content}
				</p>

				{/* Hashtag Pills */}
				{post.tags && post.tags.length > 0 && (
					<div className="flex items-center gap-1.5 flex-wrap pt-1">
						{post.tags.map((tag) => (
							<span
								key={tag}
								className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer"
							>
								<Tag className="h-2.5 w-2.5 text-slate-400" />
								<span>#{tag}</span>
							</span>
						))}
					</div>
				)}
			</div>

			{/* Post Image */}
			{post.imageUrl && (
				<Link
					href={`/feed/${post.id}`}
					className="block overflow-hidden w-full my-3 bg-slate-900/5 border-y border-slate-100 group relative"
				>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					{/* biome-ignore lint/performance/noImgElement: Next.js <Image> requires pre-configuring arbitrary external domains for dynamic user uploads */}
					<img
						src={post.imageUrl}
						alt={`Work showcase by ${post.authorName}`}
						className="w-full max-h-[500px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
						loading="lazy"
					/>
				</Link>
			)}

			{/* Action Bar */}
			<div className="px-5 py-3.5 flex items-center justify-between gap-2 border-t border-slate-100/80">
				<div className="flex items-center gap-2">
					{/* Like Button */}
					<button
						type="button"
						onClick={handleLike}
						disabled={isLiking}
						className={cn(
							"flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition-all active:scale-95",
							isLiked
								? "bg-rose-50 text-rose-600 border border-rose-100"
								: "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100",
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
						className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100 transition-all active:scale-95"
					>
						<MessageSquare className="w-4 h-4 text-slate-500" />
						{localComments.length > 0 && <span>{localComments.length}</span>}
						<span>Comment</span>
					</button>

					{/* Share Button */}
					<button
						type="button"
						onClick={handleShare}
						className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100 transition-all active:scale-95"
						title="Share post"
					>
						<Share2 className="w-3.5 h-3.5 text-slate-500" />
						<span className="hidden sm:inline">Share</span>
					</button>
				</div>

				{/* WhatsApp Direct Contact CTA */}
				{whatsAppLink && (
					<a
						href={whatsAppLink}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-emerald-600/20 transition-all"
					>
						<svg
							className="w-4 h-4 fill-current"
							viewBox="0 0 24 24"
							aria-label="WhatsApp"
							role="img"
						>
							<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
						</svg>
						<span>Contact Provider</span>
					</a>
				)}
			</div>

			{/* Comments Section */}
			{showComments && (
				<div className="border-t border-slate-100 px-5 py-4 space-y-3 bg-slate-50/60">
					{localComments.length === 0 && (
						<p className="text-xs text-slate-400 text-center py-2 font-medium">
							No comments yet. Be the first to comment!
						</p>
					)}
					{localComments.map((comment) => (
						<div key={comment.id} className="flex gap-2.5 items-start">
							<div className="flex-shrink-0 w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">
								{comment.authorName.charAt(0).toUpperCase()}
							</div>
							<div className="bg-white border border-slate-200/80 rounded-2xl px-3.5 py-2 flex-1 min-w-0 shadow-2xs">
								<p className="text-xs font-bold text-slate-900">
									{comment.authorName}
								</p>
								<p className="text-xs text-slate-700 mt-0.5">
									{comment.content}
								</p>
							</div>
						</div>
					))}
					{/* Comment Input */}
					<div className="flex gap-2 items-center pt-2">
						<div className="flex-shrink-0 w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-sm">
							{currentUserName.charAt(0).toUpperCase()}
						</div>
						<div className="flex-1 flex gap-2">
							<input
								type="text"
								value={commentInput}
								onChange={(e) => setCommentInput(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && handleComment()}
								placeholder="Write a comment..."
								className="flex-1 text-xs bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
							/>
							<button
								type="button"
								onClick={handleComment}
								disabled={!commentInput.trim()}
								className="text-xs font-bold px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm"
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
