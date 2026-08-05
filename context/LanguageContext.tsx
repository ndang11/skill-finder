// context/LanguageContext.tsx
"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { type Dictionary, en } from "../dictionaries/en";
import { fr } from "../dictionaries/fr";

export type Language = "en" | "fr";

interface LanguageContextType {
	language: Language;
	setLanguage: (lang: Language) => void;
	t: (keyPath: string) => string;
	dictionary: Dictionary;
}

const dictionaries: Record<Language, Dictionary> = { en, fr };

const LanguageContext = createContext<LanguageContextType | undefined>(
	undefined,
);

const STORAGE_KEY = "skill_finder_lang";

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [language, setLanguageState] = useState<Language>("en");

	useEffect(() => {
		const savedLang = localStorage.getItem(STORAGE_KEY) as Language;
		if (savedLang && (savedLang === "en" || savedLang === "fr")) {
			setLanguageState(savedLang);
		} else {
			const browserLang = navigator.language.slice(0, 2);
			if (browserLang === "fr") {
				setLanguageState("fr");
			}
		}
	}, []);

	const setLanguage = (lang: Language) => {
		setLanguageState(lang);
		localStorage.setItem(STORAGE_KEY, lang);
		document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000`;
		document.documentElement.lang = lang;
	};

	const t = (keyPath: string): string => {
		const keys = keyPath.split(".");
		// biome-ignore lint/suspicious/noExplicitAny: dynamic dictionary key path navigation
		let current: any = dictionaries[language] || en;

		for (const key of keys) {
			if (current && typeof current === "object" && key in current) {
				current = current[key];
			} else {
				// Fallback to English if missing
				// biome-ignore lint/suspicious/noExplicitAny: fallback lookup
				let fallback: any = en;
				for (const k of keys) {
					if (fallback && typeof fallback === "object" && k in fallback) {
						fallback = fallback[k];
					} else {
						return keyPath;
					}
				}
				return typeof fallback === "string" ? fallback : keyPath;
			}
		}
		return typeof current === "string" ? current : keyPath;
	};

	return (
		<LanguageContext.Provider
			value={{
				language,
				setLanguage,
				t,
				dictionary: dictionaries[language],
			}}
		>
			{children}
		</LanguageContext.Provider>
	);
};

export const useTranslation = (): LanguageContextType => {
	const context = useContext(LanguageContext);
	if (!context) {
		throw new Error("useTranslation must be used within a LanguageProvider");
	}
	return context;
};
