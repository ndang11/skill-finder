// app/(auth)/layout.tsx
import type React from "react";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white px-4 sm:px-6 lg:px-8 py-12">
			<div className="w-full flex justify-center">{children}</div>
		</div>
	);
}
