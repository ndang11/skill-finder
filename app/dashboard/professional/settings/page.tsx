// app/dashboard/professional/settings/page.tsx
"use client";

import type { User as SupabaseUser } from "@supabase/supabase-js";
import {
	AlertCircle,
	ArrowLeft,
	Camera,
	CheckCircle2,
	KeyRound,
	Loader2,
	Lock,
	Mail,
	MapPin,
	MessageCircle,
	Plus,
	Save,
	Trash2,
	User,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { apiRequest } from "@/services/api";
import { professionalService } from "@/services/professional.service";
import { uploadService } from "@/services/upload.service";
import type { Professional } from "@/types/professional.types";
import { cn } from "@/utils/cn";
import { supabase } from "@/utils/supabase/client";

type Tab = "profile" | "account";

export default function SettingsPage() {
	const router = useRouter();
	const [user, setUser] = useState<SupabaseUser | null>(null);
	const [activeTab, setActiveTab] = useState<Tab>("profile");

	const [authLoading, setAuthLoading] = useState(true);
	const [profileLoading, setProfileLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [avatarUploading, setAvatarUploading] = useState(false);
	const [resetEmailSent, setResetEmailSent] = useState(false);
	const [resetEmailLoading, setResetEmailLoading] = useState(false);

	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const [formData, setFormData] = useState({
		fullName: "",
		avatarUrl: "",
		location: "",
		bio: "",
		whatsappNumber: "",
	});

	const [skills, setSkills] = useState<string[]>([]);
	const [newSkillInput, setNewSkillInput] = useState("");

	useEffect(() => {
		supabase.auth.getUser().then(({ data }) => {
			setUser(data.user);
			setAuthLoading(false);
			if (data.user?.user_metadata) {
				setFormData((prev) => ({
					...prev,
					fullName: data.user.user_metadata.fullname || "",
					avatarUrl: data.user.user_metadata.avatar_url || "",
				}));
			}
		});
	}, []);

	useEffect(() => {
		if (!authLoading && !user) {
			router.push("/login");
		}
	}, [user, authLoading, router]);

	useEffect(() => {
		if (!user) return;

		professionalService
			.getProfile(user.id)
			.then((prof: Professional) => {
				setFormData((prev) => ({
					...prev,
					location: prof.location || "",
					bio: prof.bio || "",
					whatsappNumber: prof.whatsappNumber || "",
				}));
				if (prof.skills && Array.isArray(prof.skills)) {
					setSkills(prof.skills);
				}
			})
			.catch((err) => {
				console.error("Failed to fetch professional profile:", err);
			})
			.finally(() => {
				setProfileLoading(false);
			});
	}, [user]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
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
			setSuccessMessage("Profile picture uploaded successfully.");
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

	const handleAddSkill = () => {
		const trimmed = newSkillInput.trim();
		if (trimmed && !skills.includes(trimmed)) {
			setSkills([...skills, trimmed]);
			setNewSkillInput("");
		}
	};

	const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAddSkill();
		}
	};

	const handleRemoveSkill = (skillToRemove: string) => {
		setSkills(skills.filter((s) => s !== skillToRemove));
	};

	const handlePasswordReset = async () => {
		if (!user?.email) return;
		setResetEmailLoading(true);
		setErrorMessage(null);
		try {
			const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
				redirectTo: `${window.location.origin}/reset-password`,
			});
			if (error) throw error;
			setResetEmailSent(true);
		} catch (err) {
			setErrorMessage(
				err instanceof Error
					? err.message
					: "Failed to send password reset email.",
			);
		} finally {
			setResetEmailLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setSuccessMessage(null);
		setErrorMessage(null);

		try {
			if (user) {
				const { error: updateAuthError } = await supabase.auth.updateUser({
					data: {
						fullname: formData.fullName,
						avatar_url: formData.avatarUrl,
					},
				});
				if (updateAuthError) throw updateAuthError;

				if (formData.avatarUrl) {
					await apiRequest("/users/me", {
						method: "PATCH",
						body: JSON.stringify({ avatarUrl: formData.avatarUrl }),
					}).catch((err) => console.warn("Backend user patch error:", err));
				}
			}

			await professionalService.updateProfile({
				location: formData.location.trim(),
				bio: formData.bio.trim(),
				whatsappNumber: formData.whatsappNumber.trim(),
				skills: skills,
			});

			setSuccessMessage("Settings updated successfully!");
			setTimeout(() => {
				router.push("/dashboard/professional/profile");
			}, 1500);
		} catch (err) {
			setErrorMessage(
				err instanceof Error ? err.message : "Failed to update settings",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (authLoading || profileLoading) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
			</div>
		);
	}

	if (!user) return null;

	const initial = (formData.fullName || user.email || "U")
		.charAt(0)
		.toUpperCase();
	const displayName = formData.fullName || user.email || "Professional";

	const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
		{
			id: "profile",
			label: "Profile Settings",
			icon: <User className="h-4 w-4" />,
		},
		{
			id: "account",
			label: "Account & Security",
			icon: <Lock className="h-4 w-4" />,
		},
	];

	return (
		<div className="space-y-6 sm:space-y-8 bg-gradient-to-br from-primary-50/50 via-white to-green-50/30 -mx-6 -mt-6 px-6 py-6 sm:-mx-8 sm:px-8 sm:py-8 lg:-mx-10 lg:px-10 lg:py-10 min-h-[calc(100vh-4rem)]">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<button
						type="button"
						onClick={() => router.back()}
						className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-all hover:border-gray-300 hover:text-gray-800 active:scale-95 shadow-sm"
						aria-label="Go back"
					>
						<ArrowLeft className="h-5 w-5" />
					</button>
					<div>
						<h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
							Settings
						</h1>
						<p className="text-sm text-gray-500">
							Manage your public profile and account security,{" "}
							{displayName.split(" ")[0]}.
						</p>
					</div>
				</div>
			</div>

			{/* Alerts */}
			{successMessage && (
				<div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 animate-in fade-in-50">
					<CheckCircle2 className="h-5 w-5 flex-shrink-0" />
					{successMessage}
				</div>
			)}
			{errorMessage && (
				<div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 animate-in fade-in-50">
					<AlertCircle className="h-5 w-5 flex-shrink-0" />
					{errorMessage}
				</div>
			)}

			{/* Tab Switcher */}
			<div className="flex flex-col sm:flex-row gap-3">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						type="button"
						onClick={() => setActiveTab(tab.id)}
						className={cn(
							"flex items-center gap-2.5 rounded-xl px-5 py-3 text-sm font-bold transition-all",
							activeTab === tab.id
								? "bg-white text-primary-700 shadow-md shadow-primary-500/10 border border-primary-200"
								: "bg-white/60 text-gray-500 hover:bg-white hover:text-gray-700 border border-transparent",
						)}
					>
						<span
							className={cn(
								"flex h-8 w-8 items-center justify-center rounded-lg",
								activeTab === tab.id
									? "bg-primary-100 text-primary-600"
									: "bg-gray-100 text-gray-500",
							)}
						>
							{tab.icon}
						</span>
						{tab.label}
					</button>
				))}
			</div>

			{/* Profile Settings Tab */}
			{activeTab === "profile" && (
				<Card className="p-6 sm:p-8">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Avatar Upload Section */}
						<div className="flex flex-col sm:flex-row items-start gap-5">
							<div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-gray-100 bg-gray-50 shadow-sm">
								{formData.avatarUrl ? (
									<Image
										src={formData.avatarUrl}
										alt="Profile Avatar"
										fill
										className="object-cover"
										unoptimized
									/>
								) : (
									<span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-100 to-green-100 text-3xl font-black text-primary-700">
										{initial}
									</span>
								)}
								{avatarUploading && (
									<div className="absolute inset-0 flex items-center justify-center bg-black/40">
										<Loader2 className="h-6 w-6 animate-spin text-white" />
									</div>
								)}
							</div>
							<div className="space-y-2">
								<label
									htmlFor="avatar-upload"
									className="text-sm font-medium text-gray-700 tracking-wide block"
								>
									Profile Picture
								</label>
								<label
									htmlFor="avatar-upload"
									className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-300 active:scale-95"
								>
									<Camera className="h-4 w-4" />
									{avatarUploading ? "Uploading..." : "Change Photo"}
								</label>
								<input
									id="avatar-upload"
									type="file"
									accept="image/*"
									className="hidden"
									onChange={handleAvatarFileChange}
									disabled={avatarUploading}
								/>
								<p className="text-xs text-gray-400">
									JPG, PNG or GIF up to 5MB
								</p>
							</div>
						</div>

						{/* Full Name */}
						<div className="space-y-1.5">
							<label
								htmlFor="fullName"
								className="text-sm font-medium text-gray-700 tracking-wide flex items-center gap-2"
							>
								<User className="h-4 w-4 text-gray-400" />
								Full Name
							</label>
							<Input
								id="fullName"
								name="fullName"
								type="text"
								placeholder="e.g. Sarah Dev"
								value={formData.fullName}
								onChange={handleChange}
								required
								className="h-12"
							/>
						</div>

						{/* Location */}
						<div className="space-y-1.5">
							<label
								htmlFor="location"
								className="text-sm font-medium text-gray-700 tracking-wide flex items-center gap-2"
							>
								<MapPin className="h-4 w-4 text-gray-400" />
								Location
							</label>
							<Input
								id="location"
								name="location"
								type="text"
								placeholder="e.g. Douala, Cameroon"
								value={formData.location}
								onChange={handleChange}
								className="h-12"
							/>
						</div>

						{/* WhatsApp Number */}
						<div className="space-y-1.5">
							<label
								htmlFor="whatsappNumber"
								className="text-sm font-medium text-gray-700 tracking-wide flex items-center gap-2"
							>
								<MessageCircle className="h-4 w-4 text-gray-400" />
								WhatsApp Number
							</label>
							<Input
								id="whatsappNumber"
								name="whatsappNumber"
								type="tel"
								placeholder="e.g. +237600000000"
								value={formData.whatsappNumber}
								onChange={handleChange}
								className="h-12"
							/>
							<p className="text-xs text-gray-400">
								Include international country code for direct client chats.
							</p>
						</div>

						{/* Skills Management */}
						<div className="space-y-2">
							<label
								htmlFor="newSkillInput"
								className="text-sm font-medium text-gray-700 tracking-wide block"
							>
								Offered Skills
							</label>

							{/* Active Skill Badges */}
							<div className="flex flex-wrap gap-2 min-h-[48px] p-4 rounded-xl border border-gray-200 bg-gray-50/50">
								{skills.length > 0 ? (
									skills.map((skill) => (
										<span
											key={skill}
											className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1.5 text-xs font-bold text-primary-700"
										>
											{skill}
											<button
												type="button"
												onClick={() => handleRemoveSkill(skill)}
												className="hover:text-red-600 transition-colors text-sm leading-none"
												title="Remove skill"
											>
												<Trash2 className="h-3 w-3" />
											</button>
										</span>
									))
								) : (
									<span className="text-xs text-gray-400 self-center">
										No skills added yet. Add a skill below.
									</span>
								)}
							</div>

							{/* Add Skill Input */}
							<div className="flex gap-2">
								<Input
									id="newSkillInput"
									type="text"
									placeholder="e.g. NestJS Architecture, Next.js, Plumbing"
									value={newSkillInput}
									onChange={(e) => setNewSkillInput(e.target.value)}
									onKeyDown={handleSkillKeyDown}
									className="flex-1 h-12"
								/>
								<Button
									type="button"
									variant="outline"
									className="w-auto px-4 h-12"
									onClick={handleAddSkill}
								>
									<Plus className="h-4 w-4 mr-1.5" />
									Add
								</Button>
							</div>
						</div>

						{/* Bio */}
						<div className="space-y-1.5">
							<div className="flex items-center justify-between">
								<label
									htmlFor="bio"
									className="text-sm font-medium text-gray-700 tracking-wide flex items-center gap-2"
								>
									Bio / About Me
								</label>
								<span className="text-xs text-gray-400 font-mono">
									{formData.bio.length}/1000
								</span>
							</div>
							<Textarea
								id="bio"
								name="bio"
								rows={4}
								placeholder="Tell clients about your experience, qualifications, and services offered..."
								value={formData.bio}
								onChange={handleChange}
								maxLength={1000}
								className="min-h-[120px]"
							/>
						</div>

						{/* Submit buttons */}
						<div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
							<Button
								type="button"
								variant="outline"
								className="w-auto px-6 h-11"
								onClick={() => router.back()}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								className="w-auto px-8 h-11 font-semibold shadow-sm"
								disabled={isSubmitting || avatarUploading}
							>
								{isSubmitting ? (
									<span className="flex items-center gap-2">
										<Loader2 className="h-4 w-4 animate-spin" />
										Saving...
									</span>
								) : (
									<span className="flex items-center gap-2">
										<Save className="h-4 w-4" />
										Save Changes
									</span>
								)}
							</Button>
						</div>
					</form>
				</Card>
			)}

			{/* Account & Security Tab */}
			{activeTab === "account" && (
				<div className="space-y-6">
					{/* Account Details */}
					<Card className="p-6 sm:p-8 space-y-6">
						<div>
							<h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
								<Mail className="h-5 w-5 text-primary-500" />
								Account Details
							</h3>
							<p className="text-xs text-gray-500 mt-1">
								Your login credentials and account status.
							</p>
						</div>

						<div className="space-y-4 rounded-xl bg-gray-50 p-5 border border-gray-100">
							<div className="flex items-center justify-between gap-4">
								<span className="font-semibold text-gray-600 text-sm">
									Email Address:
								</span>
								<span className="font-mono text-gray-900 text-sm font-bold truncate">
									{user.email}
								</span>
							</div>
							<div className="flex items-center justify-between gap-4 border-t border-gray-200/60 pt-4">
								<span className="font-semibold text-gray-600 text-sm">
									Account Role:
								</span>
								<span className="capitalize font-bold text-primary-700 bg-primary-100 px-3 py-1 rounded-lg text-xs">
									{user.user_metadata?.role || "Professional"}
								</span>
							</div>
						</div>
					</Card>

					{/* Security Section */}
					<Card className="p-6 sm:p-8 space-y-6">
						<div>
							<h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
								<KeyRound className="h-5 w-5 text-primary-500" />
								Security
							</h3>
							<p className="text-xs text-gray-500 mt-1">
								Request a secure password reset link sent directly to your
								registered email.
							</p>
						</div>

						{resetEmailSent ? (
							<div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
								<CheckCircle2 className="h-5 w-5 flex-shrink-0" />
								Password reset email sent to <strong>{user.email}</strong>.
								Please check your inbox.
							</div>
						) : (
							<Button
								type="button"
								variant="outline"
								className="w-auto text-sm px-5 h-11"
								onClick={handlePasswordReset}
								disabled={resetEmailLoading}
							>
								{resetEmailLoading ? (
									<span className="flex items-center gap-2">
										<Loader2 className="h-4 w-4 animate-spin" />
										Sending Email...
									</span>
								) : (
									<span className="flex items-center gap-2">
										<KeyRound className="h-4 w-4" />
										Send Password Reset Link
									</span>
								)}
							</Button>
						)}
					</Card>
				</div>
			)}
		</div>
	);
}
