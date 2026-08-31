// app/(main)/page.tsx

import CallToAction from "@/components/home/CallToAction";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProfessionals from "@/components/home/FeaturedProfessionals";
import { Hero } from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function HomePage() {
	return (
		<div className="flex min-h-screen flex-col">
			<Header />
			<main className="flex-1">
				<Hero />
				<CategoryGrid />
				<HowItWorks />
				<FeaturedProfessionals />
				<Testimonials />
				<CallToAction />
			</main>
			<Footer />
		</div>
	);
}
