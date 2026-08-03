// components/home/FeaturedProfessionals.tsx
"use client";

import { Briefcase, MapPin, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { SKILL_CATEGORY_EMOJIS } from "@/constants/categories";
import { professionalService } from "@/services/professional.service";
import type { Professional } from "@/types/professional.types";

function ProfessionalCardSkeleton() {
	return (
		<div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-4">
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
			</div>
			<div className="flex items-center justify-between pt-2">
				<Skeleton className="h-4 w-12" />
				<Skeleton className="h-4 w-24" />
			</div>
		</div>
	);
}

export default function FeaturedProfessionals() {
	const [professionals, setProfessionals] = useState<Professional[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function load() {
			try {
				const data = await professionalService.getProfessionals();
				setProfessionals(data.slice(0, 6));
			} catch (error) {
				console.warn("Failed to load professionals:", error);
			} finally {
				setLoading(false);
			}
		}
		load();
	}, []);

	return (
		<section className="py-16 lg:py-24 bg-white">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
					<h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
						Featured{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-green-600">
							Professionals
						</span>
					</h2>
					<p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
						Top-rated experts ready to help. Browse our handpicked selection of
						trusted professionals across Cameroon.
					</p>
				</div>

				{loading ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
						{[1, 2, 3, 4, 5, 6].map((i) => (
							<ProfessionalCardSkeleton key={i} />
						))}
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
						{professionals.map((professional) => (
							<Link
								key={professional.id}
								href={`/professionals/${professional.id}`}
								className="group block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-lg hover:border-primary-200 hover:-translate-y-1"
							>
								<div className="flex items-start gap-4">
									{/* Avatar */}
									<div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 ring-2 ring-gray-100">
										{professional.avatarUrl ? (
											<img
												src={professional.avatarUrl}
												alt={professional.fullName}
												className="h-full w-full object-cover"
											/>
										) : (
											<div className="flex h-full w-full items-center justify-center text-lg font-bold text-gray-500">
												{professional.fullName?.charAt(0)?.toUpperCase() || "U"}
											</div>
										)}
									</div>

									{/* Info */}
									<div className="flex-1 min-w-0">
										<div className="flex items-center justify-between gap-2">
											<h3 className="truncate text-base font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
												{professional.fullName}
											</h3>
											{professional.whatsappNumber && (
												<span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex-shrink-0">
													WhatsApp
												</span>
											)}
										</div>

										<div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
											<span className="flex items-center gap-1 font-medium text-primary-600">
												{SKILL_CATEGORY_EMOJIS[professional.category] ?? "🛠️"}
												{professional.category}
											</span>
											<span className="flex items-center gap-1">
												<MapPin className="h-3 w-3 text-gray-400" />
												{professional.location || "Remote"}
											</span>
											<span className="flex items-center gap-1">
												<Briefcase className="h-3 w-3 text-gray-400" />
												{professional.completedJobs} jobs
											</span>
										</div>

										{/* Skills */}
										{professional.skills && professional.skills.length > 0 && (
											<div className="mt-2 flex flex-wrap gap-1.5">
												{professional.skills.slice(0, 3).map((skill) => (
													<span
														key={skill}
														className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-gray-50 text-gray-600 border border-gray-100"
													>
														{skill}
													</span>
												))}
												{professional.skills.length > 3 && (
													<span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-gray-50 text-gray-500 border border-gray-100">
														+{professional.skills.length - 3}
													</span>
												)}
											</div>
										)}

										{/* Rating */}
										<div className="mt-3 flex items-center justify-between">
											<div className="flex items-center gap-1 text-xs font-bold text-amber-600">
												<Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
												<span>{professional.averageRating.toFixed(1)}</span>
											</div>
											<span className="text-[11px] font-semibold text-primary-600 group-hover:underline">
												View Profile →
											</span>
										</div>
									</div>
								</div>
							</Link>
						))}
					</div>
				)}

				<div className="mt-10 text-center">
					<Link href="/search">
						<Button
							variant="outline"
							className="px-8 h-11 text-sm font-semibold"
						>
							View All Professionals
						</Button>
					</Link>
				</div>
			</div>
		</section>
	);
}
