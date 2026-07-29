"use client";

import type { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { bookmarkService } from "@/services/bookmark.service";
import type { BookmarkedSkill } from "@/types/bookmark.types";
import { supabase } from "@/utils/supabase/client";

export default function CustomerBookmarksPage() {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [authLoading, setAuthLoading] = useState(true);

	const [bookmarks, setBookmarks] = useState<BookmarkedSkill[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [removingId, setRemovingId] = useState<string | null>(null);

	// Modal detail state
	const [activeSkill, setActiveSkill] = useState<BookmarkedSkill | null>(null);

	useEffect(() => {
		supabase.auth.getUser().then(({ data }) => {
			setUser(data.user);
			setAuthLoading(false);
		});
	}, []);

	useEffect(() => {
		if (!authLoading && !user) {
			router.push("/login");
		}
	}, [user, authLoading, router]);

	const fetchBookmarks = useCallback(async () => {
		if (!user) return;
		setLoading(true);
		try {
			const data = await bookmarkService.getBookmarks();
			setBookmarks(data);
		} catch (err) {
			console.error("Failed to load bookmarks:", err);
			setError("Failed to load your bookmarked skills.");
		} finally {
			setLoading(false);
		}
	}, [user]);

	useEffect(() => {
		if (user) {
			fetchBookmarks();
		}
	}, [user, fetchBookmarks]);

	// Extract unique categories from saved bookmarks
	const categories = useMemo(() => {
		const set = new Set<string>();
		for (const b of bookmarks) {
			if (b.category) set.add(b.category);
		}
		return Array.from(set);
	}, [bookmarks]);

	// Filtered bookmarks list
	const filteredBookmarks = useMemo(() => {
		return bookmarks.filter((b) => {
			const matchesCategory =
				selectedCategory === "all" ||
				b.category.toLowerCase() === selectedCategory.toLowerCase();
			const q = searchQuery.toLowerCase().trim();
			const matchesSearch =
				!q ||
				b.title.toLowerCase().includes(q) ||
				b.description.toLowerCase().includes(q) ||
				b.category.toLowerCase().includes(q) ||
				b.provider.fullName.toLowerCase().includes(q) ||
				b.provider.location?.toLowerCase().includes(q);

			return matchesCategory && matchesSearch;
		});
	}, [bookmarks, selectedCategory, searchQuery]);

	// Calculate stats
	const stats = useMemo(() => {
		const total = bookmarks.length;
		if (total === 0) return { total: 0, categoriesCount: 0, highestRating: 0 };

		const categoriesCount = new Set(bookmarks.map((b) => b.category)).size;
		const highestRating = Math.max(
			...bookmarks.map((b) => b.provider.averageRating || 0),
		);

		return {
			total,
			categoriesCount,
			highestRating,
		};
	}, [bookmarks]);

	const handleRemoveBookmark = async (skillId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		setRemovingId(skillId);
		try {
			const success = await bookmarkService.removeBookmark(skillId);
			if (success) {
				setBookmarks((prev) => prev.filter((b) => b.skillId !== skillId));
				if (activeSkill?.skillId === skillId) {
					setActiveSkill(null);
				}
			}
		} catch (err) {
			console.error("Failed to remove bookmark:", err);
		} finally {
			setRemovingId(null);
		}
	};

	const formatDate = (dateStr: string) => {
		try {
			return new Date(dateStr).toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			});
		} catch {
			return dateStr;
		}
	};

	if (authLoading || (loading && bookmarks.length === 0)) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
			</div>
		);
	}

	if (!user) return null;

	return (
		<div className="space-y-8">
			{/* Header Navigation & Page Title */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<button
						type="button"
						onClick={() => router.back()}
						className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-all hover:border-gray-300 hover:text-gray-800 active:scale-95"
						aria-label="Go back"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<path d="M19 12H5" />
							<path d="m12 19-7-7 7-7" />
						</svg>
					</button>
					<div>
						<div className="flex items-center gap-2">
							<h1 className="text-2xl font-black text-gray-900">
								My Saved Bookmarks
							</h1>
							<span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-bold text-primary-700">
								{bookmarks.length}
							</span>
						</div>
						<p className="text-sm text-gray-500">
							Quickly access and contact service professionals you saved for
							later.
						</p>
					</div>
				</div>

				<Link href="/dashboard/customer">
					<Button variant="outline" className="text-xs font-bold gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<circle cx="11" cy="11" r="8" />
							<path d="m21 21-4.3-4.3" />
						</svg>
						Explore More Professionals
					</Button>
				</Link>
			</div>

			{error && (
				<div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
					⚠️ {error}
				</div>
			)}

			{/* Overview Banner Card */}
			<Card className="p-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-gray-900 text-white relative overflow-hidden">
				<div className="absolute -right-8 -bottom-8 w-44 h-44 bg-primary-500/10 rounded-full blur-2xl pointer-events-none" />
				<div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
					<div className="flex items-center gap-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl backdrop-blur-sm">
							🔖
						</div>
						<div>
							<p className="text-2xl font-black text-white">{stats.total}</p>
							<p className="text-xs font-medium text-teal-200">
								Saved Professionals
							</p>
						</div>
					</div>

					<div className="pt-4 sm:pt-0 sm:pl-6 flex items-center gap-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl backdrop-blur-sm">
							🏷️
						</div>
						<div>
							<p className="text-2xl font-black text-white">
								{stats.categoriesCount}
							</p>
							<p className="text-xs font-medium text-teal-200">
								Skill Categories
							</p>
						</div>
					</div>

					<div className="pt-4 sm:pt-0 sm:pl-6 flex items-center gap-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl backdrop-blur-sm">
							⭐
						</div>
						<div>
							<p className="text-2xl font-black text-white">
								{stats.highestRating > 0
									? `${stats.highestRating.toFixed(1)} / 5.0`
									: "N/A"}
							</p>
							<p className="text-xs font-medium text-teal-200">
								Top Rating Saved
							</p>
						</div>
					</div>
				</div>
			</Card>

			{/* Search & Category Filter Section */}
			<div className="space-y-4">
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
					{/* Category Pills */}
					<div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
						<button
							type="button"
							onClick={() => setSelectedCategory("all")}
							className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
								selectedCategory === "all"
									? "bg-primary-500 text-white shadow-sm"
									: "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
							}`}
						>
							All Saved ({bookmarks.length})
						</button>
						{categories.map((cat) => (
							<button
								key={cat}
								type="button"
								onClick={() => setSelectedCategory(cat)}
								className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
									selectedCategory === cat
										? "bg-primary-500 text-white shadow-sm"
										: "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
								}`}
							>
								{cat}
							</button>
						))}
					</div>

					{/* Search Input */}
					<div className="w-full sm:w-64">
						<Input
							id="bookmark-search"
							type="text"
							placeholder="Search saved skills or pros..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="text-xs h-9"
						/>
					</div>
				</div>
			</div>

			{/* Bookmarks Grid */}
			{filteredBookmarks.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredBookmarks.map((bookmark) => {
						const isRemoving = removingId === bookmark.skillId;
						const whatsappLink = bookmark.provider.whatsappNumber
							? `https://wa.me/${bookmark.provider.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
									`Hello ${bookmark.provider.fullName}, I saw your skill "${bookmark.title}" bookmarked on SkillFinder and would like to inquire about your services.`,
								)}`
							: null;

						return (
							<Card
								key={bookmark.id}
								className={`p-6 flex flex-col justify-between space-y-4 hover:border-primary-300 hover:shadow-md transition-all group relative overflow-hidden ${
									isRemoving ? "opacity-40 pointer-events-none scale-95" : ""
								}`}
							>
								<div className="space-y-4">
									{/* Top Header Row: Category Badge + Delete Button */}
									<div className="flex items-center justify-between">
										<span className="inline-flex items-center gap-1.5 rounded-lg bg-primary-50 px-2.5 py-1 text-[11px] font-bold text-primary-700 border border-primary-100">
											🛠️ {bookmark.category}
										</span>
										<button
											type="button"
											onClick={(e) => handleRemoveBookmark(bookmark.skillId, e)}
											disabled={isRemoving}
											className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
											title="Remove from bookmarks"
											aria-label="Remove bookmark"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="15"
												height="15"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												aria-hidden="true"
											>
												<path d="M3 6h18" />
												<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
												<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
											</svg>
										</button>
									</div>

									{/* Skill Title & Price */}
									<div>
										<h3 className="text-base font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
											{bookmark.title}
										</h3>
										<p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
											{bookmark.description}
										</p>
									</div>

									{/* Professional Profile Info Card */}
									<div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 border border-gray-100">
										<div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full border border-gray-200 bg-white">
											{bookmark.provider.avatarUrl ? (
												<Image
													src={bookmark.provider.avatarUrl}
													alt={bookmark.provider.fullName}
													fill
													className="object-cover"
													unoptimized
												/>
											) : (
												<span className="flex h-full w-full items-center justify-center bg-primary-100 text-sm font-bold text-primary-700">
													{bookmark.provider.fullName.charAt(0).toUpperCase()}
												</span>
											)}
										</div>

										<div className="min-w-0 flex-1">
											<h4 className="text-xs font-bold text-gray-900 truncate">
												{bookmark.provider.fullName}
											</h4>
											<p className="text-[11px] text-gray-500 flex items-center gap-1 truncate">
												📍 {bookmark.provider.location}
											</p>
											<div className="flex items-center gap-1.5 mt-0.5">
												<span className="text-[11px] font-extrabold text-amber-600 flex items-center gap-0.5">
													★{" "}
													{bookmark.provider.averageRating > 0
														? bookmark.provider.averageRating.toFixed(1)
														: "New"}
												</span>
												<span className="text-[10px] text-gray-400">
													({bookmark.provider.totalReviews} review
													{bookmark.provider.totalReviews !== 1 ? "s" : ""})
												</span>
											</div>
										</div>
									</div>
								</div>

								{/* Bottom Action Footer */}
								<div className="pt-3 border-t border-gray-100 space-y-2">
									<div className="flex items-center justify-between text-xs">
										<span className="font-extrabold text-gray-900">
											{bookmark.price
												? `${bookmark.price.toLocaleString()} FCFA`
												: "Contact for Pricing"}
										</span>
										<span className="text-[10px] text-gray-400">
											Saved {formatDate(bookmark.createdAt)}
										</span>
									</div>

									<div className="grid grid-cols-2 gap-2 pt-1">
										<button
											type="button"
											onClick={() => setActiveSkill(bookmark)}
											className="w-full text-xs font-bold py-2 px-3 bg-white hover:bg-gray-50 text-gray-700 rounded-xl border border-gray-200 transition-all active:scale-95 text-center"
										>
											Details
										</button>

										{whatsappLink ? (
											<a
												href={whatsappLink}
												target="_blank"
												rel="noopener noreferrer"
												className="w-full text-xs font-bold py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all active:scale-95 text-center flex items-center justify-center gap-1 shadow-sm"
											>
												💬 WhatsApp
											</a>
										) : (
											<button
												type="button"
												onClick={() => setActiveSkill(bookmark)}
												className="w-full text-xs font-bold py-2 px-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all active:scale-95 text-center shadow-sm"
											>
												Book Service
											</button>
										)}
									</div>
								</div>
							</Card>
						);
					})}
				</div>
			) : (
				/* Empty Bookmarks State */
				<Card className="p-12 text-center bg-white shadow-sm border border-gray-100">
					<div className="mx-auto max-w-sm space-y-4">
						<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 border border-primary-100 text-3xl">
							🔖
						</div>
						<h3 className="text-lg font-bold text-gray-900">
							{searchQuery || selectedCategory !== "all"
								? "No matching bookmarks found"
								: "No Bookmarked Professionals Yet"}
						</h3>
						<p className="text-xs text-gray-500 leading-relaxed">
							{searchQuery || selectedCategory !== "all"
								? "Try resetting your search query or selecting a different category tab."
								: "Whenever you find a skilled professional you like while browsing, bookmark them to save their details here for quick booking!"}
						</p>
						<div className="pt-2">
							{searchQuery || selectedCategory !== "all" ? (
								<Button
									variant="outline"
									onClick={() => {
										setSearchQuery("");
										setSelectedCategory("all");
									}}
									className="text-xs font-bold"
								>
									Reset Filters
								</Button>
							) : (
								<Link href="/dashboard/customer">
									<Button className="text-xs font-bold">
										Browse Professionals Now
									</Button>
								</Link>
							)}
						</div>
					</div>
				</Card>
			)}

			{/* Detail Modal */}
			{activeSkill && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
					<div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-6 relative border border-gray-100">
						<button
							type="button"
							onClick={() => setActiveSkill(null)}
							className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all"
							aria-label="Close modal"
						>
							✕
						</button>

						<div className="flex items-start gap-4">
							<div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-50">
								{activeSkill.provider.avatarUrl ? (
									<Image
										src={activeSkill.provider.avatarUrl}
										alt={activeSkill.provider.fullName}
										fill
										className="object-cover"
										unoptimized
									/>
								) : (
									<span className="flex h-full w-full items-center justify-center bg-primary-100 text-lg font-bold text-primary-700">
										{activeSkill.provider.fullName.charAt(0).toUpperCase()}
									</span>
								)}
							</div>
							<div>
								<span className="inline-block rounded-md bg-primary-50 px-2 py-0.5 text-[10px] font-bold text-primary-700">
									{activeSkill.category}
								</span>
								<h3 className="text-lg font-bold text-gray-900 mt-1">
									{activeSkill.provider.fullName}
								</h3>
								<p className="text-xs text-gray-500">
									📍 {activeSkill.provider.location}
								</p>
							</div>
						</div>

						<div className="space-y-2 border-t border-b border-gray-100 py-4">
							<h4 className="text-sm font-bold text-gray-900">
								{activeSkill.title}
							</h4>
							<p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
								{activeSkill.description}
							</p>
							{activeSkill.price && (
								<p className="text-sm font-black text-primary-700 pt-2">
									Price: {activeSkill.price.toLocaleString()} FCFA
								</p>
							)}
						</div>

						<div className="flex items-center justify-end gap-3 pt-2">
							<Button
								variant="outline"
								onClick={() => setActiveSkill(null)}
								className="text-xs font-bold"
							>
								Close
							</Button>

							{activeSkill.provider.whatsappNumber && (
								<a
									href={`https://wa.me/${activeSkill.provider.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
										`Hello ${activeSkill.provider.fullName}, I saw your skill "${activeSkill.title}" on SkillFinder and would like to inquire about booking.`,
									)}`}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-all shadow-sm"
								>
									💬 Contact on WhatsApp
								</a>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
