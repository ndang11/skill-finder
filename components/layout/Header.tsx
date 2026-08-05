// components/layout/Header.tsx
"use client";

import { LogOut, Menu, Search, type User, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/context/LanguageContext";
import { supabase } from "@/utils/supabase/client";

export default function Header() {
	const [user, setUser] = useState<User | null>(null);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const { t } = useTranslation();

	useEffect(() => {
		supabase.auth.getUser().then(({ data }) => {
			setUser(data.user);
		});
	}, []);

	const handleLogout = async () => {
		await supabase.auth.signOut();
		setUser(null);
		window.location.href = "/";
	};

	const navLinks = [
		{ href: "/search", label: t("nav.findPros") },
		{ href: "/categories", label: t("categories.title") },
		{ href: "/feed", label: t("nav.feed") },
	];

	return (
		<header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-xl">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					{/* Logo */}
					<Link href="/" className="flex items-center gap-2.5">
						<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-green-600 text-lg font-black text-white shadow-md shadow-primary-500/20">
							S
						</div>
						<span className="text-lg font-black tracking-tight text-gray-900">
							Skill<span className="text-primary-500">Finder</span>
						</span>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center gap-1">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className="px-4 py-2 text-sm font-semibold text-gray-600 rounded-xl hover:text-primary-600 hover:bg-primary-50 transition-all"
							>
								{link.label}
							</Link>
						))}
					</nav>

					{/* Desktop Auth & Language */}
					<div className="hidden md:flex items-center gap-3">
						<LanguageSwitcher />
						{user ? (
							<>
								<Link href="/dashboard/professional">
									<Button variant="secondary" className="h-9 px-4 text-sm">
										{t("nav.dashboard")}
									</Button>
								</Link>
								<button
									type="button"
									onClick={handleLogout}
									className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all"
									title={t("nav.logout")}
								>
									<LogOut className="h-4 w-4" />
								</button>
							</>
						) : (
							<>
								<Link href="/login">
									<Button
										variant="outline"
										className="h-9 px-4 text-sm font-semibold text-gray-700 hover:text-primary-600 hover:bg-primary-50"
									>
										{t("nav.login")}
									</Button>
								</Link>
								<Link href="/register">
									<Button className="h-9 px-5 text-sm font-semibold shadow-sm">
										{t("nav.register")}
									</Button>
								</Link>
							</>
						)}
					</div>

					{/* Mobile menu button */}
					<button
						type="button"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
						aria-label="Toggle menu"
					>
						{mobileMenuOpen ? (
							<X className="h-5 w-5" />
						) : (
							<Menu className="h-5 w-5" />
						)}
					</button>
				</div>

				{/* Mobile Navigation */}
				{mobileMenuOpen && (
					<div className="md:hidden py-4 border-t border-gray-100 space-y-1 animate-in fade-in-50">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={() => setMobileMenuOpen(false)}
								className="block px-4 py-3 text-sm font-semibold text-gray-700 rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-all"
							>
								{link.label}
							</Link>
						))}
						<div className="pt-3 border-t border-gray-100 space-y-2">
							{user ? (
								<>
									<Link
										href="/dashboard/professional"
										onClick={() => setMobileMenuOpen(false)}
									>
										<Button variant="secondary" className="w-full">
											Dashboard
										</Button>
									</Link>
									<Button
										variant="outline"
										className="w-full"
										onClick={() => {
											handleLogout();
											setMobileMenuOpen(false);
										}}
									>
										Log out
									</Button>
								</>
							) : (
								<>
									<Link href="/login" onClick={() => setMobileMenuOpen(false)}>
										<Button variant="ghost" className="w-full">
											Log in
										</Button>
									</Link>
									<Link
										href="/register"
										onClick={() => setMobileMenuOpen(false)}
									>
										<Button className="w-full">Get Started</Button>
									</Link>
								</>
							)}
						</div>
					</div>
				)}
			</div>
		</header>
	);
}
