// services/category.service.ts
import { apiRequest } from "./api";

export interface SkillCategoryDto {
	id: string;
	name: string;
	nameFr?: string;
	slug: string;
	sector?: string;
	source?: string;
}

export const categoryService = {
	getCategories: async (): Promise<SkillCategoryDto[]> => {
		try {
			return await apiRequest<SkillCategoryDto[]>("/categories", {
				method: "GET",
			});
		} catch (error) {
			console.warn(
				"Failed to fetch categories from API, using local fallback",
				error,
			);
			return [];
		}
	},
};
