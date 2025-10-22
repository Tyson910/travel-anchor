import { Clock, Map as MapIcon, Search } from "lucide-react";

export function FeaturesSection() {
	return (
		<section className="py-20 px-4">
			<div className="container mx-auto max-w-6xl">
				<div className="text-center mb-16">
					<h2 className="text-3xl font-bold tracking-tight mb-4">
						Smart Features for Travel Planning
					</h2>
					<p className="text-xl text-muted-foreground">
						Everything you need to find the perfect flight connections
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-8">
					<div className="text-center space-y-4">
						<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
							<Search className="w-6 h-6 text-primary" />
						</div>
						<h3 className="text-xl font-semibold">Multi-Origin Search</h3>
						<p className="text-muted-foreground">
							Search from multiple airports simultaneously to find the best
							connection options for your travel needs.
						</p>
					</div>

					<div className="text-center space-y-4">
						<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
							<MapIcon className="w-6 h-6 text-primary" />
						</div>
						<h3 className="text-xl font-semibold">Visual Route Mapping</h3>
						<p className="text-muted-foreground">
							Interactive map view shows flight paths and connections at a
							glance, making complex routes easy to understand.
						</p>
					</div>

					<div className="text-center space-y-4">
						<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
							<Clock className="w-6 h-6 text-primary" />
						</div>
						<h3 className="text-xl font-semibold">Time & Distance Analysis</h3>
						<p className="text-muted-foreground">
							Quickly compare flight durations and distances to make informed
							travel decisions based on your priorities.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
