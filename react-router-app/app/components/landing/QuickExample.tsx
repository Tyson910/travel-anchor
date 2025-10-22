import { ArrowRight } from "lucide-react";

import { Badge } from "~/components/ui/badge";

export function QuickExample() {
	return (
		<section className="py-16 px-4 bg-muted/30">
			<div className="container mx-auto max-w-6xl">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold tracking-tight mb-4">
						See It In Action
					</h2>
					<p className="text-muted-foreground">
						Visual example of how Travel Anchor simplifies route discovery
					</p>
				</div>

				<div className="bg-card border border-border rounded-lg p-8 shadow-sm">
					<div className="grid md:grid-cols-3 gap-8">
						{/* Origins */}
						<div>
							<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
								From
							</h3>
							<div className="space-y-2">
								<Badge variant="airport" className="text-base px-3 py-2">
									JFK
								</Badge>
								<Badge variant="airport" className="text-base px-3 py-2">
									LAX
								</Badge>
								<Badge variant="airport" className="text-base px-3 py-2">
									ORD
								</Badge>
							</div>
						</div>

						{/* Connections */}
						<div className="flex items-center justify-center">
							<div className="text-center">
								<ArrowRight className="w-8 h-8 text-primary mx-auto mb-2" />
								<p className="text-sm text-muted-foreground">Direct Routes</p>
							</div>
						</div>

						{/* Destinations */}
						<div>
							<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
								Mutual Destinations
							</h3>
							<div className="space-y-3">
								<div className="flex items-center justify-between p-3 bg-muted/50 rounded">
									<div>
										<Badge variant="airport" className="text-xs">
											DEN
										</Badge>
										<p className="text-sm font-medium mt-1">Denver</p>
									</div>
									<div className="text-right">
										<p className="text-xs text-muted-foreground">3 routes</p>
										<p className="text-xs text-muted-foreground">2-4h</p>
									</div>
								</div>
								<div className="flex items-center justify-between p-3 bg-muted/50 rounded">
									<div>
										<Badge variant="airport" className="text-xs">
											DFW
										</Badge>
										<p className="text-sm font-medium mt-1">Dallas</p>
									</div>
									<div className="text-right">
										<p className="text-xs text-muted-foreground">3 routes</p>
										<p className="text-xs text-muted-foreground">2-3h</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
