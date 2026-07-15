export interface Professional {
	id: string;
	userId: string;
	category: string;
	location: string;
	bio?: string;
	skills: string[];
	averageRating: number;
	completedJobs: number;
	whatsappNumber?: string;
}
