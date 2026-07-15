import type { Comment, Post } from "@/types/post.types";
import { apiRequest } from "./api";

export const postService = {
	getPosts: async (category?: string): Promise<Post[]> => {
		const query = category ? `?category=${encodeURIComponent(category)}` : "";
		return apiRequest<Post[]>(`/posts${query}`, {
			method: "GET",
		});
	},

	getPostsByAuthor: async (_authorId: string): Promise<Post[]> => {
		// On the backend, own posts are fetched using the token of the logged-in user.
		return apiRequest<Post[]>("/posts/my-posts", {
			method: "GET",
		});
	},

	createPost: async (
		postData: Omit<Post, "id" | "likes" | "comments" | "createdAt">,
	): Promise<Post> => {
		return apiRequest<Post>("/posts", {
			method: "POST",
			body: JSON.stringify(postData),
		});
	},

	likePost: async (postId: string, _userId: string): Promise<Post> => {
		return apiRequest<Post>(`/posts/${postId}/like`, {
			method: "POST",
		});
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
		await apiRequest<void>(`/posts/${postId}`, {
			method: "DELETE",
		});
	},
};
