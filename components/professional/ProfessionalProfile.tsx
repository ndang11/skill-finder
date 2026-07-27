"use client";

import {
	Award,
	Bookmark,
	Briefcase,
	Calendar,
	CheckCircle2,
	Clock,
	ExternalLink,
	Mail,
	MapPin,
	Share2,
	Star,
	ThumbsUp,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

// Types
export interface Skill {
	id: string;
	name: string;
	category: string;
	rating: number;
}

export interface Review {
	id: string;
	authorName: string;
	authorAvatar: string;
	rating: number;
	date: string;
	comment: string;
	skillTitle: string;
}

export interface ProfessionalProfileProps {
	user?: {
		fullName: string;
		title: string;
		location: string;
		joinedDate: string;
		rating: number;
		reviewCount: number;
		bio: string;
		avatarUrl: string;
		bannerUrl: string;
		stats: {
			completedSessions: number;
			responseRate: string;
			avgResponseTime: string;
		};
	};
	skills?: Skill[];
	reviews?: Review[];
}

export default function ProfessionalProfile({
	user: customUser,
	skills: customSkills,
	reviews: customReviews,
}: ProfessionalProfileProps) {
	const [activeTab, setActiveTab] = useState<"overview" | "skills" | "reviews">(
		"overview",
	);
	const [isSaved, setIsSaved] = useState(false);

	// Fallback to sample data if no props provided
	const user = customUser || {
		fullName: "Sarah Dev",
		title: "Senior Full-Stack Engineer & Mentor",
		location: "San Francisco, CA (Remote)",
		joinedDate: "Joined March 2024",
		rating: 4.95,
		reviewCount: 48,
		bio: "Passionate software architect with 7+ years of experience building scalable microservices with NestJS, Next.js, and Cloudflare. Dedicated to mentoring developers in mastering TypeScript and modern database architectures.",
		avatarUrl:
			"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
		bannerUrl:
			"https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
		stats: {
			completedSessions: 124,
			responseRate: "99%",
			avgResponseTime: "< 2 hrs",
		},
	};

	const skills: Skill[] = customSkills || [
		{ id: "1", name: "NestJS Architecture", category: "Backend", rating: 5.0 },
		{
			id: "2",
			name: "Next.js 14 App Router",
			category: "Frontend",
			rating: 4.9,
		},
		{ id: "3", name: "Prisma & PostgreSQL", category: "Database", rating: 5.0 },
		{
			id: "4",
			name: "Cloudinary Media Pipelines",
			category: "DevOps",
			rating: 4.8,
		},
	];

	const reviews: Review[] = customReviews || [
		{
			id: "r1",
			authorName: "Alex Johnson",
			authorAvatar:
				"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
			rating: 5,
			date: "2 days ago",
			comment:
				"Sarah helped me debug a complex Prisma transaction locking issue with Supabase. Absolute expert!",
			skillTitle: "Prisma & PostgreSQL Optimization",
		},
		{
			id: "r2",
			authorName: "Michael Chen",
			authorAvatar:
				"https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80",
			rating: 5,
			date: "1 week ago",
			comment:
				"Super structured 1-on-1 session on building native ES Module backends in NestJS. Highly recommended.",
			skillTitle: "NestJS Architecture",
		},
	];

	return (
		<div className="min-h-screen bg-gray-50 text-gray-900 pb-12">
			{/* 1. Profile Banner Header */}
			<div className="relative h-48 md:h-64 w-full bg-gray-200">
				<Image
					src={user.bannerUrl}
					alt="Profile Banner"
					fill
					className="object-cover"
					unoptimized // for external unsplash urls without adding to next config
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
			</div>

			{/* 2. Main Container */}
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="relative -mt-16 md:-mt-20 mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
					{/* Avatar + Basic Info */}
					<div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
						<div className="relative w-28 h-28 md:w-36 md:h-36 rounded-2xl ring-4 ring-white shadow-xl overflow-hidden bg-white">
							<Image
								src={user.avatarUrl}
								alt={user.fullName}
								fill
								className="object-cover"
								unoptimized
							/>
						</div>

						<div className="pt-2">
							<div className="flex items-center gap-2">
								<h1 className="text-2xl md:text-3xl font-bold text-gray-900">
									{user.fullName}
								</h1>
								<CheckCircle2 className="w-5 h-5 text-blue-600 fill-blue-100" />
							</div>
							<p className="text-sm md:text-base font-medium text-gray-600">
								{user.title}
							</p>

							<div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-xs md:text-sm text-gray-500">
								<span className="flex items-center gap-1">
									<MapPin className="w-4 h-4 text-gray-400" />
									{user.location}
								</span>
								<span className="flex items-center gap-1">
									<Calendar className="w-4 h-4 text-gray-400" />
									{user.joinedDate}
								</span>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex items-center gap-2 mt-2 md:mt-0">
						<button
							type="button"
							onClick={() => setIsSaved(!isSaved)}
							className={`p-2.5 rounded-xl border transition-colors ${
								isSaved
									? "bg-blue-50 border-blue-200 text-blue-600"
									: "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
							}`}
							title="Save Profile"
						>
							<Bookmark
								className={`w-5 h-5 ${isSaved ? "fill-blue-600" : ""}`}
							/>
						</button>

						<button
							type="button"
							className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
						>
							<Share2 className="w-5 h-5" />
						</button>

						<button
							type="button"
							className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl transition-all shadow-sm"
						>
							<Mail className="w-4 h-4" />
							Book Session
						</button>
					</div>
				</div>

				{/* 3. Highlight Stats Banner */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm mb-8">
					<div className="flex items-center gap-3">
						<div className="p-2.5 bg-amber-50 rounded-xl text-amber-600">
							<Star className="w-5 h-5 fill-amber-500" />
						</div>
						<div>
							<div className="text-lg font-bold text-gray-900">
								{user.rating}{" "}
								<span className="text-xs text-gray-400 font-normal">
									({user.reviewCount})
								</span>
							</div>
							<div className="text-xs text-gray-500">Overall Rating</div>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
							<Briefcase className="w-5 h-5" />
						</div>
						<div>
							<div className="text-lg font-bold text-gray-900">
								{user.stats.completedSessions}
							</div>
							<div className="text-xs text-gray-500">Sessions Completed</div>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
							<ThumbsUp className="w-5 h-5" />
						</div>
						<div>
							<div className="text-lg font-bold text-gray-900">
								{user.stats.responseRate}
							</div>
							<div className="text-xs text-gray-500">Response Rate</div>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<div className="p-2.5 bg-purple-50 rounded-xl text-purple-600">
							<Clock className="w-5 h-5" />
						</div>
						<div>
							<div className="text-lg font-bold text-gray-900">
								{user.stats.avgResponseTime}
							</div>
							<div className="text-xs text-gray-500">Avg Response Time</div>
						</div>
					</div>
				</div>

				{/* 4. Tab Navigation */}
				<div className="border-b border-gray-200 mb-6 flex overflow-x-auto">
					<nav className="flex gap-8 whitespace-nowrap">
						<button
							type="button"
							onClick={() => setActiveTab("overview")}
							className={`pb-4 text-sm font-semibold border-b-2 transition-colors ${
								activeTab === "overview"
									? "border-blue-600 text-blue-600"
									: "border-transparent text-gray-500 hover:text-gray-700"
							}`}
						>
							Overview
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("skills")}
							className={`pb-4 text-sm font-semibold border-b-2 transition-colors ${
								activeTab === "skills"
									? "border-blue-600 text-blue-600"
									: "border-transparent text-gray-500 hover:text-gray-700"
							}`}
						>
							Offered Skills ({skills.length})
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("reviews")}
							className={`pb-4 text-sm font-semibold border-b-2 transition-colors ${
								activeTab === "reviews"
									? "border-blue-600 text-blue-600"
									: "border-transparent text-gray-500 hover:text-gray-700"
							}`}
						>
							Reviews ({reviews.length})
						</button>
					</nav>
				</div>

				{/* 5. Tab Content Sections */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Column */}
					<div className="lg:col-span-2 space-y-6">
						{activeTab === "overview" && (
							<>
								{/* Bio Card */}
								<div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
									<h3 className="text-lg font-bold text-gray-900">About Me</h3>
									<p className="text-gray-600 leading-relaxed text-sm md:text-base">
										{user.bio}
									</p>
								</div>

								{/* Top Skills Preview */}
								<div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4">
									<div className="flex items-center justify-between">
										<h3 className="text-lg font-bold text-gray-900">
											Featured Skills
										</h3>
										<button
											type="button"
											onClick={() => setActiveTab("skills")}
											className="text-xs font-semibold text-blue-600 hover:underline"
										>
											View All
										</button>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
										{skills.slice(0, 4).map((skill) => (
											<div
												key={skill.id}
												className="p-3.5 border border-gray-100 rounded-xl bg-gray-50/50 flex items-center justify-between"
											>
												<div>
													<div className="font-semibold text-sm text-gray-800">
														{skill.name}
													</div>
													<span className="text-xs text-gray-500">
														{skill.category}
													</span>
												</div>
												<div className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
													<Star className="w-3.5 h-3.5 fill-amber-500" />
													{skill.rating.toFixed(1)}
												</div>
											</div>
										))}
									</div>
								</div>
							</>
						)}

						{activeTab === "skills" && (
							<div className="space-y-4">
								{skills.map((skill) => (
									<div
										key={skill.id}
										className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between"
									>
										<div className="space-y-1">
											<span className="inline-block px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-md">
												{skill.category}
											</span>
											<h4 className="text-base font-bold text-gray-900">
												{skill.name}
											</h4>
										</div>
										<button
											type="button"
											className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 hover:border-blue-600 hover:text-blue-600 rounded-xl text-sm font-medium transition-all"
										>
											Request Session
											<ExternalLink className="w-3.5 h-3.5" />
										</button>
									</div>
								))}
							</div>
						)}

						{activeTab === "reviews" && (
							<div className="space-y-4">
								{reviews.map((rev) => (
									<div
										key={rev.id}
										className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3"
									>
										<div className="flex items-start justify-between">
											<div className="flex items-center gap-3">
												<div className="relative w-10 h-10 rounded-full overflow-hidden">
													<Image
														src={rev.authorAvatar}
														alt={rev.authorName}
														fill
														className="object-cover"
														unoptimized
													/>
												</div>
												<div>
													<h5 className="font-semibold text-sm text-gray-900">
														{rev.authorName}
													</h5>
													<span className="text-xs text-gray-400">
														{rev.date}
													</span>
												</div>
											</div>
											<div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
												<Star className="w-3.5 h-3.5 fill-amber-500" />
												{rev.rating}.0
											</div>
										</div>
										<p className="text-sm text-gray-600">{rev.comment}</p>
										<div className="text-xs font-medium text-blue-600 bg-blue-50/50 px-2.5 py-1 rounded-md inline-block">
											Skill: {rev.skillTitle}
										</div>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Sidebar Column */}
					<div className="space-y-6">
						{/* Quick Details Card */}
						<div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4">
							<h4 className="font-bold text-sm text-gray-900 uppercase tracking-wider">
								Verified Badges
							</h4>
							<div className="space-y-3 text-sm">
								<div className="flex items-center gap-3 text-gray-700">
									<Award className="w-5 h-5 text-blue-600" />
									<span>Verified Professional</span>
								</div>
								<div className="flex items-center gap-3 text-gray-700">
									<CheckCircle2 className="w-5 h-5 text-emerald-600" />
									<span>Identity Confirmed</span>
								</div>
							</div>
						</div>

						{/* Support / Contact CTA */}
						<div className="p-5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-white space-y-3">
							<h4 className="font-bold text-base">
								Want to swap or learn a skill?
							</h4>
							<p className="text-xs text-blue-100 leading-relaxed">
								Connect directly with {user.fullName.split(" ")[0]} for
								mentorship or project-based code reviews.
							</p>
							<button
								type="button"
								className="w-full py-2.5 bg-white text-blue-600 hover:bg-blue-50 font-semibold text-sm rounded-xl transition-all shadow-sm"
							>
								Send Message
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
