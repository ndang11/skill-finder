"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { OtpConfirmationForm } from "@/components/auth/OtpConfirmationForm";

function VerifyPageContent() {
	const searchParams = useSearchParams();
	const email = searchParams.get("email") || "";

	return (
		<main className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-6 relative overflow-hidden">
			{/* Background Decorative Ambient Flares */}
			<div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary-500/5 blur-[130px] pointer-events-none" />
			<div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-green-500/5 blur-[130px] pointer-events-none" />

			<div className="w-full max-w-md bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/50 relative z-10">
				{/* Brand Signpost logo placement */}
				<div className="flex items-center gap-2 justify-center mb-8">
					<div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-green-500 flex items-center justify-center font-black text-white text-md shadow-md shadow-primary-500/20">
						S
					</div>
					<span className="text-lg font-black text-white tracking-tight">
						Skill<span className="text-primary-400">Finder</span>
					</span>
				</div>

				{/* Dynamic OTP Client Interfacer component */}
				<OtpConfirmationForm email={email} />

				{/* Alternate navigation backout helper */}
				<div className="mt-6 text-center text-xs">
					<Link
						href="/register"
						className="text-gray-500 hover:text-gray-400 font-medium transition-colors"
					>
						← Cancel and return to registration
					</Link>
				</div>
			</div>
		</main>
	);
}

export default function VerifyPage() {
	return (
		<Suspense
			fallback={
				<main className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-6">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
				</main>
			}
		>
			<VerifyPageContent />
		</Suspense>
	);
}
