// components/professional/ProfessionalCard.tsx
"use client";

import { Briefcase, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CATEGORY_ICONS } from "@/constants/categories";
import type { Professional } from "@/types/professional.types";

interface ProfessionalCardProps {
	professional: Professional;
}

function getInitials(name: string) {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

const FALLBACK_NAME = "Professional";

export default function ProfessionalCard({
	professional,
}: ProfessionalCardProps) {
	const {
		id,
		fullName,
		avatarUrl,
		category,
		location,
		skills,
		averageRating,
		completedJobs,
		whatsappNumber,
	} = professional;
	const displayName = fullName || FALLBACK_NAME;

	const CategoryIcon = CATEGORY_ICONS[category] || CATEGORY_ICONS.Other;

	return (
		<Link
			href={`/professionals/${id}`}
			className="group block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-lg hover:border-primary-200 hover:-translate-y-0.5"
		>
			<div className="flex items-start gap-4">
				{/* Avatar */}
				<div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 ring-2 ring-gray-100">
					{avatarUrl ? (
						<Image
							src={avatarUrl}
							alt={displayName}
							fill
							className="object-cover"
							unoptimized
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center text-lg font-bold text-gray-500">
							{getInitials(displayName)}
						</div>
					)}
				</div>

				{/* Info */}
				<div className="flex-1 min-w-0">
					<div className="flex items-center justify-between gap-2">
						<h3 className="truncate text-base font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
							{displayName}
						</h3>
						{whatsappNumber && (
							<span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex-shrink-0">
								WhatsApp
							</span>
						)}
					</div>

					<div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
						<span className="flex items-center gap-1.5 font-medium text-primary-600">
							<CategoryIcon className="h-3.5 w-3.5 text-primary-600" />
							{category}
						</span>
						<span className="flex items-center gap-1">
							<MapPin className="h-3 w-3 text-gray-400" />
							{location || "Remote"}
						</span>
						<span className="flex items-center gap-1">
							<Briefcase className="h-3 w-3 text-gray-400" />
							{completedJobs} job{completedJobs !== 1 ? "s" : ""}
						</span>
					</div>

					{/* Skills */}
					{skills && skills.length > 0 && (
						<div className="mt-3 flex flex-wrap gap-1.5">
							{skills.slice(0, 4).map((skill) => (
								<span
									key={skill}
									className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-gray-50 text-gray-600 border border-gray-100"
								>
									{skill}
								</span>
							))}
							{skills.length > 4 && (
								<span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-gray-50 text-gray-500 border border-gray-100">
									+{skills.length - 4}
								</span>
							)}
						</div>
					)}

					{/* Rating + Action */}
					<div className="mt-3 flex items-center justify-between">
						<div className="flex items-center gap-1 text-xs font-bold text-amber-600">
							<Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
							<span>{averageRating.toFixed(1)}</span>
						</div>
						<span className="text-[11px] font-semibold text-primary-600 group-hover:underline">
							View Profile →
						</span>
					</div>
				</div>
			</div>
		</Link>
	);
}
