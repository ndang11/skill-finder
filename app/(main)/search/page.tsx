// app/(main)/search/page.tsx
"use client";

import { Search, SlidersHorizontal, Star, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ProfessionalCard from "@/components/professional/ProfessionalCard";
import { Skeleton } from "@/components/ui/Skeleton";
import {
	SKILL_CATEGORIES,
	SKILL_CATEGORY_EMOJIS,
} from "@/constants/categories";
import { CAMEROON_REGIONS } from "@/constants/regions";
import { useProfessionals } from "@/hooks/useProfessionals";
import { cn } from "@/utils/cn";

function ProfessionalCardSkeletonGrid() {
	return (
		<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
				<div
					key={`skeleton-card-${n}`}
					className="rounded-2xl border border-gray-200 bg-white p-5 space-y-4"
				>
					<div className="flex items-start gap-4">
						<Skeleton className="h-14 w-14 rounded-xl flex-shrink-0" />
						<div className="flex-1 space-y-3">
							<Skeleton className="h-5 w-32" />
							<Skeleton className="h-3 w-48" />
							<Skeleton className="h-3 w-40" />
						</div>
					</div>
					<div className="flex gap-2">
						<Skeleton className="h-6 w-16 rounded-lg" />
						<Skeleton className="h-6 w-20 rounded-lg" />
						<Skeleton className="h-6 w-14 rounded-lg" />
					</div>
					<div className="flex items-center justify-between pt-2">
						<Skeleton className="h-4 w-12" />
						<Skeleton className="h-4 w-24" />
					</div>
				</div>
			))}
		</div>
	);
}

