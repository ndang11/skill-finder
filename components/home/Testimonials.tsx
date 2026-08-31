// components/home/Testimonials.tsx
"use client";

import { Star } from "lucide-react";

const testimonials = [
	{
		name: "Amadou N.",
		role: "Homeowner, Douala",
		content:
			"Found a fantastic electrician through Skill Finder in under 10 minutes. The ratings are genuine and the WhatsApp contact feature is super convenient.",
		rating: 5,
		avatar: "A",
	},
	{
		name: "Grace M.",
		role: "Business Owner, Yaoundé",
		content:
			"As a salon owner, I've hired 3 hairdressers and a plumber through this platform. Every professional was verified and delivered quality work.",
		rating: 5,
		avatar: "G",
	},
	{
		name: "Jean P.",
		role: "Property Manager, Buea",
		content:
			"The bookmarking feature is a game changer. I save trusted professionals for future projects and can contact them instantly.",
		rating: 5,
		avatar: "J",
	},
];

export default function Testimonials() {
	return (
		<section className="py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
					<h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
						Loved by{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-green-600">
							Customers
						</span>
					</h2>
					<p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
						See what people across Cameroon are saying about their experience
						with Skill Finder.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
					{testimonials.map((testimonial) => (
						<div
							key={testimonial.name}
							className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs transition-all duration-300 hover:shadow-md hover:border-primary-200 hover:-translate-y-1"
						>
							{/* Stars */}
							<div className="flex items-center gap-0.5 mb-4">
								{[1, 2, 3, 4, 5].map((star) => (
									<Star
										key={star}
										className={`h-4 w-4 ${star <= testimonial.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
									/>
								))}
							</div>

							{/* Quote */}
							<p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-6">
								"{testimonial.content}"
							</p>

							{/* Author */}
							<div className="flex items-center gap-3 pt-4 border-t border-gray-100">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
									{testimonial.avatar}
								</div>
								<div>
									<p className="text-sm font-bold text-gray-900">
										{testimonial.name}
									</p>
									<p className="text-xs text-gray-500">{testimonial.role}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
