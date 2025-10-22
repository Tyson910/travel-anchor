import { Route as RouteIcon } from "lucide-react";
import { Link } from "react-router";

import { Badge } from "~/components/ui/badge";

interface FooterProps {
	featuresId: string;
}

export function Footer({ featuresId }: FooterProps) {
	return (
		<footer className="border-t border-border py-12 px-4">
			<div className="container mx-auto max-w-6xl">
				<div className="grid md:grid-cols-4 gap-8">
					<div>
						<div className="flex items-center gap-2 mb-4">
							<div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center">
								<RouteIcon className="w-3 h-3 text-primary-foreground" />
							</div>
							<h3 className="font-semibold">Travel Anchor</h3>
						</div>
						<p className="text-sm text-muted-foreground">
							Minimal clip-punk travel intelligence for laymen.
						</p>
					</div>

					<div>
						<h4 className="font-medium mb-3">Product</h4>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								<Link
									to="/search"
									className="hover:text-foreground transition-colors"
								>
									Search
								</Link>
							</li>
							<li>
								<Link
									to={`#${featuresId}`}
									className="hover:text-foreground transition-colors"
								>
									Features
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h4 className="font-medium mb-3">Design</h4>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								<Badge variant="technical" className="text-xs">
									MINIMAL CLIP-PUNK
								</Badge>
							</li>
							<li>
								<Badge variant="technical" className="text-xs">
									APPROACHABLE
								</Badge>
							</li>
						</ul>
					</div>

					<div>
						<h4 className="font-medium mb-3">Connect</h4>
						<div className="flex gap-2">
							<Badge variant="outline" className="text-xs">
								GitHub
							</Badge>
							<Badge variant="outline" className="text-xs">
								API
							</Badge>
						</div>
					</div>
				</div>

				<div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
					<p>&copy; 2024 Travel Anchor. Smart travel planning for everyone.</p>
				</div>
			</div>
		</footer>
	);
}
