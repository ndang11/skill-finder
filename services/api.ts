import { supabase } from "@/utils/supabase/client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function apiRequest<T>(
	endpoint: string,
	options: RequestInit = {},
): Promise<T> {
	// Get the current user's session from Supabase to retrieve the JWT token
	const {
		data: { session },
	} = await supabase.auth.getSession();

	// Prepare headers with Authorization token if available
	const headers = new Headers(options.headers);
	if (session?.access_token) {
		headers.set("Authorization", `Bearer ${session.access_token}`);
	}

	// Attach user language for backend localization
	if (typeof window !== "undefined") {
		const currentLang = localStorage.getItem("skill_finder_lang") || "en";
		headers.set("Accept-Language", currentLang);
	}

	if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
		headers.set("Content-Type", "application/json");
	}

	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		cache: "no-store",
		...options,
		headers,
	});

	if (!response.ok) {
		const errorText = await response.text();
		let errorMessage = "An error occurred";
		try {
			const parsed = JSON.parse(errorText);
			errorMessage = parsed.message || errorMessage;
		} catch {
			errorMessage = errorText || errorMessage;
		}
		throw new Error(errorMessage);
	}

	if (response.status === 204) {
		return {} as T;
	}

	return response.json();
}
