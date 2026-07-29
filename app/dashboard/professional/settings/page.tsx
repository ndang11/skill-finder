"use client";

import type { User } from "@supabase/supabase-js";
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
import { supabase } from "@/utils/supabase/client";

export default function SettingsPage() {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [activeTab, setActiveTab] = useState<"profile" | "account">("profile");

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

	return (
		<div className="mx-auto max-w-2xl space-y-6">
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
				<div>
					<h1 className="text-2xl font-black text-gray-900">
						Account & Profile Settings
					</h1>
					<p className="text-sm text-gray-500">
						Manage your public profile details and account security.
					</p>
				</div>
			</div>

			{/* Tab Switcher */}
			<div className="flex border-b border-gray-200 gap-8">
				<button
					type="button"
					onClick={() => setActiveTab("profile")}
					className={`pb-3 text-sm font-bold border-b-2 transition-all ${
						activeTab === "profile"
							? "border-primary-500 text-primary-600"
							: "border-transparent text-gray-400 hover:text-gray-600"
					}`}
				>
					👤 Profile Settings
				</button>
				<button
					type="button"
					onClick={() => setActiveTab("account")}
					className={`pb-3 text-sm font-bold border-b-2 transition-all ${
						activeTab === "account"
							? "border-primary-500 text-primary-600"
							: "border-transparent text-gray-400 hover:text-gray-600"
					}`}
				>
					🔒 Account & Security
				</button>
			</div>

			{/* Profile Settings Tab */}
			{activeTab === "profile" && (
				<Card className="p-6 sm:p-8">
					<form onSubmit={handleSubmit} className="space-y-6">
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

						{/* Avatar Upload Section */}
						<div className="space-y-2">
							<label
								htmlFor="avatar-upload"
								className="text-sm font-medium text-gray-700 tracking-wide block"
							>
								Profile Picture
							</label>
							<div className="flex items-center gap-5">
								<div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border-2 border-gray-100 bg-gray-50 shadow-sm">
									{formData.avatarUrl ? (
										<Image
											src={formData.avatarUrl}
											alt="Profile Avatar"
											fill
											className="object-cover"
											unoptimized
										/>
									) : (
										<span className="flex h-full w-full items-center justify-center bg-primary-100 text-2xl font-black text-primary-700">
											{initial}
										</span>
									)}
								</div>
								<div>
									<label
										htmlFor="avatar-upload"
										className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-300 active:scale-95"
									>
										{avatarUploading ? "Uploading..." : "📷 Change Photo"}
									</label>
									<input
										id="avatar-upload"
										type="file"
										accept="image/*"
										className="hidden"
										onChange={handleAvatarFileChange}
										disabled={avatarUploading}
									/>
									<p className="mt-1 text-xs text-gray-400">
										JPG, PNG or GIF up to 5MB
									</p>
								</div>
							</div>
						</div>

						{/* Full Name */}
						<Input
							label="Full Name"
							id="fullName"
							name="fullName"
							type="text"
							placeholder="e.g. Sarah Dev"
							value={formData.fullName}
							onChange={handleChange}
							required
						/>

						{/* Location */}
						<Input
							label="Location"
							id="location"
							name="location"
							type="text"
							placeholder="e.g. San Francisco, CA (Remote)"
							value={formData.location}
							onChange={handleChange}
						/>

						{/* WhatsApp Number */}
						<div className="space-y-1">
							<Input
								label="WhatsApp Number"
								id="whatsappNumber"
								name="whatsappNumber"
								type="tel"
								placeholder="e.g. +1234567890"
								value={formData.whatsappNumber}
								onChange={handleChange}
							/>
							<p className="text-[11px] text-gray-400">
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
							<div className="flex flex-wrap gap-2 min-h-[40px] p-3 rounded-xl border border-gray-200 bg-gray-50/50">
								{skills.length > 0 ? (
									skills.map((skill) => (
										<span
											key={skill}
											className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-xs font-bold text-primary-700"
										>
											{skill}
											<button
												type="button"
												onClick={() => handleRemoveSkill(skill)}
												className="hover:text-red-600 transition-colors text-sm leading-none"
												title="Remove skill"
											>
												×
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
									className="flex-1"
								/>
								<Button
									type="button"
									variant="outline"
									className="w-auto px-4"
									onClick={handleAddSkill}
								>
									Add Skill
								</Button>
							</div>
						</div>

						{/* Bio */}
						<div className="space-y-1.5">
							<div className="flex items-center justify-between">
								<label
									htmlFor="bio"
									className="text-sm font-medium text-gray-700 tracking-wide block"
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
							/>
						</div>

						{/* Submit buttons */}
						<div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
							<Button
								type="button"
								variant="outline"
								className="w-auto px-6"
								onClick={() => router.back()}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								className="w-auto px-8"
								disabled={isSubmitting || avatarUploading}
							>
								{isSubmitting ? "Saving..." : "Save Changes"}
							</Button>
						</div>
					</form>
				</Card>
			)}

			{/* Account & Security Tab */}
			{activeTab === "account" && (
				<Card className="p-6 sm:p-8 space-y-6">
					<div>
						<h3 className="text-lg font-bold text-gray-900">Account Details</h3>
						<p className="text-xs text-gray-500">
							Your login credentials and account status.
						</p>
					</div>

					<div className="space-y-4 rounded-xl bg-gray-50 p-4 border border-gray-100 text-sm">
						<div className="flex items-center justify-between">
							<span className="font-semibold text-gray-600">
								Email Address:
							</span>
							<span className="font-mono text-gray-900">{user.email}</span>
						</div>
						<div className="flex items-center justify-between border-t border-gray-200/60 pt-3">
							<span className="font-semibold text-gray-600">Account Role:</span>
							<span className="capitalize font-bold text-primary-700 bg-primary-100 px-2.5 py-0.5 rounded-md text-xs">
								{user.user_metadata?.role || "Professional"}
							</span>
						</div>
					</div>

					{/* Security Section */}
					<div className="space-y-3 pt-2 border-t border-gray-100">
						<h3 className="text-lg font-bold text-gray-900">Security</h3>
						<p className="text-xs text-gray-500">
							Request a secure password reset link sent directly to your
							registered email.
						</p>

						{resetEmailSent ? (
							<div className="rounded-xl border border-green-200 bg-green-50 p-4 text-xs font-semibold text-green-700">
								📩 Password reset email sent to <strong>{user.email}</strong>.
								Please check your inbox.
							</div>
						) : (
							<Button
								type="button"
								variant="outline"
								className="w-auto text-sm px-5 h-10"
								onClick={handlePasswordReset}
								disabled={resetEmailLoading}
							>
								{resetEmailLoading
									? "Sending Email..."
									: "🔑 Send Password Reset Link"}
							</Button>
						)}
					</div>
				</Card>
			)}
		</div>
	);
}
