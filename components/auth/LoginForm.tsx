// components/auth/LoginForm.tsx
"use client";

import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
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

export const LoginForm = () => {
	const router = useRouter();
	const { t } = useTranslation();
	const [showPassword, setShowPassword] = useState(false);
	const [serverError, setServerError] = useState<string | null>(null);

	const LoginSchema = useMemo(
		() =>
			Yup.object().shape({
				email: Yup.string()
					.email(t("auth.invalidEmail"))
					.required(t("auth.emailRequired")),
				password: Yup.string()
					.min(6, t("auth.passwordLength"))
					.required(t("auth.passwordRequired")),
			}),
		[t],
	);

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		validationSchema: LoginSchema,
		onSubmit: async (values, { setSubmitting }) => {
			try {
				setServerError(null);
				const { data, error } = await supabase.auth.signInWithPassword({
					email: values.email.trim(),
					password: values.password,
				});

				if (error) throw error;

				if (data?.session) {
					// Upsert user into local DB on every login. This ensures
					// the foreign-key constraint for posts is always satisfied.
					try {
						await apiRequest("/users/sync", {
							method: "POST",
							body: JSON.stringify({
								id: data.user.id,
								fullname: data.user.user_metadata?.fullname || data.user.email,
								email: data.user.email,
							}),
						});
					} catch {
						// Non-blocking
					}
					const role = data.user?.user_metadata?.role || "customer";
					router.push(`/dashboard/${role}`);
					router.refresh();
				}
			} catch (error) {
				setServerError(
					error instanceof Error ? error.message : t("auth.invalidCredentials"),
				);
			} finally {
				setSubmitting(false);
			}
		},
	});

	return (
		<form onSubmit={formik.handleSubmit} className="space-y-5">
			{serverError && (
				<p className="text-xs text-center font-semibold text-red-500 animate-in fade-in-50">
					{serverError}
				</p>
			)}

			<Input
				label={t("auth.emailAddress")}
				name="email"
				type="email"
				placeholder={t("auth.emailPlaceholder")}
				onChange={formik.handleChange}
				onBlur={formik.handleBlur}
				value={formik.values.email}
				error={formik.touched.email ? formik.errors.email : undefined}
			/>

			<Input
				label={t("auth.password")}
				name="password"
				type={showPassword ? "text" : "password"}
				placeholder={t("auth.passwordPlaceholder")}
				onChange={formik.handleChange}
				onBlur={formik.handleBlur}
				value={formik.values.password}
				error={formik.touched.password ? formik.errors.password : undefined}
				endAdornment={
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="focus:outline-none"
					>
						<EyeIcon show={showPassword} />
					</button>
				}
			/>

			<div className="flex items-center justify-between text-sm">
				<label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
					<input
						type="checkbox"
						className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 h-4 w-4"
					/>
					{t("auth.rememberMe")}
				</label>
				<Link
					href="/forgot-password"
					className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
				>
					{t("auth.forgotPassword")}
				</Link>
			</div>

			<Button type="submit" disabled={formik.isSubmitting}>
				{formik.isSubmitting ? t("auth.signingIn") : t("auth.signIn")}
			</Button>

			<div className="relative py-2">
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-t border-gray-200"></div>
				</div>
				<div className="relative flex justify-center text-sm">
					<span className="px-2 bg-white text-gray-500">
						{t("auth.orContinueWith")}
					</span>
				</div>
			</div>

			<Button
				type="button"
				variant="outline"
				className="w-full flex items-center justify-center gap-2"
			>
				<svg
					viewBox="0 0 24 24"
					width="20"
					height="20"
					aria-label="Google"
					role="img"
				>
					<path
						d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.03 2.53-2.18 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
						fill="#4285F4"
					/>
					<path
						d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
						fill="#34A853"
					/>
					<path
						d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
						fill="#FBBC05"
					/>
					<path
						d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
						fill="#EA4335"
					/>
				</svg>
				{t("auth.signInWithGoogle")}
			</Button>
		</form>
	);
};
