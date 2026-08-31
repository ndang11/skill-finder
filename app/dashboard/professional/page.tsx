"use client";

import type { User } from "@supabase/supabase-js";
import { Award, MapPin, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PostList from "@/components/feed/PostList";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/context/LanguageContext";
import { usePosts } from "@/hooks/usePosts";
import { professionalService } from "@/services/professional.service";
import type { Professional } from "@/types/professional.types";
import { supabase } from "@/utils/supabase/client";

export default function ProfessionalDashboardPage() {
	const router = useRouter();
	const { t } = useTranslation();
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [profile, setProfile] = useState<Professional | null>(null);

	const {
		posts,
		loading: postsLoading,
		error: postsError,
		fetchPosts,
		handleLike,
		handleAddComment,
		handleDeletePost,
	} = usePosts();

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
		if (user) {
			fetchPosts();
			professionalService
				.getProfile(user.id)
				.then((profileData) => {
					if (profileData) {
						setProfile(profileData);
					}
				})
				.catch((err) => {
					console.error("Failed to load professional profile:", err);
				});
		}
	}, [user, fetchPosts]);

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

	const displayName =
		profile?.fullName ||
		user.user_metadata?.fullname ||
		user.email?.split("@")[0] ||
		"Professional";

	const userInitial = displayName.charAt(0).toUpperCase();
	const userCategory = profile?.category || "Artisan";
	const userLocation = profile?.location || "Cameroon";

	return (
		<div className="space-y-6 pb-12">
			{/* Welcome Banner Card */}
			<div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-primary-950 text-white p-6 sm:p-8 shadow-xl shadow-slate-900/10">
				<div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
				<div className="absolute left-1/3 bottom-0 -mb-20 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

				<div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
					{/* Profile Brief Info */}
					<div className="flex items-center gap-4">
						<div className="relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-white/10 ring-2 ring-emerald-500/30 shadow-lg flex items-center justify-center">
							{profile?.avatarUrl || user.user_metadata?.avatar_url ? (
								<Image
									src={profile?.avatarUrl || user.user_metadata.avatar_url}
									alt={displayName}
									fill
									className="object-cover"
									unoptimized
								/>
							) : (
								<div className="text-2xl sm:text-3xl font-black text-emerald-400">
									{userInitial}
								</div>
							)}
						</div>
						<div className="space-y-1.5">
							<div className="flex items-center flex-wrap gap-2">
								<h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-none">
									{displayName}
								</h1>
								<span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 capitalize border border-emerald-500/30">
									<Award className="h-3 w-3" />
									{t("auth.roleProfessional")}
								</span>
							</div>
							<p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2 flex-wrap font-medium">
								<span className="font-bold text-emerald-400">
									{t(`categories.${userCategory}`) || userCategory}
								</span>
								<span className="text-slate-500">|</span>
								<span className="flex items-center gap-1">
									<MapPin className="h-3.5 w-3.5 text-slate-400" />
									{userLocation}
								</span>
							</p>
						</div>
					</div>

					{/* Create Post Button */}
					<Button
						className="w-full md:w-auto flex-shrink-0 h-11 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 rounded-xl flex items-center justify-center gap-2 active:scale-95"
						onClick={() => router.push("/dashboard/professional/posts/new")}
					>
						<Plus className="h-4.5 w-4.5" />
						<span>
							{t("dashboard.quickActions") === "Actions Rapides"
								? "Nouvelle Publication"
								: "Create Post"}
						</span>
					</Button>
				</div>
			</div>

			{/* Community Posts Feed */}
			<div className="bg-white border border-slate-100 rounded-3xl p-4 sm:p-6 shadow-sm">
				<PostList
					posts={posts}
					loading={postsLoading}
					error={postsError}
					currentUserId={user.id}
					currentUserName={
						profile?.fullName ||
						user.user_metadata?.fullname ||
						user.email ||
						"Professional"
					}
					currentUserRole="professional"
					onLike={handleLike}
					onAddComment={handleAddComment}
					onDelete={handleDeletePost}
					showDelete={true}
					emptyMessage="No updates posted yet."
				/>
			</div>
		</div>
	);
}
