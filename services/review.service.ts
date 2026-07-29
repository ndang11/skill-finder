import type { Review } from "@/types/review.types";
import { apiRequest } from "./api";

function mapBackendReview(review: any): Review {
	return {
		id: review.id,
		bookingId: review.bookingId,
		authorId: review.authorId,
		authorName: review.author?.fullName || "Anonymous Client",
		authorAvatar: review.author?.avatarUrl || undefined,
		receiverId: review.receiverId,
		receiverName: review.receiver?.fullName || undefined,
		receiverAvatar: review.receiver?.avatarUrl || undefined,
		skillId: review.skillId,
		skillTitle: review.skill?.title || "Professional Skill",
		skillCategory: review.skill?.category || undefined,
		rating: review.rating,
		comment: review.comment,
		createdAt: review.createdAt,
	};
}

export interface CreateReviewPayload {
	professionalId: string;
	rating: number;
	comment?: string;
	skillId?: string;
	bookingId?: string;
}

export const reviewService = {
	getReviewsForProfessional: async (
		professionalId: string,
	): Promise<Review[]> => {
		try {
			const rawReviews = await apiRequest<any[]>(
				`/reviews/professional/${encodeURIComponent(professionalId)}`,
				{ method: "GET" },
			);
			return rawReviews.map(mapBackendReview);
		} catch (error) {
			console.warn("Falling back to empty reviews list:", error);
			return [];
		}
	},

	getMyReviews: async (): Promise<Review[]> => {
		try {
			const rawReviews = await apiRequest<any[]>("/reviews/my-reviews", {
				method: "GET",
			});
			return rawReviews.map(mapBackendReview);
		} catch (error) {
			console.warn("Falling back to empty my reviews list:", error);
			return [];
		}
	},

	getAverageRating: async (professionalId: string): Promise<number> => {
		try {
			const rating = await apiRequest<number>(
				`/reviews/professional/${encodeURIComponent(professionalId)}/rating`,
				{ method: "GET" },
			);
			return typeof rating === "number" ? rating : 0;
		} catch {
			return 0;
		}
	},

	createReview: async (payload: CreateReviewPayload): Promise<Review> => {
		const rawReview = await apiRequest<any>("/reviews", {
			method: "POST",
			body: JSON.stringify(payload),
		});
		return mapBackendReview(rawReview);
	},
};
