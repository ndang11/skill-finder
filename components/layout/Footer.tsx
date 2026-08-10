// components/layout/Footer.tsx
"use client";

import { Heart, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/context/LanguageContext";

export default function Footer() {
	const { t } = useTranslation();

	return (
		<footer className="bg-gray-900 text-gray-300">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
					{/* Brand */}
					<div className="space-y-4">
						<Link href="/" className="flex items-center gap-2.5">
							<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-green-600 text-lg font-black text-white">
								S
							</div>
							<span className="text-lg font-black tracking-tight text-white">
								Skill<span className="text-primary-400">Finder</span>
							</span>
						</Link>
						<p className="text-sm text-gray-400 leading-relaxed max-w-xs">
							{t("home.footerText")}
						</p>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
							{t("common.appName")}
						</h3>
						<ul className="space-y-2.5">
							<li>
								<Link
									href="/search"
									className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
								>
									{t("nav.findPros")}
								</Link>
							</li>
							<li>
								<Link
									href="/categories"
									className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
								>
									{t("categories.title")}
								</Link>
							</li>
							<li>
								<Link
									href="/#how-it-works"
									className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
								>
									{t("home.howItWorks")}
								</Link>
							</li>
						</ul>
					</div>

					{/* Support */}
					<div>
						<h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
							Support
						</h3>
						<ul className="space-y-2.5">
							{[
								"Help Center",
								"Safety",
								"Terms of Service",
								"Privacy Policy",
							].map((item) => (
								<li key={item}>
									<Link
										href="/help"
										className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
									>
										{item}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Contact */}
					<div>
						<h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
							Contact
						</h3>
						<ul className="space-y-3">
							<li className="flex items-start gap-3 text-sm text-gray-400">
								<MapPin className="h-4 w-4 mt-0.5 text-primary-400 flex-shrink-0" />
								<span>Douala, Cameroon</span>
							</li>
							<li className="flex items-start gap-3 text-sm text-gray-400">
								<Phone className="h-4 w-4 mt-0.5 text-primary-400 flex-shrink-0" />
								<span>+237 600 000 000</span>
							</li>
							<li className="flex items-start gap-3 text-sm text-gray-400">
								<Mail className="h-4 w-4 mt-0.5 text-primary-400 flex-shrink-0" />
								<span>hello@skillfinder.cm</span>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-xs text-gray-500">
						© {new Date().getFullYear()} Skill Finder. All rights reserved.
					</p>
					<p className="text-xs text-gray-500 flex items-center gap-1">
						Made with{" "}
						<Heart className="h-3.5 w-3.5 text-red-500 fill-red-500 inline-block" />{" "}
						in Cameroon
					</p>
				</div>
			</div>
		</footer>
	);
}
