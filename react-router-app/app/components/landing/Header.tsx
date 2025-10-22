import { Route as RouteIcon } from "lucide-react";
import { Link } from "react-router";

import { Button } from "~/components/ui/button";

interface HeaderProps {
	featuresId: string;
	aboutId: string;
}

export function Header({ featuresId, aboutId }: HeaderProps) {
	return (
		<header className="border-b border-border">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
							<RouteIcon className="w-4 h-4 text-primary-foreground" />
						</div>
						<h1 className="text-xl font-bold tracking-tight">Travel Anchor</h1>
					</div>
					<nav className="hidden md:flex items-center gap-6">
						<Link
							to="/search"
							className="text-muted-foreground hover:text-foreground transition-colors"
						>
							Search
						</Link>
						<Link
							to={`#${featuresId}`}
							className="text-muted-foreground hover:text-foreground transition-colors"
						>
							Features
						</Link>
						<Link
							to={`#${aboutId}`}
							className="text-muted-foreground hover:text-foreground transition-colors"
						>
							About
						</Link>
					</nav>
					<Button variant="outline" asChild>
						<Link to="/search">Get Started</Link>
					</Button>
				</div>
			</div>
		</header>
	);
}
