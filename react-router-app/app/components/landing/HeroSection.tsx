import { ArrowRight, Search } from "lucide-react";
import { Link } from "react-router";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

interface HeroSectionProps {
	featuresId: string;
}

export function HeroSection({ featuresId }: HeroSectionProps) {
	return (
		<section className="py-20 px-4">
			<div className="container mx-auto text-center max-w-4xl">
				<Badge variant="technical" className="mb-6">
					APPROACHABLE TRAVEL INTELLIGENCE
				</Badge>
				<h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
					Find Flight Connections
					<br />
					<span className="text-primary">Between Multiple Origins</span>
				</h1>
				<p className="text-xl text-muted-foreground mb-8 leading-relaxed">
					Transform complex flight data into clean, intuitive route analysis.
					Discover direct-flight connections from your preferred airports
					without the technical complexity.
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Button size="lg" variant="primary" asChild>
						<Link to="/search" className="flex items-center gap-2">
							<Search className="w-4 h-4" />
							Start Searching
							<ArrowRight className="w-4 h-4" />
						</Link>
					</Button>
					<Button size="lg" variant="outline" asChild>
						<Link to={`#${featuresId}`}>Learn More</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}
