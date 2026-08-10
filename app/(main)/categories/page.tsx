// app/(main)/categories/page.tsx
"use client";

import {
	Award,
	CheckCircle2,
	ChevronRight,
	Layers,
	Search,
	X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import {
	CAMEROON_SKILLS,
	type CameroonianSkillItem,
} from "@/constants/categories";
import { useTranslation } from "@/context/LanguageContext";
import { categoryService } from "@/services/category.service";

export default function CategoriesPage() {
	const { language, t } = useTranslation();
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedSector, setSelectedSector] = useState<string>("all");
	const [selectedSource, setSelectedSource] = useState<string>("all");
	const [skills, setSkills] = useState<CameroonianSkillItem[]>(CAMEROON_SKILLS);

	useEffect(() => {
		categoryService.getCategories().then((apiCats) => {
			if (apiCats && apiCats.length > 0) {
				const merged = apiCats.map((cat) => {
					const local = CAMEROON_SKILLS.find(
						(s) =>
							s.id === cat.id ||
							s.name.toLowerCase() === cat.name.toLowerCase(),
					);
					if (local) {
						return {
							...local,
							name: cat.name,
							nameFr: cat.nameFr || local.nameFr,
							sector: cat.sector || local.sector,
						};
					}
					return {
						id: cat.id,
						name: cat.name,
						nameFr: cat.nameFr || cat.name,
						sector: cat.sector || "Services & Maintenance",
						sectorFr: cat.sector || "Services & Maintenance",
						source: (cat.source as any) || "MINEFOP",
						descriptionEn: "Specialized service provider trade in Cameroon.",
						descriptionFr: "Prestation de service spécialisée au Cameroun.",
						icon: Layers,
					};
				});
				setSkills(merged as CameroonianSkillItem[]);
			}
		});
	}, []);

	// Extract unique sectors based on current language
	const sectors = useMemo(() => {
		const unique = new Set(
			skills.map((s) => (language === "fr" ? s.sectorFr : s.sector)),
		);
		return Array.from(unique);
	}, [language, skills]);

	// Extract unique sources
	const sources = useMemo(() => {
		const unique = new Set(skills.map((s) => s.source));
		return Array.from(unique);
	}, [skills]);

	// Filtered skills list
	const filteredSkills = useMemo(() => {
		return skills.filter((skill) => {
			const name = language === "fr" ? skill.nameFr : skill.name;
			const description =
				language === "fr" ? skill.descriptionFr : skill.descriptionEn;
			const sector = language === "fr" ? skill.sectorFr : skill.sector;

			const matchesSearch =
				searchQuery.trim() === "" ||
				name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				description.toLowerCase().includes(searchQuery.toLowerCase()) ||
				skill.source.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesSector =
				selectedSector === "all" || sector === selectedSector;
			const matchesSource =
				selectedSource === "all" || skill.source === selectedSource;

			return matchesSearch && matchesSector && matchesSource;
		});
	}, [searchQuery, selectedSector, selectedSource, language, skills]);

	// Source badge color mapper
	const getSourceBadgeStyle = (source: CameroonianSkillItem["source"]) => {
		switch (source) {
			case "MINEFOP":
				return "bg-emerald-50 text-emerald-700 border-emerald-200";
			case "Artisanal Chamber (CMA)":
				return "bg-purple-50 text-purple-700 border-purple-200";
			case "Bayam-Sellam & Street Tech":
				return "bg-amber-50 text-amber-800 border-amber-200";
			case "INS / FNE":
				return "bg-blue-50 text-blue-700 border-blue-200";
			default:
				return "bg-gray-100 text-gray-700 border-gray-200";
		}
	};

	return (
		<div className="min-h-screen bg-slate-50 flex flex-col font-sans">
			<Header />

			<main className="flex-1">
				{/* Top Hero Banner */}
				<section className="relative overflow-hidden bg-slate-900 py-14 sm:py-20 text-white border-b border-slate-800">
					{/* Ambient glow effects */}
					<div className="absolute top-0 left-1/3 h-72 w-72 rounded-full bg-primary-500/20 blur-3xl pointer-events-none" />
					<div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-green-500/15 blur-3xl pointer-events-none" />

					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
						<span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-primary-300 border border-white/15 mb-4">
							🇨🇲 {t("categoriesPage.badge")}
						</span>

						<h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
							{language === "fr" ? (
								<>
									Explorez les{" "}
									<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-green-400">
										Métiers & Artisans
									</span>{" "}
									au Cameroun
								</>
							) : (
								<>
									Explore Trade{" "}
									<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-green-400">
										Skills & Artisans
									</span>{" "}
									in Cameroon
								</>
							)}
						</h1>

						<p className="mt-3 mx-auto max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed">
							{t("categoriesPage.subtitle")}
						</p>

						{/* Search Bar inside Hero */}
						<div className="mt-8 mx-auto max-w-2xl relative">
							<div className="relative flex items-center">
								<Search className="absolute left-4 h-5 w-5 text-slate-400" />
								<input
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder={t("categoriesPage.searchPlaceholder")}
									className="w-full h-13 pl-12 pr-10 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-xl shadow-slate-950/20"
								/>
								{searchQuery && (
									<button
										type="button"
										onClick={() => setSearchQuery("")}
										className="absolute right-4 text-slate-400 hover:text-slate-600"
									>
										<X className="h-5 w-5" />
									</button>
								)}
							</div>
						</div>
					</div>
				</section>

				{/* Categories Content & Filters Section */}
				<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
					{/* Filter controls bar */}
					<div className="space-y-4">
						{/* Sector Tabs */}
						<div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
							<span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 pr-2 border-r border-slate-200">
								<Layers className="h-3.5 w-3.5" /> Sector:
							</span>
							<button
								type="button"
								onClick={() => setSelectedSector("all")}
								className={`px-3.5 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all border ${
									selectedSector === "all"
										? "bg-slate-900 text-white border-slate-900 shadow-sm"
										: "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
								}`}
							>
								{t("common.allSectors")} ({skills.length})
							</button>

							{sectors.map((sec) => {
								const count = skills.filter(
									(s) => (language === "fr" ? s.sectorFr : s.sector) === sec,
								).length;
								return (
									<button
										key={sec}
										type="button"
										onClick={() => setSelectedSector(sec)}
										className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all border ${
											selectedSector === sec
												? "bg-primary-600 text-white border-primary-600 shadow-sm"
												: "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
										}`}
									>
										{sec} ({count})
									</button>
								);
							})}
						</div>

						{/* Source Origin Badges Bar */}
						<div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
							<span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 pr-2 border-r border-slate-200">
								<Award className="h-3.5 w-3.5" /> Source:
							</span>
							<button
								type="button"
								onClick={() => setSelectedSource("all")}
								className={`px-3 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-all border ${
									selectedSource === "all"
										? "bg-slate-800 text-white border-slate-800"
										: "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
								}`}
							>
								{t("common.allSources")}
							</button>
							{sources.map((src) => (
								<button
									key={src}
									type="button"
									onClick={() => setSelectedSource(src)}
									className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-all border ${
										selectedSource === src
											? "bg-primary-50 text-primary-700 border-primary-300 font-bold"
											: "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
									}`}
								>
									{src}
								</button>
							))}
						</div>
					</div>

					{/* Results Count Header */}
					<div className="flex items-center justify-between border-b border-slate-200 pb-4">
						<p className="text-sm font-bold text-slate-700">
							Showing{" "}
							<span className="text-primary-600">{filteredSkills.length}</span>{" "}
							{t("categoriesPage.foundSkills")}
						</p>

						{(searchQuery ||
							selectedSector !== "all" ||
							selectedSource !== "all") && (
							<button
								type="button"
								onClick={() => {
									setSearchQuery("");
									setSelectedSector("all");
									setSelectedSource("all");
								}}
								className="text-xs font-semibold text-red-600 hover:underline flex items-center gap-1"
							>
								<X className="h-3.5 w-3.5" /> Reset Filters
							</button>
						)}
					</div>

					{/* Grid of Skill Cards */}
					{filteredSkills.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredSkills.map((skill) => {
								const IconComponent = skill.icon;
								const displayName =
									language === "fr" ? skill.nameFr : skill.name;
								const displaySector =
									language === "fr" ? skill.sectorFr : skill.sector;
								const displayDescription =
									language === "fr" ? skill.descriptionFr : skill.descriptionEn;

								return (
									<div
										key={skill.id}
										className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all duration-300"
									>
										<div className="space-y-4">
											{/* Top Row: Icon & Source Badge */}
											<div className="flex items-start justify-between gap-3">
												<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-50 to-green-50 text-primary-600 group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300 border border-primary-100/60 shadow-sm">
													<IconComponent className="h-6 w-6" />
												</div>
												<span
													className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${getSourceBadgeStyle(
														skill.source,
													)}`}
												>
													<CheckCircle2 className="h-3 w-3" />
													{skill.source}
												</span>
											</div>

											{/* Skill Title & Sector */}
											<div>
												<h3 className="text-lg font-extrabold text-slate-900 group-hover:text-primary-600 transition-colors">
													{displayName}
												</h3>
												<p className="text-xs font-semibold text-slate-400 mt-0.5">
													{displaySector}
												</p>
											</div>

											{/* Skill Description */}
											<p className="text-xs text-slate-500 leading-relaxed">
												{displayDescription}
											</p>
										</div>

										{/* Card Action Link */}
										<div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
											<Link
												href={`/search?category=${encodeURIComponent(skill.name)}`}
												className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 group-hover:text-primary-700 transition-colors"
											>
												<span>{t("categoriesPage.hirePro")}</span>
											</Link>
											<ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
										</div>
									</div>
								);
							})}
						</div>
					) : (
						/* Empty State */
						<div className="rounded-3xl border border-slate-200 bg-white p-12 text-center max-w-lg mx-auto space-y-4">
							<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
								<Search className="h-8 w-8" />
							</div>
							<div className="space-y-1">
								<h3 className="text-base font-bold text-slate-900">
									{t("categoriesPage.noResultsTitle")}
								</h3>
								<p className="text-xs text-slate-500 leading-relaxed">
									{t("categoriesPage.noResultsText")}
								</p>
							</div>
							<Button
								onClick={() => {
									setSearchQuery("");
									setSelectedSector("all");
									setSelectedSource("all");
								}}
								variant="outline"
								className="text-xs"
							>
								Clear All Filters
							</Button>
						</div>
					)}
				</section>
			</main>

			<Footer />
		</div>
	);
}
