import { apiRequest } from "./api";

interface CloudinarySignatureResponse {
	signature: string;
	timestamp: number;
	apiKey: string;
	cloudName: string;
}

export const uploadService = {
	/**
	 * Uploads an image file directly to Cloudinary using a secure signature fetched from the backend.
	 *
	 * @param file The image File object to upload.
	 * @param folder The destination folder in Cloudinary. Must match the folder signed by the backend.
	 * @returns The secure URL of the uploaded image.
	 */
	async handleImageUpload(file: File, folder = "avatars"): Promise<string> {
		try {
			// 1. Fetch the secure signature parameters from the NestJS API.
			// Using apiRequest automatically handles setting the Supabase Authorization JWT and the correct API_BASE_URL.
			const { signature, timestamp, apiKey, cloudName } =
				await apiRequest<CloudinarySignatureResponse>(
					`/cloudinary/signature?folder=${encodeURIComponent(folder)}`,
					{
						method: "GET",
					},
				);

			if (!signature || !timestamp || !apiKey || !cloudName) {
				throw new Error("Invalid signature response from the backend");
			}

			// 2. Prepare the multipart form data payload for Cloudinary.
			// NOTE: The 'folder' parameter must match exactly what was signed by the backend.
			const formData = new FormData();
			formData.append("file", file);
			formData.append("api_key", apiKey);
			formData.append("timestamp", timestamp.toString());
			formData.append("signature", signature);
			formData.append("folder", folder);

			// 3. Post directly to Cloudinary's secure API endpoint.
			const uploadResponse = await fetch(
				`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
				{
					method: "POST",
					body: formData,
				},
			);

			const result = await uploadResponse.json();

			if (!uploadResponse.ok) {
				throw new Error(
					result.error?.message || "Failed to upload image to Cloudinary",
				);
			}

			// This secure CDN URL is what you will save in your public.users profile table!
			return result.secure_url;
		} catch (error) {
			console.error("Error in handleImageUpload:", error);
			throw error instanceof Error ? error : new Error("Image upload failed");
		}
	},
};
