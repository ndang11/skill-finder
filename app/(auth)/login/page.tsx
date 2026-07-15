// app/(auth)/login/page.tsx
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
	return (
		<div className="w-full max-w-md">
			<div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl shadow-primary-500/5 border border-gray-100">
				<div className="text-center mb-8">
					<h2 className="text-3xl font-bold text-gray-900 mb-2">
						Welcome Back
					</h2>
					<p className="text-sm text-gray-500">
						Don&apos;t have an account?{" "}
						<Link
							href="/register"
							className="text-primary-600 font-semibold hover:underline"
						>
							Register here
						</Link>
					</p>
				</div>
				<LoginForm />
			</div>
		</div>
	);
}
