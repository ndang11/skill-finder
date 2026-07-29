export interface Comment {
	id: string;
	postId: string;
	authorId: string;
	authorName: string;
	authorRole?: "customer" | "professional" | "admin";
	content: string;
	createdAt: string;
}

export interface PostSkillItem {
	id: string;
	title: string;
	category: string;
	price?: number | null;
}

export interface PostAuthorDetail {
	id: string;
	fullName: string;
	avatarUrl?: string | null;
	category?: string;
	location?: string | null;
	whatsappNumber?: string | null;
	bio?: string | null;
	createdAt?: string;
	skills?: PostSkillItem[];
	averageRating?: number;
	totalReviews?: number;
}

export interface Post {
	id: string;
	authorId: string;
	authorName: string;
	authorAvatar?: string;
	authorCategory: string;
	authorLocation?: string; // optional — not stored in DB
	authorPhone?: string; // optional — not stored in DB
	postType: string;
	tags: string[];
	title: string;
	content: string;
	imageUrl?: string;
	likes: string[];
	comments: Comment[];
	createdAt: string;
	authorDetail?: PostAuthorDetail;
}

export type CreatePostPayload = {
	title: string;
	content: string;
	authorCategory: string;
	postType: string;
	tags: string[];
	imageUrl?: string;
};
