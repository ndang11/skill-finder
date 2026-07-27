import { useCallback, useState } from "react";
import { postService } from "@/services/post.service";
import type { Post } from "@/types/post.types";

export function usePosts() {
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchPosts = useCallback(async (category?: string) => {
		setLoading(true);
		setError(null);
		try {
			const data = await postService.getPosts(category);
			setPosts(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load posts");
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchPostsByAuthor = useCallback(async (authorId: string) => {
		setLoading(true);
		setError(null);
		try {
			const data = await postService.getPostsByAuthor(authorId);
			setPosts(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load posts");
		} finally {
			setLoading(false);
		}
	}, []);

	const handleLike = useCallback(async (postId: string, userId: string) => {
		try {
			const updatedPost = await postService.likePost(postId, userId);
			setPosts((prevPosts) =>
				prevPosts.map((p) => (p.id === postId ? updatedPost : p)),
			);
		} catch (err) {
			console.error("Failed to like post:", err);
		}
	}, []);

	const handleAddComment = useCallback(
		async (
			postId: string,
			content: string,
			authorId: string,
			authorName: string,
			authorRole: "customer" | "professional" | "admin",
		) => {
			try {
				const newComment = await postService.addComment(postId, {
					postId,
					content,
					authorId,
					authorName,
					authorRole,
				});
				setPosts((prevPosts) =>
					prevPosts.map((p) => {
						if (p.id === postId) {
							return {
								...p,
								comments: [...p.comments, newComment],
							};
						}
						return p;
					}),
				);
				return newComment;
			} catch (err) {
				console.error("Failed to add comment:", err);
				throw err;
			}
		},
		[],
	);

	const handleCreatePost = useCallback(
		async (postData: Omit<Post, "id" | "likes" | "comments" | "createdAt">) => {
			setLoading(true);
			setError(null);
			try {
				const newPost = await postService.createPost(postData);
				setPosts((prevPosts) => [newPost, ...prevPosts]);
				return newPost;
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to create post");
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	const handleDeletePost = useCallback(async (postId: string) => {
		try {
			await postService.deletePost(postId);
			setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));
		} catch (err) {
			console.error("Failed to delete post:", err);
		}
	}, []);

	return {
		posts,
		loading,
		error,
		fetchPosts,
		fetchPostsByAuthor,
		handleLike,
		handleAddComment,
		handleCreatePost,
		handleDeletePost,
	};
}
