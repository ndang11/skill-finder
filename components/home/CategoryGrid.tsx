// components/home/CategoryGrid.tsx
"use client";

import { MoreHorizontal, Wrench } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CAMEROON_SKILLS } from "@/constants/categories";
import { useTranslation } from "@/context/LanguageContext";

const CATEGORY_COLORS: Record<
	string,
	{ bg: string; text: string; ring: string }
> = {
	Electrician: {
		bg: "bg-amber-50",
		text: "text-amber-600",
		ring: "ring-amber-100",
	},
	Plumber: {
		bg: "bg-blue-50",
		text: "text-blue-600",
		ring: "ring-blue-100",
	},
	"Auto Mechanic": {
		bg: "bg-gray-50",
		text: "text-gray-700",
		ring: "ring-gray-100",
	},
	"Carpenter & Woodworker": {
		bg: "bg-orange-50",
		text: "text-orange-600",
		ring: "ring-orange-100",
	},
	"Solar & Security Installer": {
		bg: "bg-yellow-50",
		text: "text-yellow-600",
		ring: "ring-yellow-100",
	},
	"AC & Refrigeration Tech": {
		bg: "bg-cyan-50",
		text: "text-cyan-600",
		ring: "ring-cyan-100",
	},
	"Painter & Decorator": {
		bg: "bg-purple-50",
		text: "text-purple-600",
		ring: "ring-purple-100",
	},
	"Welder & Metal Fabricator": {
		bg: "bg-red-50",
		text: "text-red-600",
		ring: "ring-red-100",
	},
	"Hairdresser & Barber": {
		bg: "bg-pink-50",
		text: "text-pink-600",
		ring: "ring-pink-100",
	},
	"Tailor & Fashion Designer": {
		bg: "bg-indigo-50",
		text: "text-indigo-600",
		ring: "ring-indigo-100",
	},
	Other: {
		bg: "bg-primary-50",
		text: "text-primary-600",
		ring: "ring-primary-100",
	},
};

export default function CategoryGrid() {
	const { language, t } = useTranslation();

	// Select first 8 popular skills to display on home page
	const popularSkills = CAMEROON_SKILLS.slice(0, 8);

	return (
		<section className="py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50/80">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
					<span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3.5 py-1.5 text-xs font-bold text-primary-700 border border-primary-100 mb-4">
						<Wrench className="h-3.5 w-3.5" />
						{t("home.popularServices")}
					</span>
					<h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
						{t("home.browseCategory")}
					</h2>
					<p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
						{t("home.categorySubtitle")}
					</p>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
					{popularSkills.map((skill) => {
						const colors = CATEGORY_COLORS[skill.name] || CATEGORY_COLORS.Other;
						const IconComponent = skill.icon;
						const displayName = language === "fr" ? skill.nameFr : skill.name;

						return (
							<Link
								key={skill.id}
								href={`/search?category=${encodeURIComponent(skill.name)}`}
								className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-xs transition-all duration-300 hover:shadow-md hover:border-primary-300 hover:-translate-y-1"
							>
								<div className="flex flex-col items-center text-center gap-4">
									<div
										className={`flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl ${colors.bg} ${colors.text} ring-4 ${colors.ring} group-hover:scale-110 transition-transform duration-300`}
									>
										{IconComponent ? (
											<IconComponent className="h-6 w-6" />
										) : (
											<MoreHorizontal className="h-6 w-6" />
										)}
									</div>
									<div>
										<h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
											{displayName}
										</h3>
										<p className="text-xs text-gray-400 mt-1 font-medium">
											{t("home.viewProfessionals")}
										</p>
									</div>
								</div>

								{/* Hover arrow */}
								<div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
									<div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="12"
											height="12"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="3"
											strokeLinecap="round"
											strokeLinejoin="round"
											aria-hidden="true"
										>
											<path d="M5 12h14" />
											<path d="m12 5 7 7-7 7" />
										</svg>
									</div>
								</div>
							</Link>
						);
					})}
				</div>

				<div className="mt-10 text-center">
					<Link href="/categories">
						<Button
							variant="outline"
							className="px-8 h-11 text-sm font-semibold"
						>
							{t("home.viewAllCategories")}
						</Button>
					</Link>
				</div>
			</div>
		</section>
	);
}
