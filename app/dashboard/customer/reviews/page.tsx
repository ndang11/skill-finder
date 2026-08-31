"use client";

import type { User } from "@supabase/supabase-js";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import WriteReviewModal from "@/components/reviews/WriteReviewModal";
import Card from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { professionalService } from "@/services/professional.service";
import { reviewService } from "@/services/review.service";
import type { Professional } from "@/types/professional.types";
import type { Review, ReviewStats } from "@/types/review.types";
import { supabase } from "@/utils/supabase/client";

export default function CustomerReviewsPage() {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [authLoading, setAuthLoading] = useState(true);
	const [reviews, setReviews] = useState<Review[]>([]);
	const [professionals, setProfessionals] = useState<Professional[]>([]);
	const [loadingReviews, setLoadingReviews] = useState(true);
	const [loadingProfessionals, setLoadingProfessionals] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Selected professional for active review modal
	const [activeProfessional, setActiveProfessional] =
		useState<Professional | null>(null);
	const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

	// Filters
	const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [professionalSearchQuery, setProfessionalSearchQuery] = useState("");

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
		setLoadingReviews(true);
		try {
			const data = await reviewService.getMyReviews();
			setReviews(data);
		} catch (err) {
			console.error("Failed to load customer reviews:", err);
			setError("Failed to load your review history.");
		} finally {
			setLoadingReviews(false);
		}
	}, [user]);

	const fetchProfessionals = useCallback(async () => {
		if (!user) return;
		setLoadingProfessionals(true);
		try {
			const data = await professionalService.getProfessionals();
			// Filter out themselves just in case
			setProfessionals(data.filter((p) => p.userId !== user.id));
		} catch (err) {
			console.error("Failed to load professionals:", err);
		} finally {
			setLoadingProfessionals(false);
		}
	}, [user]);

	useEffect(() => {
		if (user) {
			fetchReviews();
			fetchProfessionals();
		}
	}, [user, fetchReviews, fetchProfessionals]);

	// Calculate stats dynamically for reviews given
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

	// Filtered written reviews
	const filteredReviews = useMemo(() => {
		return reviews.filter((r) => {
			const matchesRating =
				ratingFilter === "all" || Math.round(r.rating) === ratingFilter;
			const q = searchQuery.toLowerCase().trim();
			const matchesSearch =
				!q ||
				r.comment.toLowerCase().includes(q) ||
				r.receiverName?.toLowerCase().includes(q) ||
				r.skillTitle.toLowerCase().includes(q);
			return matchesRating && matchesSearch;
		});
	}, [reviews, ratingFilter, searchQuery]);

	// Filtered professionals available to review
	const filteredProfessionals = useMemo(() => {
		return professionals.filter((p) => {
			const q = professionalSearchQuery.toLowerCase().trim();
			const matchesSearch =
				!q ||
				p.fullName?.toLowerCase().includes(q) ||
				p.category.toLowerCase().includes(q) ||
				p.skills.some((s) => s.toLowerCase().includes(q));
			return matchesSearch;
		});
	}, [professionals, professionalSearchQuery]);

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

	const handleOpenReview = (prof: Professional) => {
		setActiveProfessional(prof);
		setIsReviewModalOpen(true);
	};

	const handleReviewSubmitted = () => {
		fetchReviews();
		fetchProfessionals();
		setIsReviewModalOpen(false);
	};

	if (authLoading || (loadingReviews && reviews.length === 0)) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
			</div>
		);
	}

	if (!user) return null;

	return (
		<div className="space-y-8">
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
						My Reviews & Ratings
					</h1>
					<p className="text-sm text-gray-500">
						Rate service professionals and manage reviews you have submitted.
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
							Avg Rating Given
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
							Based on {stats.totalReviews} review
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

			{/* Section: Rate a Professional */}
			<div className="space-y-4">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<div>
						<h2 className="text-lg font-black text-gray-900">
							Rate a Service Professional
						</h2>
						<p className="text-xs text-gray-500">
							Select a professional below to submit a rating and write a review.
						</p>
					</div>
					<div className="w-full sm:w-72">
						<Input
							id="prof-search"
							type="text"
							placeholder="Search professionals..."
							value={professionalSearchQuery}
							onChange={(e) => setProfessionalSearchQuery(e.target.value)}
							className="text-xs h-9"
						/>
					</div>
				</div>

				{loadingProfessionals && professionals.length === 0 ? (
					<div className="flex justify-center p-8">
						<div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
					</div>
				) : filteredProfessionals.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{filteredProfessionals.map((prof) => (
							<Card
								key={prof.id}
								className="p-5 flex flex-col justify-between space-y-4 hover:border-primary-200 transition-all group"
							>
								<div className="flex items-start gap-3">
									<div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-50">
										{prof.avatarUrl ? (
											<Image
												src={prof.avatarUrl}
												alt={prof.fullName || "Professional"}
												fill
												className="object-cover"
												unoptimized
											/>
										) : (
											<span className="flex h-full w-full items-center justify-center bg-primary-100 text-base font-bold text-primary-700">
												{(prof.fullName || "P").charAt(0).toUpperCase()}
											</span>
										)}
									</div>
									<div className="space-y-1">
										<h4 className="font-bold text-sm text-gray-900 leading-none group-hover:text-primary-600 transition-colors">
											{prof.fullName}
										</h4>
										<p className="text-[11px] font-semibold text-primary-600">
											{prof.category}
										</p>
										<p className="text-[11px] text-gray-400 flex items-center gap-1">
											📍 {prof.location}
										</p>
									</div>
								</div>

								<div className="flex items-center justify-between border-t border-gray-50 pt-3">
									<div className="flex items-center gap-1">
										<span className="text-xs font-bold text-gray-700">
											★{" "}
											{prof.averageRating > 0
												? prof.averageRating.toFixed(1)
												: "New"}
										</span>
										<span className="text-[10px] text-gray-400">
											({prof.completedJobs} job
											{prof.completedJobs !== 1 ? "s" : ""})
										</span>
									</div>
									<button
										type="button"
										onClick={() => handleOpenReview(prof)}
										className="text-xs font-bold px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl border border-amber-200 transition-all active:scale-95"
									>
										⭐ Rate
									</button>
								</div>
							</Card>
						))}
					</div>
				) : (
					<Card className="p-8 text-center bg-gray-50/50">
						<p className="text-xs text-gray-500">
							No professionals found matching your search.
						</p>
					</Card>
				)}
			</div>

			{/* Section: Written Reviews History */}
			<div className="space-y-4 pt-4 border-t border-gray-100">
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
					<div>
						<h2 className="text-lg font-black text-gray-900">Review History</h2>
						<p className="text-xs text-gray-500">
							Browse and search reviews you have previously submitted.
						</p>
					</div>

					<div className="flex items-center gap-3">
						{/* Star Filter Tabs */}
						<div className="flex items-center gap-1 overflow-x-auto">
							<button
								type="button"
								onClick={() => setRatingFilter("all")}
								className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
									ratingFilter === "all"
										? "bg-primary-500 text-white shadow-sm"
										: "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
								}`}
							>
								All ({reviews.length})
							</button>
							{[5, 4, 3, 2, 1].map((star) => {
								const count =
									stats.distribution[star as keyof typeof stats.distribution] ||
									0;
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
						<div className="w-48 sm:w-56">
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
									{/* Professional Info */}
									<div className="flex items-center gap-3">
										<div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-50">
											{rev.receiverAvatar ? (
												<Image
													src={rev.receiverAvatar}
													alt={rev.receiverName || "Professional"}
													fill
													className="object-cover"
													unoptimized
												/>
											) : (
												<span className="flex h-full w-full items-center justify-center bg-amber-100 text-sm font-bold text-amber-700">
													{(rev.receiverName || "P").charAt(0).toUpperCase()}
												</span>
											)}
										</div>
										<div>
											<h4 className="font-bold text-sm text-gray-900">
												{rev.receiverName || "Service Professional"}
											</h4>
											<span className="text-xs text-gray-400">
												Reviewed on {formatDate(rev.createdAt)}
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
									: "No reviews submitted yet"}
							</h3>
							<p className="text-xs text-gray-500 leading-relaxed">
								{searchQuery || ratingFilter !== "all"
									? "Try resetting your search filter or selecting another star rating."
									: "Select a professional above to leave your first review and rate their services!"}
							</p>
						</div>
					</Card>
				)}
			</div>

			{/* Write Review Modal */}
			{activeProfessional && (
				<WriteReviewModal
					professionalId={activeProfessional.id}
					professionalName={activeProfessional.fullName}
					isOpen={isReviewModalOpen}
					onClose={() => {
						setIsReviewModalOpen(false);
						setActiveProfessional(null);
					}}
					onReviewSubmitted={handleReviewSubmitted}
				/>
			)}
		</div>
	);
}
