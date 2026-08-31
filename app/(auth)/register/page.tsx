// app/(auth)/register/page.tsx
"use client";

import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useTranslation } from "@/context/LanguageContext";

export default function RegisterPage() {
	return (
		<div className="w-full max-w-lg my-8">
			{/* Logo for mobile / small screens */}
			<div className="flex justify-center lg:hidden mb-8">
				<Link href="/" className="flex items-center gap-2.5">
					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-green-600 text-lg font-black text-white shadow-md shadow-primary-500/20">
						S
					</div>
					<span className="text-xl font-black tracking-tight text-gray-900">
						Skill<span className="text-primary-500">Finder</span>
					</span>
				</Link>
			</div>

			<div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl shadow-emerald-950/10 border border-gray-100">
				<RegisterForm />
			</div>
		</div>
	);
}
