import type { Comment, CreatePostPayload, Post } from "@/types/post.types";
import { apiRequest } from "./api";

interface RawCommentAuthor {
	id?: string;
	fullName?: string;
	avatarUrl?: string | null;
}

interface RawComment {
	id: string;
	postId: string;
	authorId: string;
	content: string;
	createdAt: string;
	author?: RawCommentAuthor;
	authorName?: string;
	authorRole?: "customer" | "professional" | "admin";
}

interface RawPostAuthor {
	id?: string;
	fullName?: string;
	avatarUrl?: string | null;
	location?: string | null;
	whatsappNumber?: string | null;
	bio?: string | null;
	createdAt?: string;
	skills?: Array<{
		id: string;
		title: string;
		category: string;
		price?: number | null;
	}>;
	averageRating?: number;
	totalReviews?: number;
}

interface RawPost {
	id: string;
	authorId: string;
	title: string;
	content: string;
	authorCategory: string;
	postType: string;
	tags: string[];
	imageUrl?: string;
	likes: string[];
	createdAt: string;
	author?: RawPostAuthor;
	authorName?: string;
	authorAvatar?: string;
	authorLocation?: string;
	authorPhone?: string;
	comments?: RawComment[];
}

// Helper to map backend Prisma payload to the frontend Post interface
function mapBackendPost(post: RawPost): Post {
	return {
		id: post.id,
		authorId: post.authorId,
		authorName: post.author?.fullName || post.authorName || "Unknown Author",
		authorAvatar: post.author?.avatarUrl || post.authorAvatar || undefined,
		authorCategory: post.authorCategory,
		authorLocation: post.author?.location || post.authorLocation,
		authorPhone: post.author?.whatsappNumber || post.authorPhone,
		postType: post.postType,
		tags: post.tags || [],
		title: post.title,
		content: post.content,
		imageUrl: post.imageUrl || undefined,
		likes: post.likes || [],
		createdAt: post.createdAt,
		comments: (post.comments || []).map((c) => ({
			id: c.id,
			postId: c.postId,
			authorId: c.authorId,
			authorName: c.author?.fullName || c.authorName || "Unknown",
			authorRole: c.authorRole || "customer",
			content: c.content,
			createdAt: c.createdAt,
		})),
		authorDetail: post.author
			? {
					id: post.author.id || post.authorId,
					fullName: post.author.fullName || "Professional",
					avatarUrl: post.author.avatarUrl,
					location: post.author.location,
					whatsappNumber: post.author.whatsappNumber,
					bio: post.author.bio,
					createdAt: post.author.createdAt,
					skills: post.author.skills || [],
					averageRating: post.author.averageRating || 0,
					totalReviews: post.author.totalReviews || 0,
				}
			: undefined,
	};
}

export const postService = {
	getPosts: async (category?: string): Promise<Post[]> => {
		const query = category ? `?category=${encodeURIComponent(category)}` : "";
		const rawPosts = await apiRequest<RawPost[]>(`/posts${query}`, {
			method: "GET",
		});
		return (rawPosts || []).map(mapBackendPost);
	},

	getPostById: async (id: string): Promise<Post> => {
		const rawPost = await apiRequest<RawPost>(
			`/posts/${encodeURIComponent(id)}`,
			{ method: "GET" },
		);
		return mapBackendPost(rawPost);
	},

	getPostsByAuthor: async (_authorId: string): Promise<Post[]> => {
		// Own posts are fetched using the token of the logged-in user.
		const rawPosts = await apiRequest<RawPost[]>("/posts/my-posts", {
			method: "GET",
		});
		return (rawPosts || []).map(mapBackendPost);
	},

	createPost: async (postData: CreatePostPayload): Promise<Post> => {
		const rawPost = await apiRequest<RawPost>("/posts", {
			method: "POST",
			body: JSON.stringify(postData),
		});
		return mapBackendPost(rawPost);
	},

	likePost: async (postId: string, _userId: string): Promise<Post> => {
		const rawPost = await apiRequest<RawPost>(`/posts/${postId}/like`, {
			method: "POST",
		});
		return mapBackendPost(rawPost);
	},

	addComment: async (
		postId: string,
		commentData: Omit<Comment, "id" | "createdAt">,
	): Promise<Comment> => {
		return apiRequest<Comment>(`/posts/${postId}/comments`, {
			method: "POST",
			body: JSON.stringify(commentData),
		});
	},

	deletePost: async (postId: string): Promise<void> => {
		await apiRequest<void>(`/posts/${postId}`, { method: "DELETE" });
	},
};
