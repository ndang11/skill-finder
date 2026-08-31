// components/auth/RegisterForm.tsx
"use client";

import { useFormik } from "formik";
import {
	ArrowLeft,
	ArrowRight,
	Check,
	Shield,
	User,
	UserCheck,
	Wrench,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import * as Yup from "yup";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useTranslation } from "@/context/LanguageContext";
import { apiRequest } from "@/services/api";
import { supabase } from "@/utils/supabase/client";

const EyeIcon = ({ show }: { show: boolean }) =>
	show ? (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-label="Hide password"
			role="img"
		>
			<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
			<line x1="1" y1="1" x2="23" y2="23" />
		</svg>
	) : (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-label="Show password"
			role="img"
		>
			<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
			<circle cx="12" cy="12" r="3" />
		</svg>
	);

const SERVICE_CATEGORIES = [
	"Electrician",
	"Plumber",
	"Mechanic",
	"Carpenter",
	"Solar Installer",
	"AC Technician",
	"Mason/Bricklayer",
	"Painter",
	"Welder",
	"Hairdresser",
	"Tailor/Fashion Designer",
	"Other",
];

export const RegisterForm = () => {
	const router = useRouter();
	const { t, language } = useTranslation();
	const [currentStep, setCurrentStep] = React.useState(1);
	const [showPassword, setShowPassword] = React.useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
	const [agreeTerms, setAgreeTerms] = React.useState(false);
	const [serverError, setServerError] = React.useState<string | null>(null);

	const registerSchema = React.useMemo(
		() =>
			Yup.object({
				role: Yup.string()
					.oneOf(["customer", "professional"], t("auth.selectRoleRequired"))
					.required(t("auth.selectRoleRequired")),
				fullname: Yup.string()
					.min(2, t("auth.fullnameMin"))
					.required(t("auth.fullnameRequired")),
				email: Yup.string()
					.email(t("auth.invalidEmail"))
					.required(t("auth.emailRequired")),
				phone: Yup.string()
					.matches(/^[0-9]{9,}$/, t("auth.invalidPhone"))
					.required(t("auth.phoneRequired")),
				serviceCategory: Yup.string().when("role", {
					is: "professional",
					// biome-ignore lint/suspicious/noThenProperty: Yup validation schema structure uses 'then'
					then: () => Yup.string().required(t("auth.serviceCategoryRequired")),
					otherwise: () => Yup.string(),
				}),
				password: Yup.string()
					.min(6, t("auth.passwordLength"))
					.required(t("auth.passwordRequired")),
				confirmPassword: Yup.string()
					.oneOf([Yup.ref("password")], t("auth.passwordsMustMatch"))
					.required(t("auth.confirmPasswordRequired")),
			}),
		[t],
	);

	const formik = useFormik({
		initialValues: {
			role: "customer",
			fullname: "",
			email: "",
			phone: "",
			serviceCategory: "",
			password: "",
			confirmPassword: "",
		},
		validationSchema: registerSchema,
		onSubmit: async (values, { setSubmitting, resetForm }) => {
			try {
				setServerError(null);
				const email = values.email.trim();
				const password = values.password;
				const { data, error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						data: {
							fullname: values.fullname,
							phone: values.phone,
							role: values.role,
							serviceCategory: values.serviceCategory || null,
						},
					},
				});

				if (error) throw error;

				// Sync the new user profile into the local backend DB so the
				// posts foreign-key constraint (authorId → users.id) is satisfied.
				if (data?.session && data?.user) {
					try {
						await apiRequest("/users/sync", {
							method: "POST",
							body: JSON.stringify({
								id: data.user.id,
								fullname: values.fullname,
								email: data.user.email,
							}),
						});
					} catch {
						// Non-blocking — continue even if sync fails
					}
				}

				resetForm();

				// If session is returned immediately (email confirmation is disabled),
				// redirect directly to the dashboard matching their role.
				if (data?.session) {
					router.push(`/dashboard/${values.role}`);
				} else {
					router.push(`/verify?email=${encodeURIComponent(email)}`);
				}
			} catch (error) {
				setServerError(
					error instanceof Error ? error.message : "Registration failed",
				);
			} finally {
				setSubmitting(false);
			}
		},
	});

	const validateStep2 = async () => {
		const step2Fields = ["fullname", "email", "phone"];
		if (formik.values.role === "professional") {
			step2Fields.push("serviceCategory");
		}

		// Mark fields as touched
		const touched = { ...formik.touched };
		for (const field of step2Fields) {
			touched[field as keyof typeof touched] = true;
		}
		formik.setTouched(touched);

		// Trigger validation
		const errors = await formik.validateForm();

		// Check if any of these fields have errors
		const hasErrors = step2Fields.some(
			(field) => !!errors[field as keyof typeof errors],
		);
		return !hasErrors;
	};

	const getStepHeader = () => {
		switch (currentStep) {
			case 1:
				return {
					title: t("auth.step1Title"),
					subtitle: t("auth.step1Subtitle"),
				};
			case 2:
				return {
					title: t("auth.step2Title"),
					subtitle: t("auth.step2Subtitle"),
				};
			case 3:
				return {
					title: t("auth.step3Title"),
					subtitle: t("auth.step3Subtitle"),
				};
			default:
				return {
					title: t("auth.createAccount"),
					subtitle: t("auth.getStarted"),
				};
		}
	};

	const renderProgressBar = () => {
		const steps = [
			{
				id: 1,
				label: `${t("auth.roleCustomer")}/${t("auth.roleProfessional")}`,
				icon: User,
			},
			{ id: 2, label: t("auth.step2Title"), icon: UserCheck },
			{ id: 3, label: t("auth.step3Title"), icon: Shield },
		];

		return (
			<div className="mb-8">
				<div className="flex items-center justify-between relative">
					{/* Progress lines */}
					<div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -translate-y-1/2 z-0" />
					<div
						className="absolute top-1/2 left-0 h-0.5 bg-primary-500 -translate-y-1/2 transition-all duration-300 z-0"
						style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
					/>

					{steps.map((step) => {
						const StepIcon = step.icon;
						const isCompleted = currentStep > step.id;
						const isActive = currentStep === step.id;

						return (
							<div
								key={step.id}
								className="flex flex-col items-center relative z-10"
							>
								<div
									className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
										isCompleted
											? "border-primary-500 bg-primary-500 text-white"
											: isActive
												? "border-primary-500 bg-white text-primary-600 shadow-md shadow-primary-100"
												: "border-gray-200 bg-white text-gray-400"
									}`}
								>
									{isCompleted ? (
										<Check className="h-5 w-5" />
									) : (
										<StepIcon className="h-5 w-5" />
									)}
								</div>
								<span
									className={`mt-2 text-xs font-semibold ${
										isActive ? "text-primary-600 font-bold" : "text-gray-400"
									}`}
								>
									{step.id}
								</span>
							</div>
						);
					})}
				</div>
			</div>
		);
	};

	const { title, subtitle } = getStepHeader();

	return (
		<div className="space-y-6">
			{/* Dynamic Form Header */}
			<div className="text-center mb-6">
				<h2 className="text-2xl font-black text-gray-900 tracking-tight mb-1.5">
					{title}
				</h2>
				<p className="text-sm text-gray-500 font-medium leading-relaxed">
					{subtitle}
				</p>
			</div>

			{/* Progress Bar */}
			{renderProgressBar()}

			<form onSubmit={formik.handleSubmit} className="space-y-5">
				{serverError && (
					<p className="text-xs text-center font-semibold text-red-500 animate-in fade-in-50">
						{serverError.includes("already registered") ? (
							<>
								User already registered. Please{" "}
								<Link
									href="/login"
									className="underline font-bold text-primary-600 hover:text-primary-700"
								>
									{t("auth.loginHere")}
								</Link>
								.
							</>
						) : (
							serverError
						)}
					</p>
				)}

				{/* Step 1: Role selection */}
				{currentStep === 1 && (
					<div className="space-y-4">
						<div className="flex flex-col gap-4">
							<button
								type="button"
								onClick={() => formik.setFieldValue("role", "customer")}
								className={`group p-5 rounded-2xl border text-left transition-all duration-300 flex items-start gap-4 cursor-pointer ${
									formik.values.role === "customer"
										? "border-primary-500 bg-primary-50/40 ring-4 ring-primary-100/50"
										: "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
								}`}
							>
								<div
									className={`flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
										formik.values.role === "customer"
											? "bg-primary-500 text-white"
											: "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
									}`}
								>
									<User className="h-6 w-6" />
								</div>
								<div className="flex-1">
									<div className="flex items-center justify-between">
										<span className="text-base font-bold text-gray-900">
											{t("auth.roleCustomer")}
										</span>
										{formik.values.role === "customer" && (
											<div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-white">
												<Check className="h-3 w-3 stroke-[3]" />
											</div>
										)}
									</div>
									<p className="text-sm text-gray-500 mt-1 leading-relaxed">
										{language === "fr"
											? "Je cherche à embaucher des artisans et des professionnels qualifiés."
											: "I want to find and hire trusted local professionals for jobs."}
									</p>
								</div>
							</button>

							<button
								type="button"
								onClick={() => formik.setFieldValue("role", "professional")}
								className={`group p-5 rounded-2xl border text-left transition-all duration-300 flex items-start gap-4 cursor-pointer ${
									formik.values.role === "professional"
										? "border-primary-500 bg-primary-50/40 ring-4 ring-primary-100/50"
										: "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
								}`}
							>
								<div
									className={`flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
										formik.values.role === "professional"
											? "bg-primary-500 text-white"
											: "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
									}`}
								>
									<Wrench className="h-6 w-6" />
								</div>
								<div className="flex-1">
									<div className="flex items-center justify-between">
										<span className="text-base font-bold text-gray-900">
											{t("auth.roleProfessional")}
										</span>
										{formik.values.role === "professional" && (
											<div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-white">
												<Check className="h-3 w-3 stroke-[3]" />
											</div>
										)}
									</div>
									<p className="text-sm text-gray-500 mt-1 leading-relaxed">
										{language === "fr"
											? "Je suis un professionnel et je souhaite proposer mes services."
											: "I want to offer my services, build a profile, and find clients."}
									</p>
								</div>
							</button>
						</div>
					</div>
				)}

				{/* Step 2: Details */}
				{currentStep === 2 && (
					<div className="space-y-4 animate-in fade-in-50 duration-300">
						<Input
							label={t("auth.fullname")}
							name="fullname"
							type="text"
							placeholder={t("auth.fullnamePlaceholder")}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.fullname}
							error={
								formik.touched.fullname ? formik.errors.fullname : undefined
							}
						/>

						<Input
							label={t("auth.email")}
							name="email"
							type="email"
							placeholder={t("auth.emailPlaceholder")}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.email}
							error={formik.touched.email ? formik.errors.email : undefined}
						/>

						<Input
							label={t("auth.phone")}
							name="phone"
							type="tel"
							placeholder={t("auth.phonePlaceholder")}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.phone}
							error={formik.touched.phone ? formik.errors.phone : undefined}
						/>

						{formik.values.role === "professional" && (
							<div>
								<label
									htmlFor="serviceCategory"
									className="text-sm font-medium text-gray-700 tracking-wide block mb-1.5"
								>
									{t("auth.serviceCategory")}
								</label>
								<select
									name="serviceCategory"
									id="serviceCategory"
									value={formik.values.serviceCategory}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:outline-none transition-all text-gray-900 cursor-pointer"
								>
									<option value="" className="text-gray-400">
										{t("auth.selectService")}
									</option>
									{SERVICE_CATEGORIES.map((category) => (
										<option key={category} value={category}>
											{t(`categories.${category}`)}
										</option>
									))}
								</select>
								{formik.touched.serviceCategory &&
									formik.errors.serviceCategory && (
										<p className="text-xs text-red-500 mt-1">
											{formik.errors.serviceCategory as string}
										</p>
									)}
							</div>
						)}
					</div>
				)}

				{/* Step 3: Password & Terms */}
				{currentStep === 3 && (
					<div className="space-y-4 animate-in fade-in-50 duration-300">
						<Input
							label={t("auth.password")}
							name="password"
							type={showPassword ? "text" : "password"}
							placeholder={t("auth.passwordPlaceholderRegister")}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.password}
							error={
								formik.touched.password ? formik.errors.password : undefined
							}
							endAdornment={
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="focus:outline-none cursor-pointer"
								>
									<EyeIcon show={showPassword} />
								</button>
							}
						/>

						<Input
							label={t("auth.confirmPassword")}
							name="confirmPassword"
							type={showConfirmPassword ? "text" : "password"}
							placeholder={t("auth.confirmPasswordPlaceholder")}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.confirmPassword}
							error={
								formik.touched.confirmPassword
									? formik.errors.confirmPassword
									: undefined
							}
							endAdornment={
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="focus:outline-none cursor-pointer"
								>
									<EyeIcon show={showConfirmPassword} />
								</button>
							}
						/>

						<div className="flex items-start gap-2.5 pt-2">
							<input
								type="checkbox"
								id="terms"
								checked={agreeTerms}
								onChange={(e) => setAgreeTerms(e.target.checked)}
								className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500 cursor-pointer"
							/>
							<label
								htmlFor="terms"
								className="text-sm text-gray-600 select-none leading-snug cursor-pointer"
							>
								{t("auth.agreeTerms")}{" "}
								<Link
									href="/terms"
									className="text-primary-600 font-semibold hover:underline"
								>
									{t("auth.termsConditions")}
								</Link>
							</label>
						</div>
					</div>
				)}

				{/* Step Navigation Actions */}
				<div className="flex items-center gap-3 pt-6 border-t border-gray-100 mt-6">
					{currentStep > 1 && (
						<Button
							type="button"
							variant="outline"
							onClick={() => setCurrentStep((prev) => prev - 1)}
							className="flex items-center justify-center gap-1.5 w-1/3 border-gray-200 text-gray-700 hover:bg-gray-50 h-11 cursor-pointer"
						>
							<ArrowLeft className="h-4 w-4" />
							{t("auth.prevStep")}
						</Button>
					)}

					{currentStep < 3 ? (
						<Button
							type="button"
							onClick={async () => {
								if (currentStep === 1) {
									setCurrentStep(2);
								} else if (currentStep === 2) {
									const isValid = await validateStep2();
									if (isValid) {
										setCurrentStep(3);
									}
								}
							}}
							className={`flex items-center justify-center gap-1.5 h-11 cursor-pointer ${
								currentStep === 1 ? "w-full" : "w-2/3"
							}`}
						>
							{t("auth.nextStep")}
							<ArrowRight className="h-4 w-4" />
						</Button>
					) : (
						<Button
							type="submit"
							disabled={formik.isSubmitting || !formik.isValid || !agreeTerms}
							className="flex-1 flex items-center justify-center gap-1.5 h-11 cursor-pointer"
						>
							{formik.isSubmitting
								? t("auth.creatingAccount")
								: t("auth.signUp")}
						</Button>
					)}
				</div>
			</form>

			{currentStep === 1 && (
				<p className="text-center text-sm text-gray-500 pt-2">
					{t("auth.alreadyHaveAccount")}{" "}
					<Link
						href="/login"
						className="text-primary-600 font-semibold hover:underline"
					>
						{t("auth.loginHere")}
					</Link>
				</p>
			)}
		</div>
	);
};
