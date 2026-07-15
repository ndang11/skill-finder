// components/layout/DashboardTopBar.tsx
"use client";

import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import {
	SKILL_CATEGORIES,
	SKILL_CATEGORY_EMOJIS,
} from "@/constants/categories";
import { CAMEROON_REGIONS } from "@/constants/regions";
import { useDebounce } from "@/hooks/useDebounce";
import { supabase } from "@/utils/supabase/client";

interface SearchResult {
	type: "category" | "professional" | "page";
	label: string;
	sublabel?: string;
	emoji?: string;
	href: string;
}

const STATIC_RESULTS: SearchResult[] = [
	...SKILL_CATEGORIES.map((cat) => ({
		type: "category" as const,
		label: cat,
		sublabel: "Browse professionals",
		emoji: SKILL_CATEGORY_EMOJIS[cat] ?? "🛠️",
		href: `/search?category=${encodeURIComponent(cat)}`,
	})),
	{
		type: "page",
		label: "Find Professionals",
		sublabel: "Search & filter",
		emoji: "🔍",
		href: "/search",
	},
	{
		type: "page",
		label: "Feed",
		sublabel: "Recent updates",
		emoji: "📰",
		href: "/feed",
	},
	{
		type: "page",
		label: "My Profile",
		sublabel: "Edit your details",
		emoji: "👤",
		href: "/dashboard/professional/profile",
	},
	{
		type: "page",
		label: "Portfolio",
		sublabel: "Manage work showcase",
		emoji: "🖼️",
		href: "/dashboard/professional/portfolio",
	},
	{
		type: "page",
		label: "My Reviews",
		sublabel: "Customer feedback",
		emoji: "⭐",
		href: "/dashboard/customer/reviews",
	},
	{
		type: "page",
		label: "Bookmarks",
		sublabel: "Saved professionals",
		emoji: "🔖",
		href: "/dashboard/customer/bookmarks",
	},
	{
		type: "page",
		label: "Settings",
		sublabel: "Account settings",
		emoji: "⚙️",
		href: "/dashboard/professional/settings",
	},
];

