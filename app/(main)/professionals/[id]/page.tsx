// app/(main)/professionals/[id]/page.tsx
"use client";

import {
	ArrowLeft,
	Briefcase,
	CheckCircle2,
	Heart,
	Mail,
	MapPin,
	MessageCircle,
	Phone,
	Share2,
	Star,
	User,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { CATEGORY_ICONS } from "@/constants/categories";
import { professionalService } from "@/services/professional.service";
import type { Professional } from "@/types/professional.types";
import { cn } from "@/utils/cn";

function getInitials(name: string) {
	return (
		name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.slice(0, 2)
			.toUpperCase() || "U"
	);
}

function StarRating({ rating }: { rating: number }) {
	const fullStars = Math.floor(rating);
	const hasHalf = rating - fullStars >= 0.5;

	const starColor = (index: number) => {
		if (index < fullStars) return "text-amber-400";
		if (hasHalf && index === fullStars) return "text-amber-400";
		return "text-gray-200";
	};

	return (
		<div className="flex items-center gap-0.5">
			<svg
				className={`h-5 w-5 ${starColor(0)}`}
				fill="currentColor"
				viewBox="0 0 20 20"
				aria-label="Star"
			>
				<title>Star</title>
				<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
			</svg>
			<svg
				className={`h-5 w-5 ${starColor(1)}`}
				fill="currentColor"
				viewBox="0 0 20 20"
				aria-label="Star"
			>
				<title>Star</title>
				<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
			</svg>
			<svg
				className={`h-5 w-5 ${starColor(2)}`}
				fill="currentColor"
				viewBox="0 0 20 20"
				aria-label="Star"
			>
				<title>Star</title>
				<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
			</svg>
			<svg
				className={`h-5 w-5 ${starColor(3)}`}
				fill="currentColor"
				viewBox="0 0 20 20"
				aria-label="Star"
			>
				<title>Star</title>
				<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
			</svg>
			<svg
				className={`h-5 w-5 ${starColor(4)}`}
				fill="currentColor"
				viewBox="0 0 20 20"
				aria-label="Star"
			>
				<title>Star</title>
				<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
			</svg>
			<span className="ml-2 text-sm font-black text-gray-900">
				{rating.toFixed(1)}
			</span>
		</div>
	);
}

export default function ProfessionalProfilePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const router = useRouter();
	const [professional, setProfessional] = useState<Professional | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function load() {
			try {
				const { id } = await params;
				const data = await professionalService.getProfile(id);
				setProfessional(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to load profile");
			} finally {
				setLoading(false);
			}
		}
		load();
	}, [params]);

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50/50 flex flex-col">
				<Header />
				<div className="flex-1 flex items-center justify-center">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
				</div>
				<Footer />
			</div>
		);
	}

	if (error || !professional) {
		return (
			<div className="min-h-screen bg-gray-50/50 flex flex-col">
				<Header />
				<div className="flex-1 flex items-center justify-center">
					<Card className="p-8 max-w-md mx-auto text-center space-y-4">
						<div className="text-4xl">😕</div>
						<h2 className="text-xl font-black text-gray-900">
							Profile Not Found
						</h2>
						<p className="text-sm text-gray-500">
							{error || "This professional profile could not be loaded."}
						</p>
						<Button onClick={() => router.back()}>Go Back</Button>
					</Card>
				</div>
				<Footer />
			</div>
		);
	}

	const displayName = professional.fullName || "Professional";
	const CategoryIcon =
		CATEGORY_ICONS[professional.category] || CATEGORY_ICONS.Other;
	const whatsappLink = professional.whatsappNumber
		? `https://wa.me/${professional.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${displayName}, I found your profile on Skill Finder and I'd like to enquire about your services.`)}`
		: null;

	return (
		<div className="min-h-screen bg-gray-50/50 flex flex-col">
			<Header />

			<main className="flex-1">
				{/* Hero / Profile Header */}
				<section className="bg-gradient-to-br from-primary-50 via-white to-green-50/30 border-b border-gray-200">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
						<div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-10">
							{/* Avatar */}
							<div className="relative h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden rounded-3xl bg-gray-100 ring-4 ring-white shadow-lg">
								{professional.avatarUrl ? (
									<Image
										src={professional.avatarUrl}
										alt={displayName || "Professional profile"}
										fill
										className="object-cover"
										unoptimized
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center text-3xl sm:text-4xl font-black text-primary-700 bg-gradient-to-br from-primary-100 to-green-100">
										{getInitials(displayName)}
									</div>
								)}
								{professional.whatsappNumber && (
									<span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white ring-2 ring-white">
										<MessageCircle className="h-3.5 w-3.5" />
									</span>
								)}
							</div>

							{/* Info */}
							<div className="flex-1 min-w-0">
								<div className="flex flex-wrap items-center gap-2 mb-2">
									<h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
										{displayName}
									</h1>
									<span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-bold text-primary-700">
										<CheckCircle2 className="h-3 w-3" />
										Verified Professional
									</span>
								</div>

								<div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
									<span className="flex items-center gap-1.5 font-medium text-primary-700">
										<CategoryIcon className="h-4 w-4" />
										{professional.category}
									</span>
									{professional.location && (
										<span className="flex items-center gap-1.5">
											<MapPin className="h-4 w-4 text-gray-400" />
											{professional.location}
										</span>
									)}
									<span className="flex items-center gap-1.5">
										<Briefcase className="h-4 w-4 text-gray-400" />
										{professional.completedJobs} job
										{professional.completedJobs !== 1 ? "s" : ""} completed
									</span>
								</div>

								<StarRating rating={professional.averageRating} />

								{professional.bio && (
									<p className="mt-4 text-sm text-gray-600 leading-relaxed max-w-2xl">
										{professional.bio}
									</p>
								)}
							</div>
						</div>
					</div>
				</section>

				{/* Details Section */}
				<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
					<div className="grid gap-6 lg:grid-cols-3">
						{/* Main Content */}
						<div className="lg:col-span-2 space-y-6">
							{/* Skills */}
							{professional.skills && professional.skills.length > 0 && (
								<Card className="p-6 sm:p-8">
									<h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
										<Briefcase className="h-5 w-5 text-primary-500" />
										Skills & Services
									</h2>
									<div className="flex flex-wrap gap-2">
										{professional.skills.map((skill) => (
											<span
												key={skill}
												className="text-sm font-semibold px-4 py-2 rounded-xl bg-primary-50 text-primary-700 border border-primary-100"
											>
												{skill}
											</span>
										))}
									</div>
								</Card>
							)}

							{/* Reviews placeholder */}
							<Card className="p-6 sm:p-8">
								<h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
									<Star className="h-5 w-5 text-amber-500" />
									Reviews
								</h2>
								<div className="text-center py-8 text-gray-400">
									<p className="text-sm">
										Reviews will appear here once clients leave feedback.
									</p>
								</div>
							</Card>
						</div>

						{/* Sidebar */}
						<div className="space-y-6">
							{/* Contact Card */}
							<Card className="p-6 space-y-4">
								<h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">
									Contact
								</h3>

								{whatsappLink ? (
									<a
										href={whatsappLink}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 px-4 rounded-xl font-bold text-sm sm:text-base shadow-lg shadow-green-500/10 hover:shadow-green-500/20 active:scale-[0.99] transition-all"
									>
										<svg
											className="w-5 h-5 fill-current"
											viewBox="0 0 24 24"
											aria-label="WhatsApp"
										>
											<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
										</svg>
										Chat on WhatsApp
									</a>
								) : (
									<p className="text-xs text-gray-400 text-center">
										WhatsApp number not provided
									</p>
								)}

								{professional.location && (
									<div className="flex items-center gap-3 text-sm text-gray-600">
										<MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
										<span>{professional.location}</span>
									</div>
								)}
							</Card>

							{/* Stats Card */}
							<Card className="p-6 space-y-4">
								<h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">
									Stats
								</h3>
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<span className="text-sm text-gray-500">Rating</span>
										<span className="text-sm font-bold text-gray-900 flex items-center gap-1">
											<Star className="h-4 w-4 fill-amber-500 text-amber-500" />
											{professional.averageRating.toFixed(1)}
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm text-gray-500">
											Completed Jobs
										</span>
										<span className="text-sm font-bold text-gray-900">
											{professional.completedJobs}
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm text-gray-500">Category</span>
										<span className="text-sm font-bold text-gray-900">
											{professional.category}
										</span>
									</div>
								</div>
							</Card>
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}
