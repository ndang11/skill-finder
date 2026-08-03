// components/home/HowItWorks.tsx
"use client";

import { MessageCircle, Search, UserPlus } from "lucide-react";

const steps = [
	{
		icon: Search,
		title: "Search & Discover",
		description:
			"Browse verified professionals by category, location, or skill. Filter by ratings and availability.",
		color: "text-blue-600",
		bg: "bg-blue-50",
		ring: "ring-blue-100",
	},
	{
		icon: UserPlus,
		title: "Book & Connect",
		description:
			"Review profiles, check ratings, and save your favorites. Contact professionals directly via WhatsApp.",
		color: "text-amber-600",
		bg: "bg-amber-50",
		ring: "ring-amber-100",
	},
	{
		icon: MessageCircle,
		title: "Get the Job Done",
		description:
			"Collaborate with your chosen professional, leave a review, and build lasting local connections.",
		color: "text-emerald-600",
		bg: "bg-emerald-50",
		ring: "ring-emerald-100",
	},
];

export default function HowItWorks() {
	return (
		<section className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
					<h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
						How It{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-green-600">
							Works
						</span>
					</h2>
					<p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
						Getting things done is simple. Three easy steps to connect with the
						right professional for your needs.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
					{steps.map((step, idx) => (
						<div
							key={step.title}
							className="relative group rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm transition-all hover:shadow-lg hover:border-gray-300 hover:-translate-y-1"
						>
							{/* Step number */}
							<div className="absolute -top-3.5 left-6">
								<span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-xs font-black text-white">
									{idx + 1}
								</span>
							</div>

							<div className="flex flex-col items-center text-center gap-4">
								<div
									className={`flex h-14 w-14 items-center justify-center rounded-2xl ${step.bg} ${step.color} ring-4 ${step.ring} group-hover:scale-110 transition-transform`}
								>
									<step.icon className="h-6 w-6 sm:h-7 sm:w-7" />
								</div>

								<div className="space-y-2">
									<h3 className="text-base sm:text-lg font-bold text-gray-900">
										{step.title}
									</h3>
									<p className="text-sm text-gray-600 leading-relaxed">
										{step.description}
									</p>
								</div>
							</div>

							{/* Connector line (hidden on mobile) */}
							{idx < steps.length - 1 && (
								<div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gray-200" />
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
