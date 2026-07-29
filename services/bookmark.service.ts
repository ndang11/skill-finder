import type { BookmarkedSkill } from "@/types/bookmark.types";
import { apiRequest } from "./api";

interface RawBookmarkProvider {
	id?: string;
	fullName?: string;
	avatarUrl?: string | null;
	location?: string | null;
	whatsappNumber?: string | null;
	bio?: string | null;
	averageRating?: number;
	totalReviews?: number;
}

interface RawBookmarkItem {
	id: string;
	skillId: string;
	createdAt: string;
	title: string;
	description: string;
	category: string;
	price?: number | null;
	provider?: RawBookmarkProvider;
}

// Helper to map backend raw response into typed BookmarkedSkill
function mapBackendBookmark(item: RawBookmarkItem): BookmarkedSkill {
	return {
		id: item.id,
		skillId: item.skillId,
		createdAt: item.createdAt,
		title: item.title,
		description: item.description,
		category: item.category,
		price: item.price ?? null,
		provider: {
			id: item.provider?.id || "",
			fullName: item.provider?.fullName || "Professional",
			avatarUrl: item.provider?.avatarUrl || null,
			location: item.provider?.location || "Cameroon",
			whatsappNumber: item.provider?.whatsappNumber || null,
			bio: item.provider?.bio || null,
			averageRating: item.provider?.averageRating || 0,
			totalReviews: item.provider?.totalReviews || 0,
		},
	};
}

export const bookmarkService = {
	/**
	 * Get all bookmarked skills for the logged-in customer
	 */
	getBookmarks: async (): Promise<BookmarkedSkill[]> => {
		try {
			const data = await apiRequest<RawBookmarkItem[]>("/bookmarks", {
				method: "GET",
			});
			return (data || []).map(mapBackendBookmark);
		} catch (error) {
			console.error("Failed to fetch bookmarks:", error);
			return [];
		}
	},

	/**
	 * Check if a specific skill is bookmarked
	 */
	isBookmarked: async (skillId: string): Promise<boolean> => {
		try {
			const data = await apiRequest<{ isBookmarked: boolean }>(
				`/bookmarks/check/${encodeURIComponent(skillId)}`,
				{ method: "GET" },
			);
			return !!data?.isBookmarked;
		} catch (error) {
			console.error("Failed to check bookmark status:", error);
			return false;
		}
	},

	/**
	 * Add a skill to customer's bookmarks
	 */
	addBookmark: async (skillId: string): Promise<boolean> => {
		try {
			await apiRequest(`/bookmarks/${encodeURIComponent(skillId)}`, {
				method: "POST",
			});
			return true;
		} catch (error) {
			console.error("Failed to add bookmark:", error);
			return false;
		}
	},

	/**
	 * Remove a skill from customer's bookmarks
	 */
	removeBookmark: async (skillId: string): Promise<boolean> => {
		try {
			await apiRequest(`/bookmarks/${encodeURIComponent(skillId)}`, {
				method: "DELETE",
			});
			return true;
		} catch (error) {
			console.error("Failed to remove bookmark:", error);
			return false;
		}
	},
};
