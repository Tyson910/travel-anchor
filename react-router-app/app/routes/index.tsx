import type { Route } from "./+types/index";

import { useId } from "react";

import { CTASection } from "~/components/landing/CTASection";
import { FeaturesSection } from "~/components/landing/FeaturesSection";
import { Footer } from "~/components/landing/Footer";
import { Header } from "~/components/landing/Header";
import { HeroSection } from "~/components/landing/HeroSection";
import { QuickExample } from "~/components/landing/QuickExample";

export const meta: Route.MetaFunction = () => {
	return [
		{ title: "Travel Anchor - Smart Flight Connections" },
		{
			name: "description",
			content:
				"Find direct-flight connections between multiple airports with intelligent route analysis.",
		},
	];
};

export default function Home() {
	const featuresId = useId();
	const aboutId = useId();

	return (
		<div className="min-h-screen bg-background">
			<Header featuresId={featuresId} aboutId={aboutId} />
			<HeroSection featuresId={featuresId} />
			<QuickExample />
			<FeaturesSection />
			<CTASection />
			<Footer featuresId={featuresId} />
		</div>
	);
}
