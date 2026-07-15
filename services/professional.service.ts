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
};
