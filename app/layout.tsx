import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-sans",
});

export const metadata: Metadata = {
	title: "Skill Finder — Find Trusted Professionals Anywhere in Cameroon",
	description:
		"Connect with verified mechanics, electricians, plumbers, and artisans near you. Check ratings, hire instantly via WhatsApp.",
	icons: {
		icon: "/favicon.svg",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={inter.variable}>
			<body className="font-sans antialiased">
				<LanguageProvider>{children}</LanguageProvider>
			</body>
		</html>
	);
}
