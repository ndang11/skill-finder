export interface Professional {
	id: string;
	userId: string;
	fullName?: string;
	avatarUrl?: string;
	category: string;
	location: string;
	bio?: string;
	skills: string[];
	averageRating: number;
	completedJobs: number;
	whatsappNumber?: string;
}
