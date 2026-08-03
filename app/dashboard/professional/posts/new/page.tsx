"use client";

import type { User } from "@supabase/supabase-js";
import {
	AlignLeft,
	ArrowLeft,
	Calendar,
	CheckCircle2,
	Eye,
	Hash,
	ImageIcon,
	Loader2,
	Megaphone,
	Send,
	Sparkles,
	Tag,
	Trash2,
	Type,
	Upload,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { postService } from "@/services/post.service";
import { uploadService } from "@/services/upload.service";
import { cn } from "@/utils/cn";
import { supabase } from "@/utils/supabase/client";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
	"Solar Installation",
	"Hairdressing",
	"Mechanics",
	"Tailoring / Fashion",
	"Plumbing",
	"Electrical",
	"Carpentry",
	"Painting",
	"Photography",
	"Catering / Chef",
	"Software Engineering",
	"Other",
];

const POST_TYPES = [
	{
		id: "showcase",
		label: "Work Showcase",
		description: "Show off a completed project or piece of work",
		icon: ImageIcon,
		color: "text-blue-600",
		bg: "bg-blue-50",
		border: "border-blue-200",
		activeBg: "bg-blue-50",
		activeBorder: "border-blue-500",
		ring: "ring-blue-100",
	},
	{
		id: "tip",
		label: "Pro Tip",
		description: "Share a useful tip or trick with the community",
		icon: Sparkles,
		color: "text-amber-600",
		bg: "bg-amber-50",
		border: "border-amber-200",
		activeBg: "bg-amber-50",
		activeBorder: "border-amber-500",
		ring: "ring-amber-100",
	},
	{
		id: "availability",
		label: "Availability Update",
		description: "Let customers know your current availability",
		icon: Calendar,
		color: "text-emerald-600",
		bg: "bg-emerald-50",
		border: "border-emerald-200",
		activeBg: "bg-emerald-50",
		activeBorder: "border-emerald-500",
		ring: "ring-emerald-100",
	},
	{
		id: "announcement",
		label: "Announcement",
		description: "Make a general announcement to your followers",
		icon: Megaphone,
		color: "text-purple-600",
		bg: "bg-purple-50",
		border: "border-purple-200",
		activeBg: "bg-purple-50",
		activeBorder: "border-purple-500",
		ring: "ring-purple-100",
	},
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormValues {
	title: string;
	content: string;
	category: string;
	postType: string;
	tags: string;
}

interface FormErrors {
	title?: string;
	content?: string;
	category?: string;
	postType?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function CharCount({ current, max }: { current: number; max: number }) {
	const remaining = max - current;
	const isNear = remaining <= 50;
	const isOver = remaining < 0;
	return (
		<span
			className={cn(
				"text-xs tabular-nums font-medium",
				isOver
					? "text-red-500 font-semibold"
					: isNear
						? "text-amber-500"
						: "text-gray-400",
			)}
		>
			{current}/{max}
		</span>
	);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NewPostPage() {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [authLoading, setAuthLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const [serverError, setServerError] = useState<string | null>(null);
	const imageInputRef = useRef<HTMLInputElement>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [imageUploading, setImageUploading] = useState(false);

	const [values, setValues] = useState<FormValues>({
		title: "",
		content: "",
		category: "",
		postType: "",
		tags: "",
	});
	const [errors, setErrors] = useState<FormErrors>({});
	const [touched, setTouched] = useState<Record<string, boolean>>({});

	// ── Auth guard ──────────────────────────────────────────────────────────────
	useEffect(() => {
		supabase.auth.getUser().then(({ data }) => {
			setUser(data.user);
			setAuthLoading(false);
		});
	}, []);

	useEffect(() => {
		if (!authLoading && !user) router.push("/login");
	}, [user, authLoading, router]);

	// ── Validation ──────────────────────────────────────────────────────────────
	function validate(vals: FormValues): FormErrors {
		const errs: FormErrors = {};
		if (!vals.postType) errs.postType = "Please select a post type.";
		if (!vals.title.trim()) errs.title = "Title is required.";
		else if (vals.title.length > 100)
			errs.title = "Title must be 100 characters or fewer.";
		if (!vals.content.trim()) errs.content = "Content is required.";
		else if (vals.content.length > 1000)
			errs.content = "Content must be 1000 characters or fewer.";
		if (!vals.category) errs.category = "Please select a category.";
		return errs;
	}

	// ── Field handlers ──────────────────────────────────────────────────────────
	function handleChange(field: keyof FormValues, value: string) {
		setValues((prev) => ({ ...prev, [field]: value }));
		if (touched[field]) {
			const newVals = { ...values, [field]: value };
			setErrors(validate(newVals));
		}
	}

	function handleBlur(field: keyof FormValues) {
		setTouched((prev) => ({ ...prev, [field]: true }));
		setErrors(validate(values));
	}

	// ── Image handling ──────────────────────────────────────────────────────────
	async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		setImageFile(file);

		const reader = new FileReader();
		reader.onload = (ev) => setImagePreview(ev.target?.result as string);
		reader.readAsDataURL(file);

		try {
			setImageUploading(true);
			const url = await uploadService.handleImageUpload(file, "posts");
			setImageUrl(url);
		} catch {
			setImageUrl(null);
		} finally {
			setImageUploading(false);
		}
	}

	function removeImage() {
		setImagePreview(null);
		setImageFile(null);
		setImageUrl(null);
		if (imageInputRef.current) imageInputRef.current.value = "";
	}

	// ── Submit ──────────────────────────────────────────────────────────────────
	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const allTouched = Object.fromEntries(
			Object.keys(values).map((k) => [k, true]),
		);
		setTouched(allTouched);
		const errs = validate(values);
		setErrors(errs);
		if (Object.keys(errs).length > 0) return;

		setIsSubmitting(true);
		setServerError(null);

		try {
			await postService.createPost({
				title: values.title.trim(),
				content: values.content.trim(),
				authorCategory: values.category,
				postType: values.postType,
				tags: values.tags
					.split(",")
					.map((t) => t.trim())
					.filter(Boolean),
				imageUrl: imageUrl ?? undefined,
			});

			setSubmitSuccess(true);
			setTimeout(() => router.push("/dashboard/professional"), 1800);
		} catch (err) {
			setServerError(
				err instanceof Error ? err.message : "Failed to publish post.",
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	// ── Loading / auth ──────────────────────────────────────────────────────────
	if (authLoading) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
			</div>
		);
	}

	if (!user) return null;

	// ── Success state ───────────────────────────────────────────────────────────
	if (submitSuccess) {
		return (
			<div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
				<div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-50 text-4xl animate-in zoom-in-50">
					<CheckCircle2 className="h-10 w-10 text-primary-600" />
				</div>
				<h2 className="text-2xl font-black text-gray-900">Post Published!</h2>
				<p className="text-gray-500">Redirecting you back to your dashboard…</p>
			</div>
		);
	}

	const displayName =
		user.user_metadata?.fullname?.split(" ")[0] || "Professional";
	const selectedPostType = POST_TYPES.find((t) => t.id === values.postType);

	return (
		<div className="space-y-6 sm:space-y-8 bg-gradient-to-br from-primary-50/50 via-white to-green-50/30 -mx-6 -mt-6 px-6 py-6 sm:-mx-8 sm:px-8 sm:py-8 lg:-mx-10 lg:px-10 lg:py-10 min-h-[calc(100vh-4rem)]">
			{/* ── Page Header ── */}
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
						<h1 className="text-2xl font-black text-gray-900 tracking-tight">
							Create New Post
						</h1>
						<p className="text-sm text-gray-500">
							Share your work, tips, or updates with the community,{" "}
							{displayName}.
						</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-xs text-gray-400 hidden sm:inline">
						{Object.values(values).filter(Boolean).length} of 5 fields filled
					</span>
				</div>
			</div>

			<form onSubmit={handleSubmit} noValidate className="space-y-6">
				{/* ── Global server error ── */}
				{serverError && (
					<Card className="p-4 border-red-200 bg-red-50">
						<p className="text-sm font-medium text-red-700 flex items-center gap-2">
							<span className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center text-xs">
								!
							</span>
							{serverError}
						</p>
					</Card>
				)}

				{/* ── Step 1: Post Type ── */}
				<Card className="p-6 sm:p-8 space-y-5">
					<div className="flex items-center gap-3">
						<span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-xs font-black text-white ring-4 ring-primary-100">
							1
						</span>
						<div>
							<h2 className="text-base font-black text-gray-900">
								What are you posting?
							</h2>
							<p className="text-xs text-gray-500">
								Choose the type that best fits your content
							</p>
						</div>
					</div>

					<div className="grid gap-3 sm:grid-cols-2">
						{POST_TYPES.map((type) => {
							const Icon = type.icon;
							const isActive = values.postType === type.id;
							return (
								<button
									key={type.id}
									type="button"
									onClick={() => handleChange("postType", type.id)}
									className={cn(
										"flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all active:scale-[0.99]",
										isActive
											? `${type.activeBorder} ${type.activeBg} ring-2 ${type.ring}`
											: "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50",
									)}
								>
									<div
										className={cn(
											"flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg",
											isActive ? type.bg : "bg-gray-100",
										)}
									>
										<Icon
											className={cn(
												"h-5 w-5",
												isActive ? type.color : "text-gray-500",
											)}
										/>
									</div>
									<div className="flex-1 min-w-0">
										<p
											className={cn(
												"text-sm font-bold leading-tight",
												isActive ? type.color : "text-gray-800",
											)}
										>
											{type.label}
										</p>
										<p className="mt-0.5 text-xs text-gray-500">
											{type.description}
										</p>
									</div>
									{isActive && (
										<span className={cn("flex-shrink-0 mt-0.5", type.color)}>
											<CheckCircle2 className="h-5 w-5" />
										</span>
									)}
								</button>
							);
						})}
					</div>

					{touched.postType && errors.postType && (
						<p className="text-xs font-medium text-red-500 animate-in fade-in-50 flex items-center gap-1">
							<span className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center text-[10px] font-bold text-red-600">
								!
							</span>
							{errors.postType}
						</p>
					)}
				</Card>

				{/* ── Step 2: Content ── */}
				<Card className="p-6 sm:p-8 space-y-5">
					<div className="flex items-center gap-3">
						<span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-xs font-black text-white ring-4 ring-primary-100">
							2
						</span>
						<div>
							<h2 className="text-base font-black text-gray-900">
								Write your post
							</h2>
							<p className="text-xs text-gray-500">
								Craft a compelling title and description
							</p>
						</div>
					</div>

					{/* Title */}
					<div className="space-y-1.5">
						<div className="flex items-center justify-between">
							<label
								htmlFor="title"
								className="text-sm font-medium text-gray-700 tracking-wide flex items-center gap-2"
							>
								<Type className="h-4 w-4 text-gray-400" />
								Title
							</label>
							<CharCount current={values.title.length} max={100} />
						</div>
						<Input
							id="title"
							name="title"
							type="text"
							placeholder="Give your post a compelling title…"
							value={values.title}
							onChange={(e) => handleChange("title", e.target.value)}
							onBlur={() => handleBlur("title")}
							error={touched.title ? errors.title : undefined}
							maxLength={110}
							className="h-12"
						/>
					</div>

					{/* Content */}
					<div className="space-y-1.5">
						<div className="flex items-center justify-between">
							<label
								htmlFor="content"
								className="text-sm font-medium text-gray-700 tracking-wide flex items-center gap-2"
							>
								<AlignLeft className="h-4 w-4 text-gray-400" />
								Content
							</label>
							<CharCount current={values.content.length} max={1000} />
						</div>
						<Textarea
							id="content"
							name="content"
							rows={6}
							placeholder="Describe your work, share your insight, or write your update…"
							value={values.content}
							onChange={(e) => handleChange("content", e.target.value)}
							onBlur={() => handleBlur("content")}
							error={touched.content ? errors.content : undefined}
							maxLength={1020}
							className="min-h-[140px]"
						/>
					</div>

					{/* Category */}
					<div className="space-y-1.5">
						<label
							htmlFor="category"
							className="text-sm font-medium text-gray-700 tracking-wide flex items-center gap-2"
						>
							<Hash className="h-4 w-4 text-gray-400" />
							Category
						</label>
						<div className="relative">
							<select
								id="category"
								name="category"
								value={values.category}
								onChange={(e) => handleChange("category", e.target.value)}
								onBlur={() => handleBlur("category")}
								className={cn(
									"flex h-12 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100",
									!values.category && "text-gray-400",
									touched.category &&
										errors.category &&
										"border-red-500 focus:border-red-500 focus:ring-red-100",
								)}
							>
								<option value="" disabled>
									Select your skill category…
								</option>
								{CATEGORIES.map((cat) => (
									<option key={cat} value={cat}>
										{cat}
									</option>
								))}
							</select>
							<div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden="true"
								>
									<path d="m6 9 6 6 6-6" />
								</svg>
							</div>
						</div>
						{touched.category && errors.category && (
							<p className="text-xs font-medium text-red-500 animate-in fade-in-50 flex items-center gap-1">
								<span className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center text-[10px] font-bold text-red-600">
									!
								</span>
								{errors.category}
							</p>
						)}
					</div>

					{/* Tags */}
					<div className="space-y-1.5">
						<label
							htmlFor="tags"
							className="text-sm font-medium text-gray-700 tracking-wide flex items-center gap-2"
						>
							<Tag className="h-4 w-4 text-gray-400" />
							Tags
							<span className="text-xs text-gray-400 font-normal">
								(optional)
							</span>
						</label>
						<Input
							id="tags"
							name="tags"
							type="text"
							placeholder="e.g. carpentry, wood-work, renovation"
							value={values.tags}
							onChange={(e) => handleChange("tags", e.target.value)}
							className="h-12"
						/>
						<p className="text-xs text-gray-400 flex items-center gap-1">
							<span className="h-3 w-3 rounded-full bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-500">
								i
							</span>
							Separate tags with commas to help customers discover your post.
						</p>
					</div>
				</Card>

				{/* ── Step 3: Media ── */}
				<Card className="p-6 sm:p-8 space-y-4">
					<div className="flex items-center gap-3">
						<span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-black text-gray-600 ring-4 ring-gray-100">
							3
						</span>
						<div>
							<h2 className="text-base font-black text-gray-900">
								Add a photo{" "}
								<span className="text-sm font-normal text-gray-400">
									(optional)
								</span>
							</h2>
							<p className="text-xs text-gray-500">
								Posts with photos get significantly more engagement.
							</p>
						</div>
					</div>

					{imagePreview ? (
						<div className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm">
							<Image
								src={imagePreview}
								alt="Post image preview"
								width={800}
								height={288}
								className="w-full max-h-72 object-cover"
								unoptimized
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
							<button
								type="button"
								onClick={removeImage}
								className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-600 shadow-lg"
								aria-label="Remove image"
							>
								<Trash2 className="h-4 w-4" />
							</button>
							<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
								<p className="text-xs text-white font-medium truncate flex items-center gap-2">
									<ImageIcon className="h-3 w-3" />
									{imageFile?.name}
								</p>
								{imageUploading && (
									<span className="flex items-center gap-1 text-xs text-white/80">
										<Loader2 className="h-3 w-3 animate-spin" />
										Uploading…
									</span>
								)}
								{!imageUploading && imageUrl && (
									<span className="text-xs text-green-300 font-semibold flex items-center gap-1">
										<CheckCircle2 className="h-3 w-3" />
										Ready
									</span>
								)}
							</div>
						</div>
					) : (
						<button
							type="button"
							onClick={() => imageInputRef.current?.click()}
							className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-6 py-12 transition-all hover:border-primary-300 hover:bg-primary-50/30 active:scale-[0.99]"
						>
							<div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary-600">
								<Upload className="h-6 w-6" />
							</div>
							<div className="text-center">
								<p className="text-sm font-semibold text-gray-700">
									Click to upload a photo
								</p>
								<p className="text-xs text-gray-400 mt-0.5">
									PNG, JPG, WEBP up to 10MB
								</p>
							</div>
						</button>
					)}

					<input
						ref={imageInputRef}
						type="file"
						accept="image/png,image/jpeg,image/webp"
						className="hidden"
						onChange={handleImageChange}
						aria-label="Upload post image"
					/>
				</Card>

				{/* ── Preview strip ── */}
				{values.title && values.postType && (
					<Card className="p-5 border-primary-100 bg-primary-50/50">
						<div className="flex items-start gap-4">
							<div
								className={cn(
									"flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg",
									selectedPostType?.bg || "bg-gray-100",
								)}
							>
								{selectedPostType && (
									<selectedPostType.icon
										className={cn(
											"h-5 w-5",
											selectedPostType?.color || "text-gray-500",
										)}
									/>
								)}
							</div>
							<div className="min-w-0 flex-1">
								<p className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-0.5 flex items-center gap-1">
									<Eye className="h-3 w-3" />
									Preview
								</p>
								<p className="text-sm font-bold text-gray-900 truncate">
									{values.title || "Your post title"}
								</p>
								{values.content && (
									<p className="mt-1 text-xs text-gray-500 line-clamp-2">
										{values.content}
									</p>
								)}
								{values.category && (
									<span className="inline-block mt-2 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-600">
										{values.category}
									</span>
								)}
							</div>
						</div>
					</Card>
				)}

				{/* ── Submit row ── */}
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
					<Button
						type="button"
						variant="outline"
						className="w-full sm:w-auto px-6 h-11"
						onClick={() => router.back()}
					>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Cancel
					</Button>
					<Button
						type="submit"
						className="w-full sm:w-auto px-8 h-11 font-semibold shadow-sm"
						disabled={isSubmitting || imageUploading}
					>
						{isSubmitting ? (
							<span className="flex items-center gap-2">
								<Loader2 className="h-4 w-4 animate-spin" />
								Publishing…
							</span>
						) : (
							<span className="flex items-center gap-2">
								<Send className="h-4 w-4" />
								Publish Post
							</span>
						)}
					</Button>
				</div>
			</form>
		</div>
	);
}
