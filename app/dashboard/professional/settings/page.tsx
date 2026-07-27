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
	const [authLoading, setAuthLoading] = useState(true);
	const [profileLoading, setProfileLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [avatarUploading, setAvatarUploading] = useState(false);
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
			// Upload directly to Cloudinary via upload service
			const uploadedUrl = await uploadService.handleImageUpload(
				file,
				"avatars",
			);
			setFormData((prev) => ({ ...prev, avatarUrl: uploadedUrl }));
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

	const handleAddSkill = (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = newSkillInput.trim();
		if (trimmed && !skills.includes(trimmed)) {
			setSkills([...skills, trimmed]);
			setNewSkillInput("");
		}
	};

	const handleRemoveSkill = (skillToRemove: string) => {
		setSkills(skills.filter((s) => s !== skillToRemove));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setSuccessMessage(null);
		setErrorMessage(null);

		try {
			// Update Supabase user_metadata (fullname + avatar_url)
			if (user) {
				const { error: updateAuthError } = await supabase.auth.updateUser({
					data: {
						fullname: formData.fullName,
						avatar_url: formData.avatarUrl,
					},
				});
				if (updateAuthError) throw updateAuthError;

				// Update avatar in backend database
				if (formData.avatarUrl) {
					await apiRequest("/users/me", {
						method: "PATCH",
						body: JSON.stringify({ avatarUrl: formData.avatarUrl }),
					}).catch((err) => console.warn("Backend user patch error:", err));
				}
			}

			// Update backend Professional record (location, bio, whatsappNumber, skills)
			await professionalService.updateProfile({
				location: formData.location.trim(),
				bio: formData.bio.trim(),
				whatsappNumber: formData.whatsappNumber.trim(),
				skills: skills,
			});

			setSuccessMessage("Profile updated successfully!");
			setTimeout(() => {
				router.push("/dashboard/professional/profile");
			}, 1500);
		} catch (err) {
			setErrorMessage(
				err instanceof Error ? err.message : "Failed to update profile",
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
						Edit Profile Settings
					</h1>
					<p className="text-sm text-gray-500">
						Update your personal and professional information visible to
						clients.
					</p>
				</div>
			</div>

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
					<Input
						label="WhatsApp Number"
						id="whatsappNumber"
						name="whatsappNumber"
						type="tel"
						placeholder="e.g. +1234567890"
						value={formData.whatsappNumber}
						onChange={handleChange}
					/>

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

						{/* Add Skill Form Input */}
						<div className="flex gap-2">
							<Input
								id="newSkillInput"
								type="text"
								placeholder="e.g. NestJS Architecture, Next.js, Plumbing"
								value={newSkillInput}
								onChange={(e) => setNewSkillInput(e.target.value)}
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
						<label
							htmlFor="bio"
							className="text-sm font-medium text-gray-700 tracking-wide block"
						>
							Bio / About Me
						</label>
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
		</div>
	);
}
