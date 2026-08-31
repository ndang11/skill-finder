// app/(auth)/layout.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useTranslation } from "@/context/LanguageContext";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { t } = useTranslation();

	return (
		<div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white">
			{/* Left Column - Branding (visible on lg screen and up) */}
			<div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-12 text-white overflow-hidden">
				{/* Background photo */}
				<Image
					src="https://african.land/oc-content/uploads/2/1434.jpg"
					alt="Cameroonian professionals at work"
					fill
					className="object-cover object-center"
					priority
				/>
				{/* Subtle gradient overlay */}
				<div className="absolute inset-0 bg-gradient-to-br from-emerald-950/70 via-emerald-900/50 to-emerald-950/40" />

				{/* Logo */}
				<Link
					href="/"
					className="flex items-center gap-2.5 relative z-10 self-start"
				>
					<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-400 to-emerald-600 text-lg font-black text-white shadow-lg shadow-primary-500/20">
						S
					</div>
					<span className="text-lg font-black tracking-tight text-white">
						Skill<span className="text-primary-400">Finder</span>
					</span>
				</Link>

				{/* Center Branding Content */}
				<div className="relative z-10 my-auto space-y-8 max-w-md">
					<div className="space-y-4">
						<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/10 border border-primary-500/20 text-primary-400">
							🇨🇲 {t("hero.badge")}
						</span>
						<h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
							{t("hero.titleStart")}{" "}
							<span className="text-primary-400">
								{t("hero.titleHighlight")}
							</span>{" "}
							{t("hero.titleEnd")}
						</h1>
						<p className="text-base text-gray-300">{t("hero.subtitle")}</p>
					</div>

					{/* Testimonial Card */}
					<div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4 shadow-xl shadow-black/10">
						<p className="text-sm text-gray-200 italic leading-relaxed">
							"Skill Finder helped me find a certified plumber in Yaoundé within
							minutes. The rating system and WhatsApp connection made the
							process incredibly seamless!"
						</p>
						<div className="flex items-center gap-3">
							<div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary-400 to-emerald-500 flex items-center justify-center font-bold text-white shadow-sm">
								DN
							</div>
							<div>
								<h4 className="text-sm font-bold text-white">Daniel N.</h4>
								<p className="text-xs text-gray-400">Business Owner, Douala</p>
							</div>
						</div>
					</div>
				</div>

				{/* Footer stats */}
				<div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-8">
					<div>
						<div className="text-2xl font-black text-white">1,200+</div>
						<div className="text-xs text-gray-400 font-semibold tracking-wide uppercase">
							{t("hero.verifiedPros")}
						</div>
					</div>
					<div>
						<div className="text-2xl font-black text-white">98%</div>
						<div className="text-xs text-gray-400 font-semibold tracking-wide uppercase">
							{t("hero.realReviews")}
						</div>
					</div>
					<div>
						<div className="text-2xl font-black text-white">100%</div>
						<div className="text-xs text-gray-400 font-semibold tracking-wide uppercase">
							{t("hero.secure")}
						</div>
					</div>
				</div>
			</div>

			{/* Right Column - Auth Card */}
			<div className="lg:col-span-7 flex flex-col py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50/50 to-white relative min-h-screen overflow-y-auto">
				{/* Top Right Floating Language Selector */}
				<div className="sticky top-0 self-end z-10 mb-4">
					<LanguageSwitcher />
				</div>

				<div className="mx-auto w-full max-w-md flex flex-col justify-center flex-1">
					{children}
				</div>
			</div>
		</div>
	);
}
