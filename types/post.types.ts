export interface Comment {
	id: string;
	postId: string;
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
	authorLocation: string;
	authorPhone: string;
	content: string;
	imageUrl?: string;
	likes: string[]; // List of user IDs who liked the post
	comments: Comment[];
	createdAt: string;
}