export default function SearchPage() {
	const searchParams = useSearchParams();
	const { professionals, loading, error, fetchProfessionals } =
		useProfessionals();

	const [query, setQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
	const [minRating, setMinRating] = useState<number | null>(null);
	const [showFilters, setShowFilters] = useState(false);

	useEffect(() => {
		const cat = searchParams.get("category");
		const loc = searchParams.get("location");
		const q = searchParams.get("q");

		setSelectedCategory(cat);
		setSelectedLocation(loc);
		setQuery(q ?? "");
	}, [searchParams]);

	useEffect(() => {
		fetchProfessionals({
			category: selectedCategory ?? undefined,
			location: selectedLocation ?? undefined,
			query: query || undefined,
			minRating: minRating ?? undefined,
		});
	}, [
		selectedCategory,
		selectedLocation,
		minRating,
		fetchProfessionals,
		query,
	]);

	const filteredProfessionals = useMemo(() => {
		if (!query.trim()) return professionals;
		const lower = query.toLowerCase();
		return professionals.filter(
			(p) =>
				p.fullName?.toLowerCase().includes(lower) ||
				p.category?.toLowerCase().includes(lower) ||
				p.skills?.some((s) => s.toLowerCase().includes(lower)),
		);
	}, [professionals, query]);

	const hasActiveFilters =
		selectedCategory || selectedLocation || minRating !== null || query;

	const clearFilters = () => {
		setQuery("");
		setSelectedCategory(null);
		setSelectedLocation(null);
		setMinRating(null);
	};

	return (
		<div className="min-h-screen bg-gray-50/50">
			{/* Header */}
			<header className="border-b border-gray-200 bg-white">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-green-600 text-sm font-black text-white">
								S
							</div>
							<span className="text-lg font-black tracking-tight text-gray-900">
								Skill<span className="text-primary-500">Finder</span>
							</span>
						</div>
						<nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
							<a href="/" className="hover:text-primary-600 transition-colors">
								Home
							</a>
							<a
								href="/categories"
								className="hover:text-primary-600 transition-colors"
							>
								Categories
							</a>
							<a href="/search" className="text-primary-600 font-semibold">
								Find Professionals
							</a>
						</nav>
					</div>
				</div>
			</header>

			{/* Hero / Search Section */}
			<section className="border-b border-gray-200 bg-white">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
					<div className="max-w-3xl mx-auto text-center mb-8">
						<h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
							Find Trusted Professionals
						</h1>
						<p className="mt-3 text-base text-gray-500">
							Browse verified mechanics, electricians, plumbers, and more across
							Cameroon.
						</p>
					</div>

					<div className="max-w-2xl mx-auto">
						<div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-primary-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-primary-100 transition-all">
							<Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
							<input
								type="text"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Search by name, skill, or keyword..."
								className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none min-w-0"
							/>
							{query && (
								<button
									type="button"
									onClick={() => setQuery("")}
									className="flex-shrink-0 rounded-lg p-1 text-gray-400 hover:text-gray-600 transition-colors"
								>
									<X className="h-4 w-4" />
								</button>
							)}
							<button
								type="button"
								onClick={() => setShowFilters(!showFilters)}
								className={cn(
									"flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all border flex-shrink-0",
									showFilters || hasActiveFilters
										? "border-primary-500 bg-primary-50 text-primary-700"
										: "border-gray-200 bg-white text-gray-600 hover:bg-gray-100",
								)}
							>
								<SlidersHorizontal className="h-3.5 w-3.5" />
								Filters
							</button>
						</div>

						{/* Filters row */}
						{showFilters && (
							<div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-5 text-left">
								{/* Category */}
								<div>
									<p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
										Category
									</p>
									<div className="flex flex-wrap gap-2">
										<button
											type="button"
											onClick={() => setSelectedCategory(null)}
											className={cn(
												"text-xs font-semibold px-3 py-1.5 rounded-full border transition-all",
												!selectedCategory
													? "bg-primary-500 text-white border-primary-500 shadow-sm shadow-primary-500/20"
													: "bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-600",
											)}
										>
											All Categories
										</button>
										{SKILL_CATEGORIES.map((cat) => (
											<button
												key={cat}
												type="button"
												onClick={() => setSelectedCategory(cat)}
												className={cn(
													"text-xs font-semibold px-3 py-1.5 rounded-full border transition-all",
													selectedCategory === cat
														? "bg-primary-500 text-white border-primary-500 shadow-sm shadow-primary-500/20"
														: "bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-600",
												)}
											>
												{SKILL_CATEGORY_EMOJIS[cat] ?? "🛠️"} {cat}
											</button>
										))}
									</div>
								</div>

								{/* Location */}
								<div>
									<p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
										Location
									</p>
									<div className="flex flex-wrap gap-2">
										<button
											type="button"
											onClick={() => setSelectedLocation(null)}
											className={cn(
												"text-xs font-semibold px-3 py-1.5 rounded-full border transition-all",
												!selectedLocation
													? "bg-primary-500 text-white border-primary-500 shadow-sm shadow-primary-500/20"
													: "bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-600",
											)}
										>
											All Locations
										</button>
										{CAMEROON_REGIONS.flatMap((region) =>
											region.cities.map((city) => (
												<button
													key={city.id}
													type="button"
													onClick={() => setSelectedLocation(city.name)}
													className={cn(
														"text-xs font-semibold px-3 py-1.5 rounded-full border transition-all",
														selectedLocation === city.name
															? "bg-primary-500 text-white border-primary-500 shadow-sm shadow-primary-500/20"
															: "bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-600",
													)}
												>
													{city.name}
												</button>
											)),
										)}
									</div>
								</div>

								{/* Rating */}
								<div>
									<p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
										Minimum Rating
									</p>
									<div className="flex flex-wrap gap-2">
										{[4, 3, 2, 1].map((rating) => (
											<button
												key={rating}
												type="button"
												onClick={() =>
													setMinRating(minRating === rating ? null : rating)
												}
												className={cn(
													"text-xs font-semibold px-3 py-1.5 rounded-full border transition-all flex items-center gap-1",
													minRating === rating
														? "bg-primary-500 text-white border-primary-500 shadow-sm shadow-primary-500/20"
														: "bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-600",
												)}
											>
												<Star className="h-3 w-3 fill-amber-500 text-amber-500" />
												{rating}+
											</button>
										))}
									</div>
								</div>

								{hasActiveFilters && (
									<div className="pt-2 border-t border-gray-100">
										<button
											type="button"
											onClick={clearFilters}
											className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
										>
											Clear all filters
										</button>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</section>

			{/* Results Section */}
			<main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
				{error && (
					<div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
						{error}
					</div>
				)}

				{!loading && (
					<div className="mb-6 flex items-center justify-between">
						<p className="text-sm font-semibold text-gray-600">
							{filteredProfessionals.length}{" "}
							{filteredProfessionals.length === 1
								? "professional"
								: "professionals"}{" "}
							found
						</p>
						{hasActiveFilters && (
							<button
								type="button"
								onClick={clearFilters}
								className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
							>
								Reset filters
							</button>
						)}
					</div>
				)}

				{loading ? (
					<ProfessionalCardSkeletonGrid />
				) : filteredProfessionals.length === 0 ? (
					<div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
						<p className="text-4xl mb-3">🔍</p>
						<p className="text-base font-bold text-gray-900">
							No professionals found
						</p>
						<p className="mt-1 text-sm text-gray-500">
							Try adjusting your search terms or clearing some filters.
						</p>
						<button
							type="button"
							onClick={clearFilters}
							className="mt-4 rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
						>
							Clear all filters
						</button>
					</div>
				) : (
					<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
						{filteredProfessionals.map((professional) => (
							<ProfessionalCard
								key={professional.id}
								professional={professional}
							/>
						))}
					</div>
				)}
			</main>
		</div>
	);
}
