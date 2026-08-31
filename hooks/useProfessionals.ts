import { useCallback, useEffect, useState } from "react";
import { professionalService } from "@/services/professional.service";
import type { Professional } from "@/types/professional.types";

export function useProfessionals() {
	const [professionals, setProfessionals] = useState<Professional[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchProfessionals = useCallback(
		async (filters?: {
			category?: string;
			location?: string;
			query?: string;
			minRating?: number;
		}) => {
			setLoading(true);
			setError(null);
			try {
				const data = await professionalService.getProfessionals(filters);
				setProfessionals(data || []);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to load professionals",
				);
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	useEffect(() => {
		fetchProfessionals();
	}, [fetchProfessionals]);

	return {
		professionals,
		loading,
		error,
		fetchProfessionals,
	};
}
