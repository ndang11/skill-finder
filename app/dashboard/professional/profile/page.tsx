"use client";

import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { SKILL_CATEGORY_EMOJIS } from "@/constants/categories";
import { professionalService } from "@/services/professional.service";
import type { Professional } from "@/types/professional.types";
import { supabase } from "@/utils/supabase/client";

export default function ProfilePage() {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [profile, setProfile] = useState<Professional | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		supabase.auth.getUser().then(({ data }) => {
			setUser(data.user);
			setLoading(false);
		});
	}, []);

	useEffect(() => {
		if (!loading && !user) {
			router.push("/login");
		}
	}, [user, loading, router]);

	useEffect(() => {
		if (!user) return;
		professionalService
			.getProfile(user.id)
			.then(setProfile)
			.catch((err) => setError(err.message));
	}, [user]);

	if (loading) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
			</div>
		);
	}

	if (!user) {
		return null;
	}

	const displayName = user.user_metadata?.fullname || user.email || "User";
	const initial = displayName.charAt(0).toUpperCase();

	return (
		<div className="mx-auto max-w-3xl space-y-6">
			{/* Profile Header */}
			<Card className="p-6 sm:p-8">
				<div className="flex flex-col sm:flex-row items-center gap-5">
					<span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-black text-3xl">
						{initial}
					</span>
					<div className="text-center sm:text-left flex-1 min-w-0">
						<h1 className="text-2xl sm:text-3xl font-black text-gray-900 truncate">
							{displayName}
						</h1>
						<p className="mt-1 text-sm text-gray-500 truncate">{user.email}</p>
						{profile && (
							<div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
								<span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700">
									<span>{SKILL_CATEGORY_EMOJIS[profile.category] || "🛠️"}</span>
									{profile.category || "Uncategorized"}
								</span>
								<span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
									📍 {profile.location || "No location set"}
								</span>
							</div>
						)}
					</div>
					<Button
						className="w-full sm:w-auto flex-shrink-0"
						onClick={() => router.push("/dashboard/professional/settings")}
					>
						✏️ Edit Profile
					</Button>
				</div>
			</Card>

			{error && (
				<Card className="p-4 border-red-200 bg-red-50">
					<p className="text-sm text-red-600">{error}</p>
				</Card>
			)}

			{!profile && !error && (
				<Card className="p-8 text-center">
					<p className="text-2xl mb-2">📝</p>
					<h2 className="text-lg font-black text-gray-900">No profile yet</h2>
					<p className="mt-1 text-sm text-gray-500">
						Complete your profile to start receiving customer requests.
					</p>
					<Button
						className="mt-4 w-full sm:w-auto"
						onClick={() => router.push("/dashboard/professional/settings")}
					>
						Set Up Profile
					</Button>
				</Card>
			)}

			{profile && (
				<div className="grid gap-6 sm:grid-cols-2">
					{/* About */}
					<Card className="p-6 sm:col-span-2">
						<h2 className="text-base font-black text-gray-900 mb-3">About</h2>
						<p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
							{profile.bio || "No bio added yet."}
						</p>
					</Card>

					{/* Skills */}
					<Card className="p-6 sm:col-span-2">
						<h2 className="text-base font-black text-gray-900 mb-3">Skills</h2>
						{profile.skills.length > 0 ? (
							<div className="flex flex-wrap gap-2">
								{profile.skills.map((skill) => (
									<span
										key={skill}
										className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700"
									>
										{skill}
									</span>
								))}
							</div>
						) : (
							<p className="text-sm text-gray-500">No skills listed yet.</p>
						)}
					</Card>

					{/* Stats */}
					<Card className="p-6">
						<h2 className="text-base font-black text-gray-900 mb-4">Stats</h2>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-500">Rating</span>
								<span className="text-sm font-bold text-gray-900">
									{profile.averageRating > 0
										? `${profile.averageRating.toFixed(1)} / 5`
										: "No ratings yet"}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-500">Completed Jobs</span>
								<span className="text-sm font-bold text-gray-900">
									{profile.completedJobs}
								</span>
							</div>
						</div>
					</Card>

					{/* Contact */}
					<Card className="p-6">
						<h2 className="text-base font-black text-gray-900 mb-4">Contact</h2>
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-500">WhatsApp</span>
								{profile.whatsappNumber ? (
									<a
										href={`https://wa.me/${profile.whatsappNumber.replace(/[^0-9]/g, "")}`}
										target="_blank"
										rel="noopener noreferrer"
										className="text-sm font-bold text-primary-600 hover:text-primary-700"
									>
										{profile.whatsappNumber}
									</a>
								) : (
									<span className="text-sm text-gray-400">Not provided</span>
								)}
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-500">Email</span>
								<span className="text-sm font-bold text-gray-900 truncate max-w-[180px]">
									{user.email}
								</span>
							</div>
						</div>
					</Card>
				</div>
			)}
		</div>
	);
}
