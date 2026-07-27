export interface Comment {
	id: string;
	postId: string;
	authorId: string;
	authorName: string;
	authorRole: "customer" | "professional" | "admin";
	content: string;
	createdAt: string;
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
}

export type CreatePostPayload = {
	title: string;
	content: string;
	authorCategory: string;
	postType: string;
	tags: string[];
	imageUrl?: string;
};
