// components/auth/RegisterForm.tsx
"use client";

import { useFormik } from "formik";
import { User, Wrench } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import * as Yup from "yup";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { apiRequest } from "@/services/api";
import { supabase } from "@/utils/supabase/client";

const schema = Yup.object({
	role: Yup.string()
		.oneOf(["customer", "professional"], "Please select an account type")
		.required("Account type is required"),
	fullname: Yup.string()
		.min(2, "Enter your full name")
		.required("Full name is required"),
	email: Yup.string()
		.email("Invalid email address")
		.required("Email is required"),
	phone: Yup.string()
		.matches(/^[0-9]{9,}$/, "Enter a valid phone number")
		.required("Phone number is required"),
	serviceCategory: Yup.string().when("role", {
		is: "professional",
		// biome-ignore lint/suspicious/noThenProperty: Yup validation schema structure uses 'then'
		then: () => Yup.string().required("Service category is required"),
		otherwise: () => Yup.string(),
	}),
	password: Yup.string()
		.min(6, "Password must be at least 6 characters")
		.required("Password is required"),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref("password")], "Passwords must match")
		.required("Please confirm your password"),
});

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
	const [showPassword, setShowPassword] = React.useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
	const [agreeTerms, setAgreeTerms] = React.useState(false);
	const [serverError, setServerError] = React.useState<string | null>(null);

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
		validationSchema: schema,
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

	return (
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
								log in here
							</Link>
							.
						</>
					) : (
						serverError
					)}
				</p>
			)}
			<div className="text-center pb-2">
				<p className="text-sm text-gray-600 font-medium">
					How do you intend to use Skill Finder?
				</p>
			</div>

			<div className="grid grid-cols-2 gap-3">
				<button
					type="button"
					onClick={() => formik.setFieldValue("role", "customer")}
					className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
						formik.values.role === "customer"
							? "border-primary-500 bg-primary-50 ring-2 ring-primary-100"
							: "border-gray-200 bg-white hover:bg-gray-50"
					}`}
				>
					<User
						className={`h-6 w-6 mb-1.5 ${formik.values.role === "customer" ? "text-primary-600" : "text-gray-400"}`}
					/>
					<span
						className={`text-sm font-bold block ${
							formik.values.role === "customer"
								? "text-primary-900"
								: "text-gray-900"
						}`}
					>
						Customer
					</span>
				</button>

				<button
					type="button"
					onClick={() => formik.setFieldValue("role", "professional")}
					className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
						formik.values.role === "professional"
							? "border-primary-500 bg-primary-50 ring-2 ring-primary-100"
							: "border-gray-200 bg-white hover:bg-gray-50"
					}`}
				>
					<Wrench
						className={`h-6 w-6 mb-1.5 ${formik.values.role === "professional" ? "text-primary-600" : "text-gray-400"}`}
					/>
					<span
						className={`text-sm font-bold block ${
							formik.values.role === "professional"
								? "text-primary-900"
								: "text-gray-900"
						}`}
					>
						Professional
					</span>
				</button>
			</div>

			<Input
				label="Full Name"
				name="fullname"
				type="text"
				placeholder="Enter your first and last name"
				onChange={formik.handleChange}
				onBlur={formik.handleBlur}
				value={formik.values.fullname}
				error={formik.touched.fullname ? formik.errors.fullname : undefined}
			/>

			<div className="grid grid-cols-1 gap-4">
				<Input
					label={
						formik.values.role === "professional"
							? "Phone Number"
							: "Email Address"
					}
					name={formik.values.role === "professional" ? "phone" : "email"}
					type={formik.values.role === "professional" ? "tel" : "email"}
					placeholder={
						formik.values.role === "professional"
							? "Enter your phone number"
							: "Enter your email address"
					}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={
						formik.values[
							formik.values.role === "professional" ? "phone" : "email"
						]
					}
					error={
						formik.touched[
							formik.values.role === "professional" ? "phone" : "email"
						]
							? formik.errors[
									formik.values.role === "professional" ? "phone" : "email"
								]
							: undefined
					}
				/>

				<Input
					label={
						formik.values.role === "professional"
							? "Email Address"
							: "Phone Number"
					}
					name={formik.values.role === "professional" ? "email" : "phone"}
					type={formik.values.role === "professional" ? "email" : "tel"}
					placeholder={
						formik.values.role === "professional"
							? "Enter your email address"
							: "Enter your phone number"
					}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={
						formik.values[
							formik.values.role === "professional" ? "email" : "phone"
						]
					}
					error={
						formik.touched[
							formik.values.role === "professional" ? "email" : "phone"
						]
							? formik.errors[
									formik.values.role === "professional" ? "email" : "phone"
								]
							: undefined
					}
				/>
			</div>

			{formik.values.role === "professional" && (
				<div>
					<label
						htmlFor="serviceCategory"
						className="text-sm font-medium text-gray-700 tracking-wide block mb-1.5"
					>
						Service Category
					</label>
					<select
						name="serviceCategory"
						id="serviceCategory"
						value={formik.values.serviceCategory}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:outline-none transition-all text-gray-900"
					>
						<option value="" className="text-gray-400">
							Select your service
						</option>
						{SERVICE_CATEGORIES.map((category) => (
							<option key={category} value={category}>
								{category}
							</option>
						))}
					</select>
					{formik.touched.serviceCategory && formik.errors.serviceCategory && (
						<p className="text-xs text-red-500 mt-1">
							{formik.errors.serviceCategory as string}
						</p>
					)}
				</div>
			)}

			<Input
				label="Password"
				name="password"
				type={showPassword ? "text" : "password"}
				placeholder="Create security password"
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

			<Input
				label="Confirm Password"
				name="confirmPassword"
				type={showConfirmPassword ? "text" : "password"}
				placeholder="Repeat password"
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
						className="focus:outline-none"
					>
						<EyeIcon show={showConfirmPassword} />
					</button>
				}
			/>

			<div className="flex items-start gap-2 pt-2">
				<input
					type="checkbox"
					id="terms"
					checked={agreeTerms}
					onChange={(e) => setAgreeTerms(e.target.checked)}
					className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
				/>
				<label
					htmlFor="terms"
					className="text-sm text-gray-600 select-none leading-snug"
				>
					I agree to the{" "}
					<Link
						href="/terms"
						className="text-primary-600 font-medium hover:underline"
					>
						Terms & Conditions
					</Link>
				</label>
			</div>

			<Button
				type="submit"
				disabled={formik.isSubmitting || !formik.isValid || !agreeTerms}
				className="w-full"
			>
				{formik.isSubmitting ? "Creating account..." : "Sign Up"}
			</Button>

			<p className="text-center text-sm text-gray-500 pt-4">
				Already have an account?{" "}
				<Link
					href="/login"
					className="text-primary-600 font-semibold hover:underline"
				>
					Log in here
				</Link>
			</p>
		</form>
	);
};
