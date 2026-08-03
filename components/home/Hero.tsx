// components/home/Hero.tsx
"use client";

import { Search, Shield, Star, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const Hero = () => {
	return (
		<section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-green-50/30">
			{/* Background decorations */}
			<div className="absolute inset-0 -z-10 overflow-hidden">
				<div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary-200/40 blur-[100px]" />
				<div className="absolute top-40 -left-40 h-80 w-80 rounded-full bg-green-200/30 blur-[100px]" />
				<div className="absolute bottom-0 right-1/4 h-60 w-60 rounded-full bg-primary-100/30 blur-[80px]" />
			</div>

			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
					{/* Left Column: Headline and Action */}
					<div className="lg:col-span-7 text-left space-y-6 lg:pr-6">
						<span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3.5 py-1.5 text-xs sm:text-sm font-bold text-primary-700 border border-primary-200">
							🇨🇲 The #1 Artisan Directory in Cameroon
						</span>

						<h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.1]">
							Find Trusted{" "}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-green-600">
								Professionals
							</span>{" "}
							Anywhere in Cameroon.
						</h1>

						<p className="text-base sm:text-lg text-gray-600 max-w-xl leading-relaxed">
							Connect directly with verified mechanics, electricians, plumbers,
							and artisans near you. Skip the stress, check ratings, and hire
							instantly via WhatsApp.
						</p>

						{/* CTA Buttons */}
						<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
							<Link href="/search">
								<Button className="w-full sm:w-auto text-base font-bold h-12 px-8 shadow-lg shadow-primary-500/20">
									<Search className="h-5 w-5 mr-2" />
									Find Professionals
								</Button>
							</Link>
							<Link href="/categories">
								<Button
									variant="outline"
									className="w-full sm:w-auto text-base font-bold h-12 px-8"
								>
									Browse Categories
								</Button>
							</Link>
						</div>

						{/* Trust badges */}
						<div className="flex flex-wrap items-center gap-6 pt-4">
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
									<Shield className="h-4 w-4" />
								</div>
								<span className="font-semibold">Verified Pros</span>
							</div>
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
									<Star className="h-4 w-4" />
								</div>
								<span className="font-semibold">Real Reviews</span>
							</div>
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
									<Users className="h-4 w-4" />
								</div>
								<span className="font-semibold">1,200+ Users</span>
							</div>
						</div>
					</div>

					{/* Right Column: Premium Showcase Profile Card */}
					<div className="lg:col-span-5 relative flex justify-center lg:justify-end">
						{/* Background Accent ring */}
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 rounded-full border-2 border-dashed border-primary-200 -z-10" />

						{/* Main Showcase Profile Card */}
						<div className="w-full max-w-[360px] bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/60 border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
							{/* Card Header: Avatar & Badges */}
							<div className="flex items-center gap-4">
								<div className="relative">
									<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-green-600 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-primary-500/20">
										FB
									</div>
									<span className="absolute bottom-0 right-0 block h-4 w-4 rounded-full bg-green-500 border-2 border-white" />
								</div>

								<div>
									<div className="flex items-center gap-1.5">
										<h3 className="font-extrabold text-gray-900 text-lg">
											Fon Bello
										</h3>
										<span
											className="inline-flex items-center justify-center p-0.5 rounded-full bg-primary-100 text-primary-700"
											title="Verified Artisan"
										>
											<svg
												className="w-4 h-4"
												fill="currentColor"
												viewBox="0 0 20 20"
												aria-label="Verified"
												role="img"
											>
												<path
													fillRule="evenodd"
													d="M6.267 3.585a2.625 2.625 0 014.966 0l.071.217a.75.75 0 00.91.503l.218-.071a2.625 2.625 0 013.51 3.51l-.071.218a.75.75 0 00.503.91l.217.071a2.625 2.625 0 010 4.966l-.217.07a.75.75 0 00-.503.91l.071.218a2.625 2.625 0 01-3.51 3.51l-.218-.07a.75.75 0 00-.91.503l-.071.217a2.625 2.625 0 01-4.966 0l-.071-.217a.75.75 0 00-.91-.503l-.218.07a2.625 2.625 0 01-3.51-3.51l.071-.218a.75.75 0 00-.503-.91l-.217-.07a2.625 2.625 0 010-4.966l.217-.07a.75.75 0 00.503-.91l-.071-.218a2.625 2.625 0 013.51-3.51l.218.07a.75.75 0 00.91-.503l.071-.217zM10 12.75a2.75 2.75 0 100-5.5 2.75 2.75 0 000 5.5z"
													clipRule="evenodd"
												/>
											</svg>
										</span>
									</div>
									<p className="text-sm font-semibold text-primary-600">
										Solar Installer & Electrician
									</p>
									<p className="text-xs text-gray-400 font-medium">
										Bastos, Yaoundé
									</p>
								</div>
							</div>

							{/* Work Details & Experience */}
							<div className="mt-5 space-y-3.5">
								<div className="flex items-center justify-between text-sm border-b border-gray-50 pb-2">
									<span className="text-gray-400 font-medium">Experience</span>
									<span className="text-gray-900 font-bold">6+ Years</span>
								</div>
								<div className="flex items-center justify-between text-sm border-b border-gray-50 pb-2">
									<span className="text-gray-400 font-medium">Services</span>
									<span className="text-gray-900 font-bold">
										Inverters, AC Repair
									</span>
								</div>
								<div className="flex items-center justify-between text-sm border-b border-gray-50 pb-2">
									<span className="text-gray-400 font-medium">
										Response Rate
									</span>
									<span className="text-green-600 font-extrabold bg-green-50 px-2 py-0.5 rounded-full">
										98% Faster
									</span>
								</div>
							</div>

							{/* Ratings and Reviews */}
							<div className="mt-5 bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
								<div className="flex items-center gap-1">
									<svg
										className="w-5 h-5 text-yellow-400"
										fill="currentColor"
										viewBox="0 0 20 20"
										aria-label="Star rating"
										role="img"
									>
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
									<span className="text-sm font-black text-gray-900">4.9</span>
									<span className="text-xs text-gray-400 font-semibold">
										(48 reviews)
									</span>
								</div>
								<div className="h-4 w-px bg-gray-200" />
								<span className="text-xs font-bold text-gray-700">
									104 Jobs Completed
								</span>
							</div>

							{/* WhatsApp Button */}
							<div className="mt-5">
								<Link
									href="https://wa.me/237600000000?text=Hello%20Fon%20Bello,%20I%20found%20your%20profile%20on%20Skill%20Finder%20and%20would%20like%20to%20inquire%20about%20your%20services."
									target="_blank"
									rel="noopener"
									className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 px-4 rounded-xl font-bold text-sm sm:text-base shadow-lg shadow-green-500/10 hover:shadow-green-500/20 active:scale-[0.99] transition-all"
								>
									<svg
										className="w-5 h-5 fill-current"
										viewBox="0 0 24 24"
										aria-label="WhatsApp"
										role="img"
									>
										<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
									</svg>
									Contact on WhatsApp
								</Link>
							</div>
						</div>

						{/* Floating Badges */}
						<div className="absolute top-10 -left-4 sm:-left-6 bg-white shadow-xl shadow-gray-200/50 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl flex items-center gap-2 border border-gray-50/80">
							<span className="text-lg sm:text-xl">🏆</span>
							<div>
								<p className="text-xs font-bold text-gray-900">Top Rated</p>
								<p className="text-[10px] text-gray-400 font-semibold hidden sm:block">
									Artisan of the Month
								</p>
							</div>
						</div>

						<div className="absolute bottom-12 -right-2 sm:-right-4 bg-white shadow-xl shadow-gray-200/50 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl flex items-center gap-2 border border-gray-50/80">
							<span className="text-lg sm:text-xl">🛡️</span>
							<div>
								<p className="text-xs font-bold text-gray-900">100% Secure</p>
								<p className="text-[10px] text-gray-400 font-semibold hidden sm:block">
									Verified Trade Certs
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
