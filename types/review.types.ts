export interface Review {
	id: string;
	bookingId: string;
	authorId: string;
	authorName: string;
	authorAvatar?: string;
	receiverId: string;
	receiverName?: string;
	receiverAvatar?: string;
	skillId: string;
	skillTitle: string;
	skillCategory?: string;
	rating: number;
	comment: string;
	createdAt: string;
}

export interface ReviewStats {
	averageRating: number;
	totalReviews: number;
	distribution: {
		5: number;
		4: number;
		3: number;
		2: number;
		1: number;
	};
}
