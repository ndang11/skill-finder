"use client";

import type { User } from "@supabase/supabase-js";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { apiRequest } from "@/services/api";
import { uploadService } from "@/services/upload.service";
import { supabase } from "@/utils/supabase/client";

interface UserProfile {
	id: string;
	email: string;
	fullName: string;
	avatarUrl: string | null;
	bio: string | null;
	location: string | null;
	whatsappNumber: string | null;
	createdAt: string;
}

export default function CustomerProfilePage() {
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [user, setUser] = useState<User | null>(null);
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [authLoading, setAuthLoading] = useState(true);
	const [profileLoading, setProfileLoading] = useState(true);

	// Edit mode
	const [isEditing, setIsEditing] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [avatarUploading, setAvatarUploading] = useState(false);

	// Messages
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	// Form state
	const [formData, setFormData] = useState({
		fullName: "",
		bio: "",
		location: "",
		whatsappNumber: "",
		avatarUrl: "",
	});

	// Auth check
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

	// Fetch user profile from backend
	useEffect(() => {
		if (!user) return;

		apiRequest<UserProfile>("/users/me", { method: "GET" })
			.then((data) => {
				setProfile(data);
				setFormData({
					fullName: data.fullName || "",
					bio: data.bio || "",
					location: data.location || "",
					whatsappNumber: data.whatsappNumber || "",
					avatarUrl: data.avatarUrl || "",
				});
			})
			.catch((err) => {
				console.error("Failed to load profile:", err);
				setErrorMessage("Could not load your profile. Please try again.");
			})
			.finally(() => setProfileLoading(false));
	}, [user]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleAvatarClick = () => {
		if (isEditing) {
			fileInputRef.current?.click();
		}
	};

	const handleAvatarFileChange = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setAvatarUploading(true);
		setErrorMessage(null);

		try {
			const uploadedUrl = await uploadService.handleImageUpload(
				file,
				"avatars",
			);
			setFormData((prev) => ({ ...prev, avatarUrl: uploadedUrl }));
			setSuccessMessage("Photo uploaded! Save to apply changes.");
			setTimeout(() => setSuccessMessage(null), 3000);
		} catch (err) {
			setErrorMessage(
				err instanceof Error
					? err.message
					: "Failed to upload profile picture.",
			);
		} finally {
			setAvatarUploading(false);
		}
	};

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setSuccessMessage(null);
		setErrorMessage(null);

		try {
			// 1. Update Supabase Auth metadata
			if (user) {
				const { error: authError } = await supabase.auth.updateUser({
					data: {
						fullname: formData.fullName,
						avatar_url: formData.avatarUrl,
					},
				});
				if (authError) throw authError;
			}

			// 2. Update backend profile via PATCH /users/me
			const updated = await apiRequest<UserProfile>("/users/me", {
				method: "PATCH",
				body: JSON.stringify({
					fullName: formData.fullName.trim(),
					bio: formData.bio.trim(),
					location: formData.location.trim(),
					whatsappNumber: formData.whatsappNumber.trim(),
					avatarUrl: formData.avatarUrl,
				}),
			});

			setProfile(updated);
			setIsEditing(false);
			setSuccessMessage("Profile updated successfully!");
			setTimeout(() => setSuccessMessage(null), 4000);
		} catch (err) {
			setErrorMessage(
				err instanceof Error ? err.message : "Failed to update profile.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		// Reset form data to current profile
		if (profile) {
			setFormData({
				fullName: profile.fullName || "",
				bio: profile.bio || "",
				location: profile.location || "",
				whatsappNumber: profile.whatsappNumber || "",
				avatarUrl: profile.avatarUrl || "",
			});
		}
		setIsEditing(false);
		setErrorMessage(null);
	};

	const formatDate = (dateStr: string) => {
		try {
			return new Date(dateStr).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			});
		} catch {
			return dateStr;
		}
	};

	// Loading state
	if (authLoading || profileLoading) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
			</div>
		);
	}

	if (!user) return null;

	const displayName = formData.fullName || user.email || "Customer";
	const initial = displayName.charAt(0).toUpperCase();
	const avatarSrc =
		formData.avatarUrl || user.user_metadata?.avatar_url || null;

	return (
		<div className="mx-auto max-w-3xl space-y-6">
			{/* Page Header */}
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
				<div className="flex-1">
					<h1 className="text-2xl font-black text-gray-900">My Profile</h1>
					<p className="text-sm text-gray-500">
						Manage your personal information and public profile.
					</p>
				</div>
				{!isEditing && (
					<Button
						className="w-auto px-5 flex-shrink-0"
						onClick={() => setIsEditing(true)}
					>
						✏️ Edit Profile
					</Button>
				)}
			</div>

			{/* Messages */}
			{successMessage && (
				<div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 animate-in fade-in-50">
					✅ {successMessage}
				</div>
			)}
			{errorMessage && (
				<div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 animate-in fade-in-50">
					⚠️ {errorMessage}
				</div>
			)}

			{/* Profile Hero Card */}
			<Card className="overflow-hidden">
				{/* Gradient Banner */}
				<div className="relative h-32 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-700">
					<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA4KSIvPjwvc3ZnPg==')] opacity-60" />
				</div>

				{/* Avatar + Name Section */}
				<div className="relative px-6 pb-6 sm:px-8">
					<div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12">
						{/* Avatar */}
						<button
							type="button"
							onClick={handleAvatarClick}
							disabled={!isEditing || avatarUploading}
							className={`relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border-4 border-white shadow-lg bg-gray-50 transition-all ${
								isEditing
									? "cursor-pointer hover:ring-4 hover:ring-primary-200"
									: "cursor-default"
							}`}
							aria-label={
								isEditing ? "Change profile picture" : "Profile picture"
							}
						>
							{avatarSrc ? (
								<Image
									src={avatarSrc}
									alt={displayName}
									fill
									className="object-cover"
									unoptimized
								/>
							) : (
								<span className="flex h-full w-full items-center justify-center bg-primary-100 text-3xl font-black text-primary-700">
									{initial}
								</span>
							)}
							{isEditing && (
								<div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
									<span className="text-white text-xs font-bold">
										{avatarUploading ? "Uploading…" : "📷 Change"}
									</span>
								</div>
							)}
						</button>

						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							className="hidden"
							onChange={handleAvatarFileChange}
							disabled={avatarUploading}
						/>

						{/* Name + meta */}
						<div className="text-center sm:text-left flex-1 min-w-0 pb-1">
							<h2 className="text-xl sm:text-2xl font-black text-gray-900 truncate">
								{displayName}
							</h2>
							<p className="text-sm text-gray-500 truncate">{user.email}</p>
							{profile?.createdAt && (
								<p className="mt-1 text-xs text-gray-400">
									Member since {formatDate(profile.createdAt)}
								</p>
							)}
						</div>
					</div>
				</div>
			</Card>

			{/* Profile Details */}
			{isEditing ? (
				/* ─── EDIT MODE ─── */
				<Card className="p-6 sm:p-8">
					<form onSubmit={handleSave} className="space-y-6">
						<h3 className="text-lg font-black text-gray-900">
							Edit Your Information
						</h3>

						<Input
							label="Full Name"
							id="fullName"
							name="fullName"
							type="text"
							placeholder="e.g. John Doe"
							value={formData.fullName}
							onChange={handleChange}
							required
						/>

						<Input
							label="Location"
							id="location"
							name="location"
							type="text"
							placeholder="e.g. Douala, Cameroon"
							value={formData.location}
							onChange={handleChange}
						/>

						<div className="space-y-1">
							<Input
								label="WhatsApp Number"
								id="whatsappNumber"
								name="whatsappNumber"
								type="tel"
								placeholder="e.g. +237 6XX XXX XXX"
								value={formData.whatsappNumber}
								onChange={handleChange}
							/>
							<p className="text-[11px] text-gray-400">
								Include country code so professionals can reach you directly.
							</p>
						</div>

						<div className="space-y-1.5">
							<div className="flex items-center justify-between">
								<label
									htmlFor="bio"
									className="text-sm font-medium text-gray-700 tracking-wide block"
								>
									About Me
								</label>
								<span className="text-xs text-gray-400 font-mono">
									{formData.bio.length}/500
								</span>
							</div>
							<Textarea
								id="bio"
								name="bio"
								rows={4}
								placeholder="Tell professionals a bit about yourself and what services you're looking for…"
								value={formData.bio}
								onChange={handleChange}
								maxLength={500}
							/>
						</div>

						{/* Actions */}
						<div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
							<Button
								type="button"
								variant="outline"
								className="w-auto px-6"
								onClick={handleCancel}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								className="w-auto px-8"
								disabled={isSubmitting || avatarUploading}
							>
								{isSubmitting ? "Saving…" : "Save Changes"}
							</Button>
						</div>
					</form>
				</Card>
			) : (
				/* ─── VIEW MODE ─── */
				<div className="grid gap-6 sm:grid-cols-2">
					{/* About */}
					<Card className="p-6 sm:col-span-2">
						<div className="flex items-center gap-2 mb-3">
							<span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-base">
								📝
							</span>
							<h3 className="text-base font-black text-gray-900">About</h3>
						</div>
						<p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
							{profile?.bio ||
								'No bio added yet. Click "Edit Profile" to tell professionals about yourself.'}
						</p>
					</Card>

					{/* Contact Information */}
					<Card className="p-6">
						<div className="flex items-center gap-2 mb-4">
							<span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-base">
								📱
							</span>
							<h3 className="text-base font-black text-gray-900">Contact</h3>
						</div>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-500">Email</span>
								<span className="text-sm font-bold text-gray-900 truncate max-w-[180px]">
									{user.email}
								</span>
							</div>
							<div className="flex items-center justify-between border-t border-gray-50 pt-3">
								<span className="text-sm text-gray-500">WhatsApp</span>
								{profile?.whatsappNumber ? (
									<a
										href={`https://wa.me/${profile.whatsappNumber.replace(/[^0-9]/g, "")}`}
										target="_blank"
										rel="noopener noreferrer"
										className="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors"
									>
										{profile.whatsappNumber}
									</a>
								) : (
									<span className="text-sm text-gray-400 italic">
										Not provided
									</span>
								)}
							</div>
							<div className="flex items-center justify-between border-t border-gray-50 pt-3">
								<span className="text-sm text-gray-500">Location</span>
								<span className="text-sm font-bold text-gray-900">
									{profile?.location || (
										<span className="text-gray-400 italic font-normal">
											Not set
										</span>
									)}
								</span>
							</div>
						</div>
					</Card>

					{/* Account Details */}
					<Card className="p-6">
						<div className="flex items-center gap-2 mb-4">
							<span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-base">
								🔒
							</span>
							<h3 className="text-base font-black text-gray-900">Account</h3>
						</div>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-500">Role</span>
								<span className="capitalize text-xs font-bold bg-primary-100 text-primary-700 px-2.5 py-0.5 rounded-md">
									{user.user_metadata?.role || "Customer"}
								</span>
							</div>
							<div className="flex items-center justify-between border-t border-gray-50 pt-3">
								<span className="text-sm text-gray-500">Member Since</span>
								<span className="text-sm font-bold text-gray-900">
									{profile?.createdAt ? formatDate(profile.createdAt) : "—"}
								</span>
							</div>
						</div>
					</Card>

					{/* Quick Navigation */}
					<Card className="p-6 sm:col-span-2">
						<div className="flex items-center gap-2 mb-4">
							<span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-base">
								⚡
							</span>
							<h3 className="text-base font-black text-gray-900">
								Quick Actions
							</h3>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
							<button
								type="button"
								onClick={() => router.push("/dashboard/customer/reviews")}
								className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-primary-200 hover:shadow-sm active:scale-[0.98] group"
							>
								<span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-lg group-hover:scale-110 transition-transform">
									⭐
								</span>
								<div>
									<p className="text-sm font-bold text-gray-900">My Reviews</p>
									<p className="text-[11px] text-gray-400">
										Rate professionals
									</p>
								</div>
							</button>

							<button
								type="button"
								onClick={() => router.push("/search")}
								className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-primary-200 hover:shadow-sm active:scale-[0.98] group"
							>
								<span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-lg group-hover:scale-110 transition-transform">
									🔍
								</span>
								<div>
									<p className="text-sm font-bold text-gray-900">Find Pros</p>
									<p className="text-[11px] text-gray-400">
										Search professionals
									</p>
								</div>
							</button>

							<button
								type="button"
								onClick={() => router.push("/dashboard/customer")}
								className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-primary-200 hover:shadow-sm active:scale-[0.98] group"
							>
								<span className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-lg group-hover:scale-110 transition-transform">
									📰
								</span>
								<div>
									<p className="text-sm font-bold text-gray-900">My Feed</p>
									<p className="text-[11px] text-gray-400">Browse updates</p>
								</div>
							</button>
						</div>
					</Card>
				</div>
			)}
		</div>
	);
}
