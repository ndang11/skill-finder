import type { Professional } from "@/types/professional.types";
import { apiRequest } from "./api";

export const professionalService = {
	getProfile: async (id: string): Promise<Professional> => {
		return apiRequest<Professional>(
			`/professionals/${encodeURIComponent(id)}`,
			{
				method: "GET",
			},
		);
	},
	getProfessionals: async (): Promise<Professional[]> => {
		return apiRequest<Professional[]>("/professionals", {
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
