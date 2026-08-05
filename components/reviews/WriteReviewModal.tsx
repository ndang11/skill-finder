"use client";

import { AlertCircle, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { reviewService } from "@/services/review.service";
import type { Review } from "@/types/review.types";

interface WriteReviewModalProps {
	professionalId: string;
	professionalName?: string;
	isOpen: boolean;
	onClose: () => void;
	onReviewSubmitted: (newReview: Review) => void;
}

export default function WriteReviewModal({
	professionalId,
	professionalName = "Professional",
	isOpen,
	onClose,
	onReviewSubmitted,
}: WriteReviewModalProps) {
	const [rating, setRating] = useState<number>(5);
	const [hoverRating, setHoverRating] = useState<number | null>(null);
	const [comment, setComment] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	if (!isOpen) return null;

	const activeRating = hoverRating !== null ? hoverRating : rating;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (rating < 1 || rating > 5) {
			setError("Please select a rating between 1 and 5 stars.");
			return;
		}

		setSubmitting(true);
		setError(null);

		try {
			const newReview = await reviewService.createReview({
				professionalId,
				rating,
				comment: comment.trim(),
			});
			onReviewSubmitted(newReview);
			onClose();
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Failed to submit review. Please try again.",
			);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in-50"
			onClick={onClose}
			onKeyDown={(e) => {
				if (e.key === "Escape") onClose();
			}}
			role="dialog"
			aria-modal="true"
			aria-label="Write a review"
		>
			<div
				className="relative max-w-lg w-full rounded-2xl bg-white p-6 sm:p-8 shadow-2xl space-y-6"
				onClick={(e) => e.stopPropagation()}
				onKeyDown={() => {}}
				role="document"
			>
				{/* Close Button */}
				<button
					type="button"
					onClick={onClose}
					className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
					aria-label="Close modal"
				>
					<X className="h-4 w-4" />
				</button>

				{/* Header */}
				<div className="space-y-1">
					<h3 className="text-xl font-black text-gray-900">
						Rate {professionalName}
					</h3>
					<p className="text-xs text-gray-500">
						Share your experience and give a star rating for this professional.
					</p>
				</div>

				{error && (
					<div className="rounded-xl border border-red-200 bg-red-50 p-3 flex items-start gap-2 text-xs font-medium text-red-700">
						<AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
						<span>{error}</span>
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Star Selector */}
					<div className="space-y-2 text-center py-2 bg-amber-50/50 rounded-2xl border border-amber-100">
						<label
							htmlFor="star-rating"
							className="text-xs font-bold text-amber-900 uppercase tracking-wider block"
						>
							Your Rating: {activeRating} Star{activeRating !== 1 ? "s" : ""}
						</label>

						<div
							id="star-rating"
							className="flex items-center justify-center gap-2"
						>
							{[1, 2, 3, 4, 5].map((star) => (
								<button
									key={star}
									type="button"
									onClick={() => setRating(star)}
									onMouseEnter={() => setHoverRating(star)}
									onMouseLeave={() => setHoverRating(null)}
									className="p-1 transition-transform hover:scale-125 focus:outline-none"
									aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
								>
									<svg
										className={`w-9 h-9 transition-colors ${
											star <= activeRating
												? "text-amber-400 fill-amber-400 drop-shadow-sm"
												: "text-gray-200 fill-gray-200"
										}`}
										viewBox="0 0 20 20"
										aria-hidden="true"
									>
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
								</button>
							))}
						</div>
					</div>

					{/* Feedback Comment */}
					<div className="space-y-1.5">
						<label
							htmlFor="review-comment"
							className="text-xs font-bold text-gray-700 tracking-wide block"
						>
							Written Feedback (Optional)
						</label>
						<Textarea
							id="review-comment"
							rows={4}
							placeholder="Write your honest review detailing quality of work, communication, and professionalism..."
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							maxLength={500}
						/>
						<p className="text-[11px] text-gray-400 text-right font-mono">
							{comment.length}/500
						</p>
					</div>

					{/* Action Buttons */}
					<div className="flex items-center justify-end gap-3 pt-2">
						<Button
							type="button"
							variant="outline"
							className="w-auto px-5"
							onClick={onClose}
						>
							Cancel
						</Button>
						<Button type="submit" className="w-auto px-6" disabled={submitting}>
							{submitting ? "Submitting..." : "Submit Review"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
