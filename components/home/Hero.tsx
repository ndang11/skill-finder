// components/home/Hero.tsx
"use client";

import type { User } from "@supabase/supabase-js";
import { ArrowRight, Shield, Star, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/context/LanguageContext";
import { supabase } from "@/utils/supabase/client";

const HERO_IMAGE =
	"https://english.news.cn/20230126/9ddb949d81d441a5bfca9fd8cf25c719/202301269ddb949d81d441a5bfca9fd8cf25c719_67bf09c0-a6da-4707-8148-767eeb6214ed.jpg";

export const Hero = () => {
	const { t } = useTranslation();
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		supabase.auth.getUser().then(({ data }) => {
			setUser(data.user);
		});
	}, []);

	return (
		<section
			className="relative overflow-hidden bg-cover bg-center bg-no-repeat py-20 lg:py-28 text-white"
			style={{
				backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.94) 0%, rgba(15, 23, 42, 0.88) 100%), url('${HERO_IMAGE}')`,
			}}
		>
			{/* Grid Pattern overlay */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] -z-10" />

			{/* Ambient glows */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-[400px] w-[500px] rounded-full bg-primary-500/10 blur-[120px]" />
			<div className="absolute bottom-0 left-1/3 -translate-x-1/2 -z-10 h-[300px] w-[400px] rounded-full bg-green-500/10 blur-[150px]" />

			<div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
				{/* Cameroon Pill Badge */}
				<div className="inline-flex justify-center">
					<span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 backdrop-blur-md px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary-300 border border-white/15">
						🇨🇲 {t("hero.badge")}
					</span>
				</div>

				{/* Headline */}
				<h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] max-w-4xl mx-auto">
					{t("hero.titleStart")}{" "}
					<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-green-400">
						{t("hero.titleHighlight")}
					</span>{" "}
					{t("hero.titleEnd")}
				</h1>

				{/* Subtitle */}
				<p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
					{t("hero.subtitle")}
				</p>

				{/* CTA Buttons */}
				<div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-md mx-auto">
					<Link
						href={user ? "/dashboard/professional" : "/register"}
						className="w-full sm:w-auto"
					>
						<Button className="h-12 px-8 text-sm font-bold bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/20 rounded-xl flex items-center justify-center gap-2 group transition-all">
							{user ? t("hero.dashboard") : t("hero.getStarted")}
							<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
						</Button>
					</Link>
					<Link href="/categories" className="w-full sm:w-auto">
						<Button
							variant="outline"
							className="h-12 px-8 text-sm font-bold border-white/20 hover:border-white/40 text-white hover:bg-white/5 rounded-xl flex items-center justify-center"
						>
							{t("hero.ctaCategories")}
						</Button>
					</Link>
				</div>

				{/* Trust Badges Bar */}
				<div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 pt-10 border-t border-white/5 mt-10">
					<div className="flex items-center gap-2 text-sm text-gray-300 font-semibold">
						<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-primary-400">
							<Shield className="h-4.5 w-4.5" />
						</div>
						<span>{t("hero.verifiedPros")}</span>
					</div>
					<div className="flex items-center gap-2 text-sm text-gray-300 font-semibold">
						<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-amber-400">
							<Star className="h-4.5 w-4.5 fill-amber-400/10" />
						</div>
						<span>{t("hero.realReviews")}</span>
					</div>
					<div className="flex items-center gap-2 text-sm text-gray-300 font-semibold">
						<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-blue-400">
							<Users className="h-4.5 w-4.5" />
						</div>
						<span>{t("hero.userCount")}</span>
					</div>
				</div>
			</div>
		</section>
	);
};
