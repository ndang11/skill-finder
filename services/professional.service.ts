import type { Professional } from "@/types/professional.types";
import { apiRequest } from "./api";

interface ProfessionalFilters {
	category?: string;
	location?: string;
	query?: string;
	minRating?: number;
}

export const professionalService = {
	getProfile: async (id: string): Promise<Professional> => {
		return apiRequest<Professional>(
			`/professionals/${encodeURIComponent(id)}`,
			{
				method: "GET",
			},
		);
	},
	getProfessionals: async (
		filters?: ProfessionalFilters,
	): Promise<Professional[]> => {
		const params = new URLSearchParams();
		if (filters?.category) params.set("category", filters.category);
		if (filters?.location) params.set("location", filters.location);
		if (filters?.query) params.set("query", filters.query);
		if (filters?.minRating !== undefined)
			params.set("minRating", String(filters.minRating));
		const queryString = params.toString();
		const endpoint = queryString
			? `/professionals?${queryString}`
			: "/professionals";
		return apiRequest<Professional[]>(endpoint, {
			method: "GET",
		});
	},
	updateProfile: async (data: Partial<Professional>): Promise<Professional> => {
		return apiRequest<Professional>("/professionals/profile", {
			method: "PATCH",
			body: JSON.stringify(data),
		});
	},
};
