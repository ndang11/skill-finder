// components/home/CategoryGrid.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
	SKILL_CATEGORIES,
	SKILL_CATEGORY_EMOJIS,
} from "@/constants/categories";

export default function CategoryGrid() {
	return (
		<section className="py-16 lg:py-24 bg-white">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
					<h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
						Browse by{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-green-600">
							Category
						</span>
					</h2>
					<p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
						Explore skilled professionals across every trade. From home repairs
						to personal care, find the right expert for the job.
					</p>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
					{SKILL_CATEGORIES.map((category) => (
						<Link
							key={category}
							href={`/search?category=${encodeURIComponent(category)}`}
							className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm transition-all hover:shadow-lg hover:border-primary-200 hover:-translate-y-1"
						>
							<div className="flex flex-col items-center text-center gap-3">
								<div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-primary-50 text-2xl sm:text-3xl group-hover:scale-110 transition-transform">
									{SKILL_CATEGORY_EMOJIS[category] ?? "🛠️"}
								</div>
								<div>
									<h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
										{category}
									</h3>
								</div>
							</div>
						</Link>
					))}
				</div>

				<div className="mt-10 text-center">
					<Link href="/categories">
						<Button
							variant="outline"
							className="px-8 h-11 text-sm font-semibold"
						>
							View All Categories
						</Button>
					</Link>
				</div>
			</div>
		</section>
	);
}
