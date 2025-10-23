import { Route as RouteIcon } from "lucide-react";

export function MinimalHeader() {
	return (
		<header className="border-b border-border">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
							<RouteIcon className="w-4 h-4 text-primary-foreground" />
						</div>
						<div className="text-xl font-bold tracking-tight">
							Travel Anchor
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
