"use client";

import type { User } from "@supabase/supabase-js";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { reviewService } from "@/services/review.service";
import type { Review, ReviewStats } from "@/types/review.types";
import { supabase } from "@/utils/supabase/client";

export default function ProfessionalReviewsPage() {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [authLoading, setAuthLoading] = useState(true);
	const [reviews, setReviews] = useState<Review[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Filters
	const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
	const [searchQuery, setSearchQuery] = useState("");

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

	const fetchReviews = useCallback(async () => {
		if (!user) return;
		setLoading(true);
		setError(null);
		try {
			const data = await reviewService.getReviewsForProfessional(user.id);
			setReviews(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load reviews");
		} finally {
			setLoading(false);
		}
	}, [user]);

	useEffect(() => {
		if (user) {
			fetchReviews();
		}
	}, [user, fetchReviews]);

	// Calculate stats dynamically
	const stats: ReviewStats = useMemo(() => {
		if (reviews.length === 0) {
			return {
				averageRating: 0,
				totalReviews: 0,
				distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
			};
		}

		const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
		let sum = 0;

		for (const r of reviews) {
			sum += r.rating;
			const roundedRating = Math.min(5, Math.max(1, Math.round(r.rating))) as
				| 1
				| 2
				| 3
				| 4
				| 5;
			distribution[roundedRating] = (distribution[roundedRating] || 0) + 1;
		}

		const avg = Math.round((sum / reviews.length) * 10) / 10;
		return {
			averageRating: avg,
			totalReviews: reviews.length,
			distribution,
		};
	}, [reviews]);

	// Filtered reviews
	const filteredReviews = useMemo(() => {
		return reviews.filter((r) => {
			const matchesRating =
				ratingFilter === "all" || Math.round(r.rating) === ratingFilter;
			const q = searchQuery.toLowerCase().trim();
			const matchesSearch =
				!q ||
				r.comment.toLowerCase().includes(q) ||
				r.authorName.toLowerCase().includes(q) ||
				r.skillTitle.toLowerCase().includes(q);
			return matchesRating && matchesSearch;
		});
	}, [reviews, ratingFilter, searchQuery]);

	const formatDate = (dateStr: string) => {
		try {
			return new Date(dateStr).toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
			});
		} catch {
			return dateStr;
		}
	};

	if (authLoading || (loading && reviews.length === 0)) {
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
				<div>
					<h1 className="text-2xl font-black text-gray-900">
						Client Reviews & Ratings
					</h1>
					<p className="text-sm text-gray-500">
						Track customer feedback, ratings, and performance reviews.
					</p>
				</div>
			</div>

			{error && (
				<div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
					⚠️ {error}
				</div>
			)}

			{/* Ratings Overview Card */}
			<Card className="p-6 sm:p-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
					{/* Left: Overall Rating Badge */}
					<div className="text-center md:border-r md:border-gray-100 md:pr-8">
						<p className="text-xs font-bold uppercase tracking-wider text-gray-400">
							Overall Rating
						</p>
						<div className="mt-2 flex items-center justify-center gap-2">
							<span className="text-5xl font-black text-gray-900">
								{stats.averageRating > 0 ? stats.averageRating : "N/A"}
							</span>
							<span className="text-3xl text-amber-400">★</span>
						</div>
						<div className="mt-2 flex items-center justify-center gap-1">
							{[1, 2, 3, 4, 5].map((star) => (
								<svg
									key={star}
									className={`w-5 h-5 ${
										star <= Math.round(stats.averageRating)
											? "text-amber-400 fill-amber-400"
											: "text-gray-200 fill-gray-200"
									}`}
									viewBox="0 0 20 20"
									aria-hidden="true"
								>
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
								</svg>
							))}
						</div>
						<p className="mt-2 text-xs text-gray-500 font-medium">
							Based on {stats.totalReviews} customer review
							{stats.totalReviews !== 1 ? "s" : ""}
						</p>
					</div>

					{/* Right: Star Breakdown Progress Bars */}
					<div className="md:col-span-2 space-y-2">
						{[5, 4, 3, 2, 1].map((ratingKey) => {
							const count =
								stats.distribution[
									ratingKey as keyof typeof stats.distribution
								] || 0;
							const percentage =
								stats.totalReviews > 0
									? Math.round((count / stats.totalReviews) * 100)
									: 0;
							return (
								<div
									key={ratingKey}
									className="flex items-center gap-3 text-xs"
								>
									<span className="w-12 font-bold text-gray-600 flex items-center gap-1">
										{ratingKey} <span className="text-amber-400">★</span>
									</span>
									<div className="flex-1 h-2.5 rounded-full bg-gray-100 overflow-hidden">
										<div
											className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
											style={{ width: `${percentage}%` }}
										/>
									</div>
									<span className="w-12 text-right font-medium text-gray-400">
										{percentage}% ({count})
									</span>
								</div>
							);
						})}
					</div>
				</div>
			</Card>

			{/* Toolbar & Filters */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
				{/* Star Filter Tabs */}
				<div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
					<button
						type="button"
						onClick={() => setRatingFilter("all")}
						className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
							ratingFilter === "all"
								? "bg-primary-500 text-white shadow-sm"
								: "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
						}`}
					>
						All ({reviews.length})
					</button>
					{[5, 4, 3, 2, 1].map((star) => {
						const count =
							stats.distribution[star as keyof typeof stats.distribution] || 0;
						return (
							<button
								key={star}
								type="button"
								onClick={() => setRatingFilter(star)}
								className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap ${
									ratingFilter === star
										? "bg-primary-500 text-white shadow-sm"
										: "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
								}`}
							>
								<span>{star}</span>
								<span className="text-amber-400">★</span>
								<span className="text-[10px] opacity-75">({count})</span>
							</button>
						);
					})}
				</div>

				{/* Search Input */}
				<div className="w-full sm:w-64">
					<Input
						id="review-search"
						type="text"
						placeholder="Search feedback..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="text-xs h-9"
					/>
				</div>
			</div>

			{/* Review Cards List */}
			{filteredReviews.length > 0 ? (
				<div className="space-y-4">
					{filteredReviews.map((rev) => (
						<Card
							key={rev.id}
							className="p-5 space-y-3 transition-all hover:border-gray-300"
						>
							<div className="flex items-start justify-between gap-4">
								{/* Client Info */}
								<div className="flex items-center gap-3">
									<div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-50">
										{rev.authorAvatar ? (
											<Image
												src={rev.authorAvatar}
												alt={rev.authorName}
												fill
												className="object-cover"
												unoptimized
											/>
										) : (
											<span className="flex h-full w-full items-center justify-center bg-primary-100 text-sm font-bold text-primary-700">
												{rev.authorName.charAt(0).toUpperCase()}
											</span>
										)}
									</div>
									<div>
										<h4 className="font-bold text-sm text-gray-900">
											{rev.authorName}
										</h4>
										<span className="text-xs text-gray-400">
											{formatDate(rev.createdAt)}
										</span>
									</div>
								</div>

								{/* Star Rating Badge */}
								<div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
									<span className="text-xs font-black text-amber-700">
										{rev.rating}.0
									</span>
									<div className="flex text-amber-400">
										{[...Array(5)].map((_, i) => (
											<svg
												// biome-ignore lint/suspicious/noArrayIndexKey: fixed rating array
												key={i}
												className={`w-3.5 h-3.5 ${
													i < Math.round(rev.rating)
														? "fill-current"
														: "text-amber-200 fill-current"
												}`}
												viewBox="0 0 20 20"
												aria-hidden="true"
											>
												<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
											</svg>
										))}
									</div>
								</div>
							</div>

							{/* Skill Badge */}
							<div>
								<span className="inline-block rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
									🛠️ {rev.skillTitle}
								</span>
							</div>

							{/* Review Comment */}
							<p className="text-sm text-gray-700 leading-relaxed">
								&ldquo;{rev.comment}&rdquo;
							</p>
						</Card>
					))}
				</div>
			) : (
				/* Empty State */
				<Card className="p-12 text-center">
					<div className="mx-auto max-w-sm space-y-4">
						<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 border border-amber-100 text-3xl">
							⭐
						</div>
						<h3 className="text-lg font-bold text-gray-900">
							{searchQuery || ratingFilter !== "all"
								? "No matching reviews found"
								: "No customer reviews yet"}
						</h3>
						<p className="text-xs text-gray-500 leading-relaxed">
							{searchQuery || ratingFilter !== "all"
								? "Try resetting your search filter or selecting another star rating."
								: "Provide excellent service to clients to earn reviews and boost your ratings."}
						</p>
					</div>
				</Card>
			)}
		</div>
	);
}
