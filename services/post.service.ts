import type { Comment, CreatePostPayload, Post } from "@/types/post.types";
import { apiRequest } from "./api";

// Helper to map backend Prisma payload to the frontend Post interface
function mapBackendPost(post: any): Post {
	return {
		...post,
		authorName: post.author?.fullName || post.authorName || "Unknown Author",
		authorAvatar: post.author?.avatarUrl || post.authorAvatar,
		comments:
			post.comments?.map((c: any) => ({
				...c,
				authorName: c.author?.fullName || c.authorName || "Unknown",
			})) || [],
	};
}

export const postService = {
	getPosts: async (category?: string): Promise<Post[]> => {
		const query = category ? `?category=${encodeURIComponent(category)}` : "";
		const rawPosts = await apiRequest<any[]>(`/posts${query}`, {
			method: "GET",
		});
		return rawPosts.map(mapBackendPost);
	},

	getPostsByAuthor: async (_authorId: string): Promise<Post[]> => {
		// Own posts are fetched using the token of the logged-in user.
		const rawPosts = await apiRequest<any[]>("/posts/my-posts", {
			method: "GET",
		});
		return rawPosts.map(mapBackendPost);
	},

	createPost: async (postData: CreatePostPayload): Promise<Post> => {
		const rawPost = await apiRequest<any>("/posts", {
			method: "POST",
			body: JSON.stringify(postData),
		});
		return mapBackendPost(rawPost);
	},

	likePost: async (postId: string, _userId: string): Promise<Post> => {
		const rawPost = await apiRequest<any>(`/posts/${postId}/like`, {
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