export default function DashboardTopBar() {
	const router = useRouter();
	const [query, setQuery] = React.useState("");
	const [selectedCity, setSelectedCity] = React.useState<string>("");
	const [isFocused, setIsFocused] = React.useState(false);
	const [showLocDropdown, setShowLocDropdown] = React.useState(false);
	const [locSearch, setLocSearch] = React.useState("");
	const [selectedIndex, setSelectedIndex] = React.useState(-1);
	const [user, setUser] = React.useState<User | null>(null);

	const inputRef = React.useRef<HTMLInputElement>(null);
	const containerRef = React.useRef<HTMLDivElement>(null);
	const locContainerRef = React.useRef<HTMLDivElement>(null);
	const debouncedQuery = useDebounce(query, 150);

	const results = React.useMemo<SearchResult[]>(() => {
		if (!debouncedQuery.trim()) return [];
		const q = debouncedQuery.toLowerCase();
		return STATIC_RESULTS.filter(
			(r) =>
				r.label.toLowerCase().includes(q) ||
				(r.sublabel ?? "").toLowerCase().includes(q),
		).slice(0, 7);
	}, [debouncedQuery]);

	const showDropdown =
		isFocused &&
		(results.length > 0 || (query.trim().length > 0 && results.length === 0));

	// Filtered cities list based on search inside the location popover
	const filteredRegions = React.useMemo(() => {
		if (!locSearch.trim()) return CAMEROON_REGIONS;
		const searchLower = locSearch.toLowerCase();
		return CAMEROON_REGIONS.map((region) => {
			const matchingCities = region.cities.filter((city) =>
				city.name.toLowerCase().includes(searchLower),
			);
			if (
				matchingCities.length > 0 ||
				region.name.toLowerCase().includes(searchLower)
			) {
				return {
					...region,
					cities: matchingCities.length > 0 ? matchingCities : region.cities,
				};
			}
			return null;
		}).filter(Boolean) as typeof CAMEROON_REGIONS;
	}, [locSearch]);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (!showDropdown) return;
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setSelectedIndex((i) => Math.max(i - 1, -1));
		} else if (e.key === "Enter") {
			e.preventDefault();
			if (selectedIndex >= 0 && results[selectedIndex]) {
				navigate(results[selectedIndex].href);
			} else if (query.trim()) {
				navigate(`/search?q=${encodeURIComponent(query.trim())}`);
			}
		} else if (e.key === "Escape") {
			setIsFocused(false);
			inputRef.current?.blur();
		}
	};

	const navigate = (href: string) => {
		setQuery("");
		setIsFocused(false);
		setSelectedIndex(-1);

		let finalHref = href;
		if (selectedCity) {
			const sep = finalHref.includes("?") ? "&" : "?";
			finalHref = `${finalHref}${sep}location=${encodeURIComponent(selectedCity)}`;
		}
		router.push(finalHref);
	};

	// Click outside to close both dropdowns
	React.useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			) {
				setIsFocused(false);
			}
			if (
				locContainerRef.current &&
				!locContainerRef.current.contains(e.target as Node)
			) {
				setShowLocDropdown(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Keyboard Ctrl+K / Cmd+K handler
	React.useEffect(() => {
		function handleGlobalKeyDown(e: KeyboardEvent) {
			if ((e.ctrlKey || e.metaKey) && e.key === "k") {
				e.preventDefault();
				inputRef.current?.focus();
				setIsFocused(true);
			}
		}
		document.addEventListener("keydown", handleGlobalKeyDown);
		return () => document.removeEventListener("keydown", handleGlobalKeyDown);
	}, []);

	React.useEffect(() => {
		supabase.auth.getUser().then(({ data }) => {
			setUser(data.user);
		});
	}, []);

	const typeColors: Record<string, string> = {
		category: "bg-primary-50 text-primary-700",
		professional: "bg-green-50 text-green-700",
		page: "bg-gray-100 text-gray-600",
	};

	const typeLabels: Record<string, string> = {
		category: "Category",
		professional: "Professional",
		page: "Page",
	};

	return (
		<header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur-md">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
				<div className="flex h-16 items-center gap-4 justify-between">
					{/* Combined Search + Location Control */}
					<div ref={containerRef} className="relative flex-1 max-w-xl">
						{/* Combined Outer container */}
						<div
							className={`flex items-center gap-2 rounded-2xl border bg-gray-50 px-3.5 py-1.5 transition-all duration-200 ${
								isFocused
									? "border-primary-400 bg-white ring-4 ring-primary-100 shadow-sm"
									: "border-gray-200 hover:border-gray-300"
							}`}
						>
							{/* Left Part: Text input search */}
							<div className="flex-1 flex items-center gap-2 min-w-0">
								<svg
									className={`w-4 h-4 flex-shrink-0 transition-colors ${isFocused ? "text-primary-500" : "text-gray-400"}`}
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2.5}
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z"
									/>
								</svg>

								<input
									ref={inputRef}
									id="dashboard-search"
									type="text"
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									onFocus={() => {
										setIsFocused(true);
										setShowLocDropdown(false);
									}}
									onKeyDown={handleKeyDown}
									placeholder="Search professionals, skills..."
									autoComplete="off"
									className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none min-w-0"
								/>

								{query && (
									<button
										type="button"
										onClick={() => {
											setQuery("");
											inputRef.current?.focus();
										}}
										className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
										aria-label="Clear search"
									>
										<svg
											className="w-3.5 h-3.5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth={2}
											aria-hidden="true"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</button>
								)}
							</div>

							{/* Split Divider line */}
							<div className="h-5 w-px bg-gray-200 mx-1 flex-shrink-0" />

							{/* Right Part: Location Selector popover trigger */}
							<div ref={locContainerRef} className="relative flex-shrink-0">
								<button
									type="button"
									onClick={() => {
										setShowLocDropdown(!showLocDropdown);
										setIsFocused(false);
									}}
									className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all max-w-[130px] ${
										selectedCity
											? "bg-primary-50 text-primary-700"
											: "text-gray-500 hover:text-gray-900"
									}`}
								>
									<svg
										className="w-3.5 h-3.5 flex-shrink-0 text-primary-500"
										fill="currentColor"
										viewBox="0 0 20 20"
										aria-hidden="true"
									>
										<path
											fillRule="evenodd"
											d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
											clipRule="evenodd"
										/>
									</svg>
									<span className="truncate">{selectedCity || "Cameroon"}</span>
									{/* biome-ignore lint/a11y/noSvgWithoutTitle: decorative dropdown arrow icon */}
									<svg
										className="w-3 h-3 text-gray-400 flex-shrink-0"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={2.5}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</button>

								{/* Location Dropdown Popover */}
								{showLocDropdown && (
									<div className="absolute right-0 mt-3.5 w-64 rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-900/10 overflow-hidden z-50">
										<div className="p-3 border-b border-gray-100 bg-gray-50/50">
											<input
												type="text"
												value={locSearch}
												onChange={(e) => setLocSearch(e.target.value)}
												placeholder="Filter city..."
												className="w-full text-xs bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
											/>
										</div>

										<div className="max-h-60 overflow-y-auto py-1">
											<button
												type="button"
												onClick={() => {
													setSelectedCity("");
													setShowLocDropdown(false);
												}}
												className="w-full text-left px-4 py-2 text-xs font-bold text-primary-600 hover:bg-gray-50 flex items-center justify-between"
											>
												<span>🇨🇲 All Cameroon</span>
												{!selectedCity && <span>✓</span>}
											</button>

											{filteredRegions.map((region) => (
												<div key={region.id} className="mt-1">
													<p className="px-4 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/80">
														{region.name}
													</p>
													<div className="space-y-0.5 mt-0.5">
														{region.cities.map((city) => (
															<button
																key={city.id}
																type="button"
																onClick={() => {
																	setSelectedCity(city.name);
																	setShowLocDropdown(false);
																}}
																className={`w-full text-left px-6 py-1.5 text-xs transition-colors flex items-center justify-between ${
																	selectedCity === city.name
																		? "bg-primary-50 text-primary-700 font-bold"
																		: "text-gray-600 hover:bg-gray-50"
																}`}
															>
																<span>{city.name}</span>
																{selectedCity === city.name && <span>✓</span>}
															</button>
														))}
													</div>
												</div>
											))}
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Autocomplete Search suggestions dropdown */}
						{showDropdown && (
							<div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-900/10 overflow-hidden z-50">
								{results.length > 0 ? (
									<>
										<div className="px-3 pt-3 pb-1">
											<p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
												{results.length} result{results.length !== 1 ? "s" : ""}
											</p>
										</div>
										<div role="listbox" className="pb-2">
											{results.map((result, idx) => {
												return (
													<div
														key={`${result.type}-${result.href}`}
														role="option"
														aria-selected={selectedIndex === idx}
														tabIndex={-1}
													>
														<button
															type="button"
															onMouseEnter={() => setSelectedIndex(idx)}
															onClick={() => navigate(result.href)}
															className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors text-left ${
																selectedIndex === idx
																	? "bg-primary-50"
																	: "hover:bg-gray-50"
															}`}
														>
															<span className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-xl bg-gray-100 text-base">
																{result.emoji}
															</span>

															<div className="flex-1 min-w-0">
																<p className="text-sm font-semibold text-gray-900 truncate">
																	{result.label}
																</p>
																{result.sublabel && (
																	<p className="text-xs text-gray-400 truncate">
																		{result.sublabel}
																	</p>
																)}
															</div>

															<span
																className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${typeColors[result.type]}`}
															>
																{typeLabels[result.type]}
															</span>
														</button>
													</div>
												);
											})}
										</div>
										<div className="border-t border-gray-100 px-3 py-2">
											<button
												type="button"
												onClick={() =>
													navigate(
														`/search?q=${encodeURIComponent(query.trim())}`,
													)
												}
												className="flex w-full items-center gap-2 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors py-1"
											>
												<svg
													className="w-3.5 h-3.5"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
													strokeWidth={2.5}
													aria-hidden="true"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z"
													/>
												</svg>
												Search &ldquo;{query}&rdquo; in all professionals →
											</button>
										</div>
									</>
								) : (
									<div className="px-5 py-6 text-center">
										<p className="text-2xl mb-1">🤔</p>
										<p className="text-sm font-semibold text-gray-700">
											No results for &ldquo;{query}&rdquo;
										</p>
										<p className="text-xs text-gray-400 mt-0.5">
											Try a skill name like &quot;Electrician&quot; or
											&quot;Plumber&quot;
										</p>
										<button
											type="button"
											onClick={() =>
												navigate(
													`/search?q=${encodeURIComponent(query.trim())}`,
												)
											}
											className="mt-3 text-xs font-semibold text-primary-600 hover:underline"
										>
											Search all professionals anyway →
										</button>
									</div>
								)}
							</div>
						)}
					</div>
					{/* Right side: quick link to full search + Profile Icon */}
					<div className="flex items-center gap-3">
						<a
							href="/search"
							className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary-600 transition-colors whitespace-nowrap"
						>
							<svg
								className="w-4 h-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={2}
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
							Browse All
						</a>

						<Link
							href="/dashboard/professional/profile"
							className="flex items-center gap-2 rounded-full border border-gray-200 bg-white pl-1 pr-3 py-1 hover:border-primary-300 hover:shadow-sm transition-all"
							aria-label="Open profile"
						>
							<span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-bold text-sm">
								{user?.user_metadata?.fullname?.charAt(0).toUpperCase() ||
									user?.email?.charAt(0).toUpperCase() ||
									"U"}
							</span>
							<span className="hidden sm:block text-xs font-semibold text-gray-700 max-w-[100px] truncate">
								{user?.user_metadata?.fullname?.split(" ")[0] || "Profile"}
							</span>
						</Link>
					</div>
					;
				</div>
			</div>
		</header>
	);
}
