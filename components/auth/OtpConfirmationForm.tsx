// components/auth/OtpConfirmationForm.tsx
"use client";

import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as React from "react";
import * as Yup from "yup";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/utils/supabase/client";

interface OtpFormProps {
	email: string; // Ensure you pass the user's email down from your registration state
}

export const OtpConfirmationForm = ({ email }: OtpFormProps) => {
	const router = useRouter();
	const [cooldown, setCooldown] = React.useState(59);
	const inputRefs = React.useRef<HTMLInputElement[]>([]);

	React.useEffect(() => {
		if (cooldown === 0) return;
		const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
		return () => clearTimeout(timer);
	}, [cooldown]);

	const formik = useFormik({
		initialValues: { otp: Array(6).fill("") },
		validationSchema: Yup.object({
			otp: Yup.array()
				.of(Yup.string().matches(/^[0-9]$/, "Must be a number"))
				.min(6)
				.required(),
		}),
		onSubmit: async (values, { setSubmitting, setFieldError }) => {
			const token = values.otp.join("");

			try {
				// Exchange token with Supabase Auth
				const { data, error } = await supabase.auth.verifyOtp({
					email,
					token,
					type: "signup", // Tells Supabase this is a confirmation for a newly registered account
				});

				if (error) throw error;

				if (data?.session) {
					const role = data.user?.user_metadata?.role || "customer";
					router.push(`/dashboard/${role}`);
					router.refresh();
				}
			} catch (error) {
				const err = error as Error;
				setFieldError(
					"otp",
					err.message || "Invalid or expired confirmation code.",
				);
			} finally {
				setSubmitting(false);
			}
		},
	});

	const handleChange = (value: string, index: number) => {
		if (!/^[0-9]?$/.test(value)) return;

		const newOtp = [...formik.values.otp];
		newOtp[index] = value;
		formik.setFieldValue("otp", newOtp);

		if (value && index < 5) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		index: number,
	) => {
		if (e.key === "Backspace" && !formik.values.otp[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	const handleResend = async () => {
		if (cooldown > 0) return;
		try {
			const { error } = await supabase.auth.resend({
				type: "signup",
				email,
			});
			if (error) throw error;
			setCooldown(59);
		} catch (error) {
			console.error("Failed to trigger OTP resend:", error);
		}
	};

	const isOtpComplete = formik.values.otp.every((val) => val !== "");

	return (
		<form onSubmit={formik.handleSubmit} className="space-y-6">
			<div className="text-center space-y-2">
				<h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
					Verify Your Email
				</h1>
				<p className="text-sm text-gray-400 font-medium">
					We sent a 6-digit verification token to{" "}
					<span className="text-white font-semibold">{email}</span>.
				</p>
			</div>

			<div className="flex justify-between gap-2 sm:gap-3 py-2">
				{formik.values.otp.map((digit, index) => (
					<input
						// biome-ignore lint/suspicious/noArrayIndexKey: stable array of inputs for OTP confirmation code
						key={`${index}-${digit}`}
						ref={(el) => {
							if (el) inputRefs.current[index] = el;
						}}
						type="text"
						inputMode="numeric"
						maxLength={1}
						value={digit}
						onChange={(e) => handleChange(e.target.value, index)}
						onKeyDown={(e) => handleKeyDown(e, index)}
						className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-bold text-white bg-white/[0.03] border border-white/10 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 focus:outline-none transition-all"
					/>
				))}
			</div>

			{formik.errors.otp && typeof formik.errors.otp === "string" && (
				<p className="text-xs text-center font-semibold text-red-500 animate-in fade-in-50">
					{formik.errors.otp}
				</p>
			)}

			<Button
				type="submit"
				disabled={formik.isSubmitting || !isOtpComplete}
				className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold h-12 rounded-xl transition-all shadow-lg shadow-primary-500/20"
			>
				{formik.isSubmitting ? "Verifying Code..." : "Verify & Go to Dashboard"}
			</Button>

			<div className="text-center text-sm font-medium">
				<p className="text-gray-500">
					Didn&apos;t receive the code?{" "}
					{cooldown > 0 ? (
						<span className="text-gray-400 font-semibold">
							Resend in {cooldown}s
						</span>
					) : (
						<button
							type="button"
							onClick={handleResend}
							className="text-primary-400 font-bold hover:text-primary-300 underline underline-offset-4 transition-colors"
						>
							Resend Code
						</button>
					)}
				</p>
			</div>
		</form>
	);
};
