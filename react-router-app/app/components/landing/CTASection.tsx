import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

import { Button } from "~/components/ui/button";

export function CTASection() {
	return (
		<section className="py-20 px-4 bg-primary text-primary-foreground">
			<div className="container mx-auto text-center max-w-3xl">
				<h2 className="text-3xl font-bold tracking-tight mb-4">
					Ready to Simplify Your Travel Planning?
				</h2>
				<p className="text-xl mb-8 opacity-90">
					Join thousands of travelers who use Travel Anchor to find the best
					flight connections without the complexity.
				</p>
				<Button size="lg" variant="inverse" asChild>
					<Link to="/search" className="flex items-center gap-2">
						Start Your Search
						<ArrowRight className="w-4 h-4" />
					</Link>
				</Button>
			</div>
		</section>
	);
}
