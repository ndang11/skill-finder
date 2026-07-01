import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "skill-finder",
	description: "Find your skills with skill-finder",
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
		<html lang="en">
			<body>
				<div id="root">{children}</div>
			</body>
		</html>
	);
}
