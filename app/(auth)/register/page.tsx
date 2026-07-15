// app/(auth)/register/page.tsx
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
	return (
		<div className="w-full max-w-md">
			<div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl shadow-primary-500/5 border border-gray-100">
				<div className="text-center mb-8">
					<h2 className="text-3xl font-bold text-gray-900 mb-2">
						Create Account
					</h2>
					<p className="text-sm text-gray-500">
						Get started with your free account
					</p>
				</div>
				<RegisterForm />
			</div>
		</div>
	);
}
