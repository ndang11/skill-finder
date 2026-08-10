// services/skill.service.ts
import { apiRequest } from "./api";

export interface SkillItem {
	id: string;
	title: string;
	description: string;
	category: string;
	price?: number | null;
	providerId: string;
	providerName: string;
	providerAvatar?: string | null;
	providerLocation: string;
	providerWhatsapp?: string;
	averageRating: number;
	createdAt: string;
}

export const skillService = {
	getAllSkills: async (): Promise<SkillItem[]> => {
		try {
			return await apiRequest<SkillItem[]>("/skills", {
				method: "GET",
			});
		} catch (error) {
			console.warn("Failed to fetch skills from API", error);
			return [];
		}
	},

	getSkillsByCategory: async (category: string): Promise<SkillItem[]> => {
		try {
			return await apiRequest<SkillItem[]>(
				`/skills/category/${encodeURIComponent(category)}`,
				{
					method: "GET",
				},
			);
		} catch (error) {
			console.warn(`Failed to fetch skills for category ${category}`, error);
			return [];
		}
	},

	getSkillById: async (id: string): Promise<SkillItem | null> => {
		try {
			return await apiRequest<SkillItem>(`/skills/${encodeURIComponent(id)}`, {
				method: "GET",
			});
		} catch (error) {
			console.warn(`Failed to fetch skill ${id}`, error);
			return null;
		}
	},
};
