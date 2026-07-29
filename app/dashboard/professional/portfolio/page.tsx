"use client";

import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { postService } from "@/services/post.service";
import type { Post } from "@/types/post.types";
import { supabase } from "@/utils/supabase/client";

export default function PortfolioPage() {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [authLoading, setAuthLoading] = useState(true);
	const [items, setItems] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [selectedItem, setSelectedItem] = useState<Post | null>(null);

	useEffect(() => {
		supabase.auth.getUser().then(({ data }) => {
			setUser(data.user);
			setAuthLoading(false);
		});
	}, []);

	useEffect(() => {
		if (!authLoading && !user) {
			router.push("/login");
		}
	}, [user, authLoading, router]);

	const fetchPortfolio = useCallback(async () => {
		if (!user) return;
		setLoading(true);
		setError(null);
		try {
			const posts = await postService.getPostsByAuthor(user.id);
			// Portfolio items: showcase posts or any post with an image
			const portfolio = posts.filter(
				(p) => p.postType === "showcase" || p.imageUrl,
			);
			setItems(portfolio);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load portfolio");
		} finally {
			setLoading(false);
		}
	}, [user]);

	useEffect(() => {
		if (user) {
			fetchPortfolio();
		}
	}, [user, fetchPortfolio]);

	const handleDelete = async (postId: string) => {
		if (!confirm("Are you sure you want to remove this portfolio item?"))
			return;
		setDeletingId(postId);
		try {
			await postService.deletePost(postId);
			setItems((prev) => prev.filter((p) => p.id !== postId));
			if (selectedItem?.id === postId) setSelectedItem(null);
		} catch (err) {
			console.error("Failed to delete portfolio item:", err);
		} finally {
			setDeletingId(null);
		}
	};

	const timeAgo = (dateStr: string) => {
		const diff = Date.now() - new Date(dateStr).getTime();
		const mins = Math.floor(diff / 60000);
		if (mins < 1) return "Just now";
		if (mins < 60) return `${mins}m ago`;
		const hrs = Math.floor(mins / 60);
		if (hrs < 24) return `${hrs}h ago`;
		const days = Math.floor(hrs / 24);
		if (days < 30) return `${days}d ago`;
		return new Date(dateStr).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		});
	};

	if (authLoading || (loading && items.length === 0)) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
			</div>
		);
	}

	if (!user) return null;

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex items-center gap-4">
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
				<div className="flex-1 min-w-0">
					<h1 className="text-2xl font-black text-gray-900">My Portfolio</h1>
					<p className="text-sm text-gray-500">
						Showcase your best work to attract clients.
					</p>
				</div>
				<Button
					className="flex-shrink-0 h-10 px-5 text-sm w-auto"
					onClick={() => router.push("/dashboard/professional/posts/new")}
				>
					+ Add Work
				</Button>
			</div>

			{/* Error Message */}
			{error && (
				<div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
					⚠️ {error}
				</div>
			)}

			{/* Portfolio Grid */}
			{items.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
					{items.map((item) => (
						<div
							key={item.id}
							className="group relative rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-300"
						>
							{/* Image */}
							{item.imageUrl ? (
								<button
									type="button"
									onClick={() => setSelectedItem(item)}
									className="block w-full aspect-[4/3] overflow-hidden bg-gray-100 cursor-pointer"
								>
									{/* biome-ignore lint/performance/noImgElement: dynamic user uploads */}
									<img
										src={item.imageUrl}
										alt={item.title}
										className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
										loading="lazy"
									/>
								</button>
							) : (
								<button
									type="button"
									onClick={() => setSelectedItem(item)}
									className="w-full aspect-[4/3] bg-gradient-to-br from-primary-50 to-green-50 flex items-center justify-center cursor-pointer"
								>
									<span className="text-5xl opacity-40">🖼️</span>
								</button>
							)}

							{/* Hover Overlay with Gradient */}
							<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

							{/* Content */}
							<div className="p-4 space-y-2">
								<h3 className="font-bold text-sm text-gray-900 truncate">
									{item.title}
								</h3>
								<p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
									{item.content}
								</p>
								<div className="flex items-center justify-between pt-1">
									<div className="flex items-center gap-3">
										{/* Post Type Badge */}
										<span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-[10px] font-bold text-primary-700 uppercase tracking-wide">
											{item.postType === "showcase"
												? "🖼️ Showcase"
												: item.postType === "tip"
													? "💡 Tip"
													: item.postType === "availability"
														? "📅 Available"
														: "📢 Update"}
										</span>
										{/* Like Count */}
										{item.likes.length > 0 && (
											<span className="text-xs text-gray-400 flex items-center gap-1">
												<svg
													className="w-3.5 h-3.5"
													fill="currentColor"
													viewBox="0 0 24 24"
													aria-hidden="true"
												>
													<path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
												</svg>
												{item.likes.length}
											</span>
										)}
									</div>
									<span className="text-[10px] text-gray-400 font-medium">
										{timeAgo(item.createdAt)}
									</span>
								</div>
							</div>

							{/* Delete Button (top-right) */}
							<button
								type="button"
								onClick={() => handleDelete(item.id)}
								disabled={deletingId === item.id}
								className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-all opacity-0 group-hover:opacity-100 shadow-sm disabled:opacity-50"
								title="Remove from portfolio"
							>
								{deletingId === item.id ? (
									<div className="w-4 h-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
								) : (
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
											d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
										/>
									</svg>
								)}
							</button>
						</div>
					))}
				</div>
			) : (
				/* Empty State */
				<Card className="p-12 text-center">
					<div className="mx-auto max-w-sm space-y-5">
						<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-50 to-green-50 border border-primary-100 shadow-sm">
							<span className="text-4xl">🖼️</span>
						</div>
						<div className="space-y-2">
							<h3 className="text-xl font-black text-gray-900">
								No portfolio items yet
							</h3>
							<p className="text-sm text-gray-500 leading-relaxed">
								Showcase your completed projects, designs, or work samples.
								Upload photos and descriptions to attract more clients.
							</p>
						</div>
						<Button
							className="w-auto px-8 mx-auto"
							onClick={() => router.push("/dashboard/professional/posts/new")}
						>
							+ Create Your First Showcase
						</Button>
					</div>
				</Card>
			)}

			{/* Lightbox / Detail Modal */}
			{selectedItem && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
					onClick={() => setSelectedItem(null)}
					onKeyDown={(e) => {
						if (e.key === "Escape") setSelectedItem(null);
					}}
					role="dialog"
					aria-modal="true"
					aria-label="Portfolio item detail"
				>
					<div
						className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
						onClick={(e) => e.stopPropagation()}
						onKeyDown={() => {}}
						role="document"
					>
						{/* Close Button */}
						<button
							type="button"
							onClick={() => setSelectedItem(null)}
							className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-all shadow-sm"
							aria-label="Close"
						>
							<svg
								className="w-5 h-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={2.5}
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>

						{/* Image */}
						{selectedItem.imageUrl && (
							<div className="w-full bg-gray-100">
								{/* biome-ignore lint/performance/noImgElement: dynamic user uploads */}
								<img
									src={selectedItem.imageUrl}
									alt={selectedItem.title}
									className="w-full max-h-[60vh] object-contain"
								/>
							</div>
						)}

						{/* Detail Content */}
						<div className="p-6 space-y-4">
							<div className="flex items-start justify-between gap-4">
								<div className="space-y-1 min-w-0">
									<h2 className="text-xl font-black text-gray-900">
										{selectedItem.title}
									</h2>
									<div className="flex items-center gap-3">
										<span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-bold text-primary-700 capitalize">
											{selectedItem.postType}
										</span>
										<span className="text-xs text-gray-400">
											{timeAgo(selectedItem.createdAt)}
										</span>
									</div>
								</div>
								{selectedItem.likes.length > 0 && (
									<span className="flex items-center gap-1.5 text-sm font-bold text-red-400 flex-shrink-0">
										<svg
											className="w-4 h-4"
											fill="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
										</svg>
										{selectedItem.likes.length}
									</span>
								)}
							</div>
							<p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
								{selectedItem.content}
							</p>

							{/* Tags */}
							{selectedItem.tags.length > 0 && (
								<div className="flex flex-wrap gap-2 pt-2">
									{selectedItem.tags.map((tag) => (
										<span
											key={tag}
											className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
										>
											#{tag}
										</span>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
