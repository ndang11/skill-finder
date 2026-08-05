// components/layout/LanguageSwitcher.tsx
"use client";

import { Globe } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { type Language, useTranslation } from "@/context/LanguageContext";

export const LanguageSwitcher: React.FC = () => {
	const { language, setLanguage } = useTranslation();
	const [isOpen, setIsOpen] = useState(false);

	const languages: { code: Language; label: string; flag: string }[] = [
		{ code: "en", label: "EN", flag: "🇬🇧" },
		{ code: "fr", label: "FR", flag: "🇫🇷" },
	];

	return (
		<div className="relative inline-block text-left">
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all border border-gray-200"
				aria-label="Switch Language"
			>
				<Globe className="w-3.5 h-3.5 text-gray-500" />
				<span>{language.toUpperCase()}</span>
			</button>

			{isOpen && (
				<div className="absolute right-0 mt-2 w-28 rounded-xl bg-white border border-gray-200 shadow-lg py-1 z-50 animate-in fade-in-50">
					{languages.map((lang) => (
						<button
							key={lang.code}
							type="button"
							onClick={() => {
								setLanguage(lang.code);
								setIsOpen(false);
							}}
							className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold hover:bg-primary-50 transition-colors ${
								language === lang.code
									? "text-primary-700 font-bold bg-primary-50/50"
									: "text-gray-700"
							}`}
						>
							<span className="flex items-center gap-2">
								<span>{lang.flag}</span>
								<span>{lang.label}</span>
							</span>
							{language === lang.code && <span>✓</span>}
						</button>
					))}
				</div>
			)}
		</div>
	);
};
