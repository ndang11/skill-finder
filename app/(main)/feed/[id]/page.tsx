"use client";

import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { postService } from "@/services/post.service";
import type { Post, PostAuthorDetail } from "@/types/post.types";
import { supabase } from "@/utils/supabase/client";

function timeAgo(dateString: string): string {
	const now = Date.now();
	const then = new Date(dateString).getTime();
	const diff = Math.floor((now - then) / 1000);
	if (diff < 60) return `${diff}s ago`;
	if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
	if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
	if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
	return new Date(dateString).toLocaleDateString("en-US", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

function formatDate(dateStr: string) {
	try {
		return new Date(dateStr).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	} catch {
		return dateStr;
	}
}

function postTypeLabel(type: string) {
	const labels: Record<string, string> = {
		showcase: "🖼️ Showcase",
		tip: "💡 Pro Tip",
		availability: "📅 Available",
		announcement: "📢 Announcement",
	};
	return labels[type] || "📝 Post";
}

export default function PostDetailPage() {
	const params = useParams();
	const router = useRouter();
	const postId = params.id as string;

	const [user, setUser] = useState<User | null>(null);
	const [post, setPost] = useState<Post | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isLiking, setIsLiking] = useState(false);
	const [commentInput, setCommentInput] = useState("");

	useEffect(() => {
		supabase.auth.getUser().then(({ data }) => {
			setUser(data.user);
		});
	}, []);

	const fetchPost = useCallback(async () => {
		if (!postId) return;
		setLoading(true);
		try {
			const data = await postService.getPostById(postId);
			setPost(data);
		} catch (err) {
			console.error("Failed to load post:", err);
			setError("This post could not be found or may have been removed.");
		} finally {
			setLoading(false);
		}
	}, [postId]);

	useEffect(() => {
		fetchPost();
	}, [fetchPost]);

	const handleLike = async () => {
		if (!post || !user || isLiking) return;
		setIsLiking(true);
		try {
			const updated = await postService.likePost(post.id, user.id);
			setPost(updated);
		} catch (err) {
			console.error("Failed to toggle like:", err);
		} finally {
			setIsLiking(false);
		}
	};

	const handleComment = async () => {
		if (!post || !user || !commentInput.trim()) return;
		try {
			const comment = await postService.addComment(post.id, {
				postId: post.id,
				authorId: user.id,
				authorName: user.user_metadata?.fullname || user.email || "Anonymous",
				content: commentInput.trim(),
			});
			setPost((prev) =>
				prev ? { ...prev, comments: [...prev.comments, comment] } : prev,
			);
			setCommentInput("");
		} catch (err) {
			console.error("Failed to add comment:", err);
		}
	};

	const currentUserId = user?.id || "";
	const isLiked = post ? post.likes.includes(currentUserId) : false;
	const author: PostAuthorDetail | undefined = post?.authorDetail;

	const whatsAppLink = author?.whatsappNumber
		? `https://wa.me/${author.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
				`Hello ${author.fullName}, I saw your post "${post?.title}" on SkillFinder and would like to inquire about your services.`,
			)}`
		: null;

	if (loading) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
			</div>
		);
	}

	if (error || !post) {
		return (
			<div className="mx-auto max-w-2xl px-4 py-20 text-center space-y-4">
				<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 border border-red-100 text-3xl">
					😕
				</div>
				<h2 className="text-xl font-bold text-gray-900">Post Not Found</h2>
				<p className="text-sm text-gray-500">
					{error || "This post does not exist."}
				</p>
				<Button
					variant="outline"
					onClick={() => router.back()}
					className="text-xs font-bold"
				>
					← Go Back
				</Button>
			</div>
		);
	}

	const avatarInitials = (post.authorName || "P")
		.split(" ")
		.map((n) => n[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	return (
		<div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
			{/* Back button */}
			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={() => router.back()}
					className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-all hover:border-gray-300 hover:text-gray-800 active:scale-95"
					aria-label="Go back"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<path d="M19 12H5" />
						<path d="m12 19-7-7 7-7" />
					</svg>
				</button>
				<div>
					<h1 className="text-lg font-black text-gray-900">Post Details</h1>
					<p className="text-xs text-gray-400">
						Posted {timeAgo(post.createdAt)}
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Main Content (Left 2/3) */}
				<div className="lg:col-span-2 space-y-6">
					{/* Post Card */}
					<Card className="overflow-hidden">
						{/* Post Image */}
						{post.imageUrl && (
							<div className="w-full bg-gray-100 border-b border-gray-100">
								{/* biome-ignore lint/performance/noImgElement: dynamic user uploads */}
								<img
									src={post.imageUrl}
									alt={post.title}
									className="w-full max-h-[500px] object-cover"
									loading="lazy"
								/>
							</div>
						)}

						<div className="p-6 space-y-5">
							{/* Post Header */}
							<div className="flex items-start justify-between gap-4">
								<div className="space-y-2 flex-1 min-w-0">
									{/* Type Badge & Date */}
									<div className="flex items-center gap-2 flex-wrap">
										<span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700 border border-primary-100">
											{postTypeLabel(post.postType)}
										</span>
										<span className="text-xs text-gray-400">
											{formatDate(post.createdAt)}
										</span>
									</div>

									{/* Title */}
									<h2 className="text-xl font-black text-gray-900 leading-tight">
										{post.title}
									</h2>
								</div>
							</div>

							{/* Post Content */}
							<p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
								{post.content}
							</p>

							{/* Tags */}
							{post.tags.length > 0 && (
								<div className="flex flex-wrap gap-2">
									{post.tags.map((tag) => (
										<span
											key={tag}
											className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
										>
											#{tag}
										</span>
									))}
								</div>
							)}

							{/* Action Bar */}
							<div className="flex items-center gap-3 pt-2 border-t border-gray-100">
								<button
									type="button"
									onClick={handleLike}
									disabled={isLiking || !user}
									className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full transition-all ${
										isLiked
											? "bg-red-50 text-red-500 hover:bg-red-100"
											: "bg-gray-100 text-gray-600 hover:bg-gray-200"
									}`}
								>
									<svg
										className="w-4 h-4"
										fill={isLiked ? "currentColor" : "none"}
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={2}
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
										/>
									</svg>
									{post.likes.length > 0 && <span>{post.likes.length}</span>}
									<span>{isLiked ? "Liked" : "Like"}</span>
								</button>

								<span className="text-xs text-gray-400 flex items-center gap-1">
									<svg
										className="w-4 h-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={2}
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
										/>
									</svg>
									{post.comments.length} comment
									{post.comments.length !== 1 ? "s" : ""}
								</span>

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
											aria-hidden="true"
										>
											<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
										</svg>
										Chat on WhatsApp
									</a>
								)}
							</div>
						</div>
					</Card>

					{/* Comments Section */}
					<Card className="p-6 space-y-5">
						<h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
							💬 Comments
							<span className="text-xs font-medium text-gray-400">
								({post.comments.length})
							</span>
						</h3>

						{post.comments.length > 0 ? (
							<div className="space-y-3">
								{post.comments.map((comment) => (
									<div key={comment.id} className="flex gap-3 items-start">
										<div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">
											{comment.authorName.charAt(0).toUpperCase()}
										</div>
										<div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 flex-1 min-w-0">
											<div className="flex items-center gap-2">
												<p className="text-xs font-bold text-gray-900">
													{comment.authorName}
												</p>
												<span className="text-[10px] text-gray-400">
													{timeAgo(comment.createdAt)}
												</span>
											</div>
											<p className="text-xs text-gray-700 mt-1 leading-relaxed">
												{comment.content}
											</p>
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="text-xs text-gray-400 text-center py-4">
								No comments yet. Be the first to share your thoughts!
							</p>
						)}

						{/* Comment Input */}
						{user ? (
							<div className="flex gap-2 items-start pt-2 border-t border-gray-100">
								<div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs font-bold">
									{(user.user_metadata?.fullname || user.email || "U")
										.charAt(0)
										.toUpperCase()}
								</div>
								<div className="flex-1 flex gap-2">
									<input
										type="text"
										value={commentInput}
										onChange={(e) => setCommentInput(e.target.value)}
										onKeyDown={(e) => e.key === "Enter" && handleComment()}
										placeholder="Write a comment..."
										className="flex-1 text-xs bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
									/>
									<button
										type="button"
										onClick={handleComment}
										disabled={!commentInput.trim()}
										className="text-xs font-semibold px-4 py-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-40 disabled:pointer-events-none transition-all"
									>
										Post
									</button>
								</div>
							</div>
						) : (
							<div className="text-center py-3 border-t border-gray-100">
								<Link
									href="/login"
									className="text-xs font-bold text-primary-600 hover:underline"
								>
									Log in to leave a comment →
								</Link>
							</div>
						)}
					</Card>
				</div>

				{/* Sidebar: Professional Profile (Right 1/3) */}
				<div className="space-y-6">
					{/* Author Profile Card */}
					<Card className="p-6 space-y-5 sticky top-24">
						<div className="flex items-center gap-3">
							{post.authorAvatar ? (
								<div className="flex-shrink-0 w-14 h-14 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
									{/* biome-ignore lint/performance/noImgElement: dynamic author avatar */}
									<img
										src={post.authorAvatar}
										alt={post.authorName}
										className="w-full h-full object-cover"
									/>
								</div>
							) : (
								<div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-green-600 flex items-center justify-center text-white text-lg font-black shadow-sm">
									{avatarInitials}
								</div>
							)}
							<div className="min-w-0">
								<h3 className="text-sm font-bold text-gray-900 truncate">
									{author?.fullName || post.authorName}
								</h3>
								<p className="text-xs text-primary-600 font-semibold">
									{post.authorCategory}
								</p>
								{author?.location && (
									<p className="text-[11px] text-gray-400 flex items-center gap-1">
										📍 {author.location}
									</p>
								)}
							</div>
						</div>

						{/* Rating Badge */}
						{author && (
							<div className="flex items-center gap-3 rounded-xl bg-amber-50 p-3 border border-amber-100">
								<div className="flex items-center gap-1">
									<span className="text-lg font-black text-amber-700">
										{author.averageRating && author.averageRating > 0
											? author.averageRating.toFixed(1)
											: "New"}
									</span>
									<svg
										className="w-5 h-5 text-amber-400 fill-amber-400"
										viewBox="0 0 20 20"
										aria-hidden="true"
									>
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
								</div>
								<span className="text-xs text-amber-700 font-medium">
									{author.totalReviews || 0} review
									{(author.totalReviews || 0) !== 1 ? "s" : ""}
								</span>
							</div>
						)}

						{/* Bio */}
						{author?.bio && (
							<div>
								<p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
									About
								</p>
								<p className="text-xs text-gray-600 leading-relaxed">
									{author.bio}
								</p>
							</div>
						)}

						{/* Member Since */}
						{author?.createdAt && (
							<div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-3">
								<span>Member since</span>
								<span className="font-medium text-gray-600">
									{formatDate(author.createdAt)}
								</span>
							</div>
						)}

						{/* Skills */}
						{author?.skills && author.skills.length > 0 && (
							<div>
								<p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
									Skills Offered
								</p>
								<div className="space-y-2">
									{author.skills.map((skill) => (
										<div
											key={skill.id}
											className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 border border-gray-100"
										>
											<div className="min-w-0">
												<p className="text-xs font-bold text-gray-900 truncate">
													{skill.title}
												</p>
												<p className="text-[10px] text-gray-400">
													{skill.category}
												</p>
											</div>
											{skill.price != null && (
												<span className="text-[11px] font-extrabold text-primary-700 flex-shrink-0">
													{skill.price.toLocaleString()} FCFA
												</span>
											)}
										</div>
									))}
								</div>
							</div>
						)}

						{/* Contact CTA */}
						{whatsAppLink && (
							<a
								href={whatsAppLink}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-sm font-bold px-4 py-3 rounded-xl shadow-sm shadow-green-500/20 transition-all active:scale-[0.98]"
							>
								<svg
									className="w-5 h-5 fill-current"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
								</svg>
								Contact on WhatsApp
							</a>
						)}
					</Card>
				</div>
			</div>
		</div>
	);
}
