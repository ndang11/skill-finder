// user types
export type UserRole = "customer" | "professional" | "admin";

export interface User {
	id: string;
	fullname: string;
	username: string;
	email?: string;
	phoneNumber: string;
	role: UserRole;
	avatarUrl?: string;
	isVerifiedProfessional: boolean;
	createdAt: string;
}

export interface AuthResponse {
	accessToken: string;
	user: User;
}
