"use client";

import {
	Camera,
	Flame,
	Hammer,
	MapPin,
	MoreHorizontal,
	Palette,
	Scissors,
	Search,
	Settings,
	Shirt,
	SlidersHorizontal,
	Snowflake,
	Star,
	Sun,
	UserCheck,
	Wrench,
	X,
	Zap,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ProfessionalCard from "@/components/professional/ProfessionalCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { CATEGORY_ICONS, SKILL_CATEGORIES } from "@/constants/categories";
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

	// Search input states
	const [query, setQuery] = useState("");
	const [searchMode, setSearchMode] = useState<"all" | "skill" | "name">("all");
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
	const [minRating, setMinRating] = useState<number | null>(null);
	const [nearbyOnly, setNearbyOnly] = useState(false);
	const [showFilters, setShowFilters] = useState(false);

	// Synchronize query parameters on load
	useEffect(() => {
		const cat = searchParams.get("category");
		const loc = searchParams.get("location");
		const q = searchParams.get("q");

		setSelectedCategory(cat);
		setSelectedLocation(loc);
		setQuery(q ?? "");
	}, [searchParams]);

	// Fetch data from server when filters change
	useEffect(() => {
		const timer = setTimeout(() => {
			fetchProfessionals({
				category: selectedCategory ?? undefined,
				location: selectedLocation ?? undefined,
				query: query.trim() || undefined,
				minRating: minRating ?? undefined,
			});
		}, 300);

		return () => clearTimeout(timer);
	}, [
		selectedCategory,
		selectedLocation,
		minRating,
		query,
		fetchProfessionals,
	]);

	// Client-side filtering for Skill Match, Location Match & Search Mode
	const filteredProfessionals = useMemo(() => {
		let result = professionals;

		// 1. Location / Nearby Filter Match
		if (selectedLocation) {
			const locLower = selectedLocation.toLowerCase();
			result = result.filter((p) =>
				p.location?.toLowerCase().includes(locLower),
			);
		}

		if (!query.trim()) return result;

		const lowerQuery = query.toLowerCase();

		// 2. Search Mode Filter (By Name vs. By Skill vs. All)
		return result.filter((p) => {
			const matchesName = p.fullName?.toLowerCase().includes(lowerQuery);
			const matchesCategory = p.category?.toLowerCase().includes(lowerQuery);
			const matchesSkill = p.skills?.some((s) =>
				s.toLowerCase().includes(lowerQuery),
			);

			if (searchMode === "name") {
				return matchesName;
			}

			if (searchMode === "skill") {
				return matchesCategory || matchesSkill;
			}

			// Default 'all'
			return matchesName || matchesCategory || matchesSkill;
		});
	}, [professionals, query, selectedLocation, searchMode]);

	const hasActiveFilters =
		selectedCategory ||
		selectedLocation ||
		minRating !== null ||
		query.trim() !== "" ||
		nearbyOnly;

	const clearFilters = () => {
		setQuery("");
		setSearchMode("all");
		setSelectedCategory(null);
		setSelectedLocation(null);
		setMinRating(null);
		setNearbyOnly(false);
	};

	return (
		<div className="min-h-screen bg-gray-50/50">
			{/* Navigation Header */}
			<header className="border-b border-gray-200 bg-white sticky top-0 z-20">
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

			{/* Hero & Search Header */}
			<section className="border-b border-gray-200 bg-white shadow-xs">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
					<div className="max-w-3xl mx-auto text-center mb-6">
						<h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
							Find Skills & Experts Near You
						</h1>
						<p className="mt-2 text-sm sm:text-base text-gray-500">
							Search by professional name or skill, and match with local experts
							in your region.
						</p>
					</div>

					<div className="max-w-4xl mx-auto space-y-3">
						{/* Search Mode Bar */}
						<div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-600">
							<span className="text-gray-400">Search Mode:</span>
							<button
								type="button"
								onClick={() => setSearchMode("all")}
								className={cn(
									"px-3 py-1 rounded-full border transition-all flex items-center gap-1",
									searchMode === "all"
										? "bg-primary-500 text-white border-primary-500 shadow-xs"
										: "bg-gray-100 text-gray-600 hover:bg-gray-200 border-transparent",
								)}
							>
								<Search className="h-3 w-3" /> All Matches
							</button>
							<button
								type="button"
								onClick={() => setSearchMode("skill")}
								className={cn(
									"px-3 py-1 rounded-full border transition-all flex items-center gap-1",
									searchMode === "skill"
										? "bg-primary-500 text-white border-primary-500 shadow-xs"
										: "bg-gray-100 text-gray-600 hover:bg-gray-200 border-transparent",
								)}
							>
								<Wrench className="h-3 w-3" /> By Skill
							</button>
							<button
								type="button"
								onClick={() => setSearchMode("name")}
								className={cn(
									"px-3 py-1 rounded-full border transition-all flex items-center gap-1",
									searchMode === "name"
										? "bg-primary-500 text-white border-primary-500 shadow-xs"
										: "bg-gray-100 text-gray-600 hover:bg-gray-200 border-transparent",
								)}
							>
								<UserCheck className="h-3 w-3" /> By Name
							</button>
						</div>

						{/* Combined Input Fields */}
						<div className="flex flex-col md:flex-row items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-2 focus-within:border-primary-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-primary-100 transition-all shadow-sm">
							{/* Search Input */}
							<div className="flex items-center gap-2 flex-1 w-full px-3 py-2">
								<Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
								<input
									type="text"
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									placeholder={
										searchMode === "skill"
											? "Type a skill (e.g. NestJS, Plumbing, React)..."
											: searchMode === "name"
												? "Type professional's name..."
												: "Search by name, skill, or keyword..."
									}
									className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none min-w-0"
								/>
								{query && (
									<button
										type="button"
										onClick={() => setQuery("")}
										className="rounded-lg p-1 text-gray-400 hover:text-gray-600"
									>
										<X className="h-4 w-4" />
									</button>
								)}
							</div>

							<div className="hidden md:block h-8 w-[1px] bg-gray-200" />

							{/* Location Selector */}
							<div className="flex items-center gap-2 w-full md:w-auto px-3 py-2 bg-white md:bg-transparent rounded-xl border md:border-none border-gray-200">
								<MapPin className="h-4 w-4 text-primary-500 flex-shrink-0" />
								<select
									value={selectedLocation ?? ""}
									onChange={(e) => {
										const value = e.target.value || null;
										setSelectedLocation(value);
										if (value) setNearbyOnly(true);
									}}
									className="bg-transparent text-xs font-semibold text-gray-700 outline-none cursor-pointer w-full md:w-auto"
								>
									<option value="">All Regions (Cameroon)</option>
									{CAMEROON_REGIONS.flatMap((region) =>
										region.cities.map((city) => (
											<option key={city.id} value={city.name}>
												{city.name} ({region.name})
											</option>
										)),
									)}
								</select>
							</div>

							{/* Filter Toggle Button */}
							<button
								type="button"
								onClick={() => setShowFilters(!showFilters)}
								className={cn(
									"w-full md:w-auto flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all border flex-shrink-0",
									showFilters || hasActiveFilters
										? "border-primary-500 bg-primary-50 text-primary-700"
										: "border-gray-200 bg-white text-gray-600 hover:bg-gray-100",
								)}
							>
								<SlidersHorizontal className="h-3.5 w-3.5" />
								Filters
							</button>
						</div>

						{/* Filter Drawer */}
						{showFilters && (
							<div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-5 text-left animate-in fade-in slide-in-from-top-2 duration-200">
								{/* Categories */}
								<div>
									<p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
										Skill Category
									</p>
									<div className="flex flex-wrap gap-2">
										<button
											type="button"
											onClick={() => setSelectedCategory(null)}
											className={cn(
												"text-xs font-semibold px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5",
												!selectedCategory
													? "bg-primary-500 text-white border-primary-500 shadow-xs"
													: "bg-white text-gray-600 border-gray-200 hover:border-primary-300",
											)}
										>
											<SlidersHorizontal className="h-3.5 w-3.5" />
											All Categories
										</button>
										{SKILL_CATEGORIES.map((cat) => {
											const IconComponent =
												CATEGORY_ICONS[cat] || CATEGORY_ICONS.Other;
											return (
												<button
													key={cat}
													type="button"
													onClick={() => setSelectedCategory(cat)}
													className={cn(
														"text-xs font-semibold px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5",
														selectedCategory === cat
															? "bg-primary-500 text-white border-primary-500 shadow-xs"
															: "bg-white text-gray-600 border-gray-200 hover:border-primary-300",
													)}
												>
													<IconComponent className="h-3.5 w-3.5" />
													{cat}
												</button>
											);
										})}
									</div>
								</div>

								{/* Minimum Rating */}
								<div>
									<p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
										Rating
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
														? "bg-primary-500 text-white border-primary-500 shadow-xs"
														: "bg-white text-gray-600 border-gray-200 hover:border-primary-300",
												)}
											>
												<Star className="h-3 w-3 fill-amber-500 text-amber-500" />
												{rating}+ Stars
											</button>
										))}
									</div>
								</div>

								{hasActiveFilters && (
									<div className="pt-2 border-t border-gray-100 flex items-center justify-between">
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

			{/* Results Grid */}
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
							{selectedLocation ? ` in "${selectedLocation}"` : ""}
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
					<div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center max-w-md mx-auto flex flex-col items-center justify-center">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-gray-400 mb-4 border border-gray-100">
							<Search className="h-6 w-6" />
						</div>
						<p className="text-base font-bold text-gray-900">
							No professionals found
						</p>
						<p className="mt-1 text-sm text-gray-500">
							Try searching for another skill or clearing location filters.
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
