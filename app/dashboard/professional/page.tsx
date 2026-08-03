"use client";

import type { User } from "@supabase/supabase-js";
import {
	ArrowUpRight,
	Award,
	Briefcase,
	Calendar,
	Eye,
	FileText,
	MessageSquare,
	Plus,
	Star,
	ThumbsUp,
	TrendingUp,
	Users,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PostList from "@/components/feed/PostList";
import { Button } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { usePosts } from "@/hooks/usePosts";
import { supabase } from "@/utils/supabase/client";

interface StatCard {
	label: string;
	value: string | number;
	icon: React.ReactNode;
	color: string;
	bg: string;
	trend?: string;
}

interface QuickAction {
	label: string;
	description: string;
	icon: React.ReactNode;
	href: string;
	variant?: "primary" | "secondary" | "outline";
}

const quickActions: QuickAction[] = [
	{
		label: "Edit Profile",
		description: "Update your skills, bio & contact",
		icon: <Briefcase className="h-5 w-5" />,
		href: "/dashboard/professional/profile",
		variant: "primary",
	},
	{
		label: "Create Post",
		description: "Share work updates with clients",
		icon: <Plus className="h-5 w-5" />,
		href: "/dashboard/professional/posts/new",
		variant: "secondary",
	},
	{
		label: "My Reviews",
		description: "View client feedback & ratings",
		icon: <Star className="h-5 w-5" />,
		href: "/dashboard/professional/reviews",
		variant: "outline",
	},
	{
		label: "Portfolio",
		description: "Manage your work showcase",
		icon: <FileText className="h-5 w-5" />,
		href: "/dashboard/professional/portfolio",
		variant: "outline",
	},
];

export default function ProfessionalDashboardPage() {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState<StatCard[]>([]);

	const {
		posts,
		loading: postsLoading,
		error: postsError,
		fetchPosts,
		handleLike,
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
			setStats([
				{
					label: "Profile Views",
					value: "128",
					icon: <Eye className="h-5 w-5" />,
					color: "text-blue-600",
					bg: "bg-blue-50",
					trend: "+12%",
				},
				{
					label: "Active Posts",
					value: posts.length,
					icon: <FileText className="h-5 w-5" />,
					color: "text-primary-600",
					bg: "bg-primary-50",
				},
				{
					label: "Reviews",
					value: "4.8",
					icon: <Star className="h-5 w-5" />,
					color: "text-amber-600",
					bg: "bg-amber-50",
					trend: "★ 4.8",
				},
				{
					label: "Bookings",
					value: "16",
					icon: <Calendar className="h-5 w-5" />,
					color: "text-emerald-600",
					bg: "bg-emerald-50",
					trend: "+3 this week",
				},
			]);
		}
	}, [user, fetchPosts, posts.length]);

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
		user.user_metadata?.fullname?.split(" ")[0] || "Professional";
	const userInitial = (user.user_metadata?.fullname || user.email || "U")
		.charAt(0)
		.toUpperCase();
	const userRole = user.user_metadata?.role || "professional";

	return (
		<div className="space-y-6 sm:space-y-8 bg-gradient-to-br from-primary-50/60 via-gray-50/80 to-green-50/40 -mx-6 -mt-6 px-6 py-6 sm:-mx-8 sm:px-8 sm:py-8 lg:-mx-10 lg:px-10 lg:py-10 min-h-[calc(100vh-4rem)]">
			{/* Welcome Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<div className="relative h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-100 to-green-100 ring-2 ring-white shadow-md">
						{user.user_metadata?.avatar_url ? (
							<Image
								src={user.user_metadata.avatar_url}
								alt={displayName}
								fill
								className="object-cover"
								unoptimized
							/>
						) : (
							<div className="flex h-full w-full items-center justify-center text-xl sm:text-2xl font-black text-primary-700">
								{userInitial}
							</div>
						)}
					</div>
					<div>
						<h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
							Welcome back, {displayName}
						</h1>
						<p className="mt-1 text-sm text-gray-500 flex items-center gap-2">
							<span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-bold text-primary-700 capitalize">
								<Award className="h-3 w-3" />
								{userRole}
							</span>
							<span className="hidden sm:inline text-gray-300">|</span>
							<span>Manage your profile & connect with customers</span>
						</p>
					</div>
				</div>
				<Button
					className="w-full sm:w-auto flex-shrink-0 h-10 px-5 text-sm font-semibold shadow-sm"
					onClick={() => router.push("/dashboard/professional/posts/new")}
				>
					<Plus className="h-4 w-4 mr-2" />
					New Post
				</Button>
			</div>

			{/* Stats Grid */}
			<div className="grid gap-4 sm:gap-5 grid-cols-2 lg:grid-cols-4">
				{stats.map((stat) => (
					<Card
						key={stat.label}
						className="p-4 sm:p-5 relative overflow-hidden transition-all hover:shadow-md hover:border-gray-300 group"
					>
						<div className="flex items-start justify-between">
							<div className="flex-1 min-w-0">
								<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide truncate">
									{stat.label}
								</p>
								<p className="mt-2 text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
									{stat.value}
								</p>
								{stat.trend && (
									<p className="mt-1 text-xs font-semibold text-gray-400 flex items-center gap-1">
										<TrendingUp className="h-3 w-3 text-emerald-500" />
										{stat.trend}
									</p>
								)}
							</div>
							<div
								className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color} shadow-sm group-hover:scale-105 transition-transform`}
							>
								{stat.icon}
							</div>
						</div>
					</Card>
				))}
			</div>

			{/* Quick Actions */}
			<div>
				<h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
					<TrendingUp className="h-5 w-5 text-primary-500" />
					Quick Actions
				</h2>
				<div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
					{quickActions.map((action) => (
						<Card
							key={action.href}
							className="p-4 sm:p-5 cursor-pointer transition-all hover:shadow-lg hover:border-primary-200 hover:-translate-y-0.5 group"
							onClick={() => router.push(action.href)}
						>
							<div className="flex items-start gap-4">
								<div
									className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
										action.variant === "primary"
											? "bg-primary-500 text-white"
											: action.variant === "secondary"
												? "bg-gray-100 text-gray-700"
												: "bg-gray-50 text-gray-600 group-hover:bg-primary-50 group-hover:text-primary-600"
									} transition-colors`}
								>
									{action.icon}
								</div>
								<div className="flex-1 min-w-0">
									<h3 className="text-sm font-bold text-gray-900 truncate group-hover:text-primary-700 transition-colors">
										{action.label}
									</h3>
									<p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
										{action.description}
									</p>
								</div>
								<ArrowUpRight className="h-4 w-4 text-gray-300 group-hover:text-primary-500 transition-colors flex-shrink-0 mt-1" />
							</div>
						</Card>
					))}
				</div>
			</div>

			{/* Main Content: Recent Posts */}
			<div className="grid gap-6 lg:grid-cols-[1fr_300px]">
				{/* Feed Column */}
				<div className="space-y-5">
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
							<MessageSquare className="h-5 w-5 text-primary-500" />
							Recent Platform Updates
						</h2>
						<span className="text-xs text-gray-400">
							{posts.length} post{posts.length !== 1 ? "s" : ""}
						</span>
					</div>

					<PostList
						posts={posts}
						loading={postsLoading}
						error={postsError}
						currentUserId={user.id}
						currentUserName={
							user.user_metadata?.fullname || user.email || "Professional"
						}
						currentUserRole="professional"
						onLike={handleLike}
						onDelete={handleDeletePost}
						showDelete={false}
						emptyMessage="No platform updates yet."
					/>
				</div>

				{/* Right Sidebar */}
				<div className="space-y-5 hidden lg:block">
					{/* Profile Summary */}
					<Card className="p-5 space-y-4">
						<h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
							<Users className="h-4 w-4 text-primary-500" />
							Your Audience
						</h3>
						<div className="space-y-3">
							<div className="flex items-center justify-between text-sm">
								<span className="text-gray-500">Total Reach</span>
								<span className="font-bold text-gray-900">1.2k</span>
							</div>
							<div className="flex items-center justify-between text-sm">
								<span className="text-gray-500">Profile Clicks</span>
								<span className="font-bold text-gray-900">86</span>
							</div>
							<div className="flex items-center justify-between text-sm">
								<span className="text-gray-500">Post Engagement</span>
								<span className="font-bold text-gray-900">4.2%</span>
							</div>
						</div>
						<div className="pt-3 border-t border-gray-100">
							<div className="flex items-center gap-2 text-xs text-gray-500">
								<ThumbsUp className="h-3.5 w-3.5 text-emerald-500" />
								<span className="font-medium">
									Your posts are performing well this week
								</span>
							</div>
						</div>
					</Card>

					{/* Tips Card */}
					<Card className="p-5 bg-gradient-to-br from-primary-50 to-green-50 border-primary-100 space-y-3">
						<h3 className="text-sm font-black text-primary-900 flex items-center gap-2">
							<TrendingUp className="h-4 w-4" />
							Pro Tip
						</h3>
						<p className="text-xs text-primary-700 leading-relaxed">
							Share regular posts with photos of your completed work to attract
							more customers and boost your profile views.
						</p>
					</Card>

					{/* Post Settings */}
					<Card className="p-5 space-y-3">
						<h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
							<FileText className="h-4 w-4 text-primary-500" />
							Manage Posts
						</h3>
						<Button
							variant="secondary"
							className="w-full text-sm h-10"
							onClick={() => router.push("/dashboard/professional/posts")}
						>
							All My Posts
						</Button>
						<Button
							variant="outline"
							className="w-full text-sm h-10"
							onClick={() => router.push("/dashboard/professional/posts/new")}
						>
							+ Create New Post
						</Button>
					</Card>
				</div>
			</div>
		</div>
	);
}
