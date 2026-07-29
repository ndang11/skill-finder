export interface BookmarkedSkill {
	id: string;
	skillId: string;
	createdAt: string;
	title: string;
	description: string;
	category: string;
	price?: number | null;
	provider: {
		id: string;
		fullName: string;
		avatarUrl?: string | null;
		location?: string | null;
		whatsappNumber?: string | null;
		bio?: string | null;
		averageRating: number;
		totalReviews: number;
	};
}

export interface BookmarkStats {
	total: number;
	categoriesCount: number;
	topCategory: string;
}
