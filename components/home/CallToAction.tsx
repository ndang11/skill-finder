// components/home/CallToAction.tsx
"use client";

import { Search, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/context/LanguageContext";

export default function CallToAction() {
	const { t } = useTranslation();

	return (
		<section className="py-16 lg:py-24 bg-white">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500 via-green-500 to-primary-600 px-8 py-16 sm:px-12 sm:py-20 lg:px-16 lg:py-24 text-center">
					{/* Background decorations */}
					<div className="absolute inset-0 -z-10 overflow-hidden">
						<div className="absolute top-0 left-1/4 h-60 w-60 rounded-full bg-white/10 blur-[80px]" />
						<div className="absolute bottom-0 right-1/4 h-60 w-60 rounded-full bg-white/10 blur-[80px]" />
					</div>

					<div className="relative z-10 max-w-2xl mx-auto space-y-6">
						<div className="flex items-center justify-center gap-2 text-white/90 text-sm font-semibold">
							<Zap className="h-5 w-5" />
							<span>{t("home.popularServices")}</span>
						</div>

						<h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.1]">
							{t("home.ctaTitle")}
						</h2>

						<p className="text-base sm:text-lg text-primary-50 leading-relaxed max-w-xl mx-auto">
							{t("home.ctaSubtitle")}
						</p>

						<div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
							<Link href="/register">
								<Button
									variant="secondary"
									className="w-full sm:w-auto text-base font-bold h-12 px-8 shadow-lg"
								>
									{t("nav.register")}
								</Button>
							</Link>
							<Link href="/search">
								<Button
									variant="outline"
									className="w-full sm:w-auto text-base font-bold h-12 px-8 border-white/30 text-white hover:bg-white/10 hover:text-white"
								>
									<Search className="h-5 w-5 mr-2" />
									{t("nav.findPros")}
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
