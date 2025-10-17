import {
	Anchor,
	Building,
	Compass,
	MapPin,
	Mountain,
	Plane,
	Plus,
	X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarProvider,
	SidebarSeparator,
} from "@/components/ui/sidebar";
import { useSearchParamsState } from "@/hooks/use-search-params";
import { AirportSearch } from "./AirportSearch";

interface PopularCombination {
	codes: string[];
	title: string;
	description: string;
	Icon: typeof Plane;
}

const popularCombinations: PopularCombination[] = [
	{
		codes: ["JFK", "LAX"],
		title: "NYC + LAX",
		description: "East meets West Coast",
		Icon: Plane,
	},
	{
		codes: ["ORD", "MIA"],
		title: "Chicago + Miami",
		description: "Midwest to Sunshine",
		Icon: MapPin,
	},
	{
		codes: ["SFO", "SEA"],
		title: "SF + Seattle",
		description: "West Coast Connection",
		Icon: Compass,
	},
	{
		codes: ["BOS", "DCA"],
		title: "Boston + DC",
		description: "Northeast Corridor",
		Icon: Building,
	},
	{
		codes: ["DEN", "DFW"],
		title: "Denver + Dallas",
		description: "Mountain to Texas",
		Icon: Mountain,
	},
	{
		codes: ["ATL", "ORD"],
		title: "Atlanta + Chicago",
		description: "Major Hubs",
		Icon: Anchor,
	},
];

export function SearchSidebar() {
	const { iataCodes, addAirport, removeAirport, clearAll } =
		useSearchParamsState();

	const handlePopularCombinationClick = (codes: string[]) => {
		// Clear existing airports first
		clearAll();
		// Add all airports from the combination
		codes.forEach((code) => {
			addAirport(code);
		});
	};

	return (
		<SidebarProvider>
			<Sidebar side="left" variant="sidebar" collapsible="offcanvas">
				<SidebarHeader className="border-b p-4">
					<div className="flex items-center gap-2">
						<Plane className="text-primary size-5" />
						<h2 className="text-lg font-semibold">Flight Search</h2>
					</div>
					<p className="text-muted-foreground text-sm">
						Find meeting points between airports
					</p>
				</SidebarHeader>

				<SidebarContent className="p-4">
					{/* Airport Input Section */}
					<SidebarGroup>
						<AirportSearch
							onSelect={(airport) => {
								addAirport(airport.iata_code);
							}}
						/>
						<SidebarGroupLabel className="sr-only">
							Selected Airports
						</SidebarGroupLabel>
						<SidebarGroupContent className="space-y-3">
							{/* Selected Airports */}
							{iataCodes.length > 0 ? (
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground text-sm">
											Selected ({iataCodes.length})
										</span>
										<Button variant="ghost" size="sm" onClick={clearAll}>
											Clear All
										</Button>
									</div>
									<div className="flex flex-wrap gap-2">
										{iataCodes.map((code) => (
											<Badge
												key={code}
												variant="default"
												className="flex items-center gap-1"
											>
												{code}
												<button
													type="button"
													onClick={() => removeAirport(code)}
													className="hover:bg-secondary-foreground/20 ml-1 rounded-full p-0.5"
												>
													<X className="size-3" />
												</button>
											</Badge>
										))}
									</div>
								</div>
							) : (
								<p className="text-muted-foreground text-sm">
									Add at least 2 airports to search
								</p>
							)}
						</SidebarGroupContent>
					</SidebarGroup>

					<SidebarSeparator className="my-4" />

					{/* Popular Combinations */}
					<SidebarGroup>
						<SidebarGroupLabel>Popular Combinations</SidebarGroupLabel>
						<SidebarGroupContent className="flex flex-col gap-y-2">
							{popularCombinations.map(
								({ codes, description, title, Icon }) => (
									<button
										type="button"
										key={codes.join("-")}
										onClick={() => handlePopularCombinationClick(codes)}
										className="w-full text-left"
									>
										<Card className="hover:bg-accent/50 transition-colors cursor-pointer">
											<div className="flex items-center gap-3 p-3">
												<Icon className="text-primary size-4" />
												<div className="min-w-0 flex-1">
													<div className="text-sm font-medium">{title}</div>
													<div className="text-muted-foreground text-xs">
														{description}
													</div>
												</div>
												<Plus className="text-muted-foreground size-4" />
											</div>
										</Card>
									</button>
								),
							)}
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>

				<SidebarFooter className="border-t p-4">
					<div className="text-center">
						<p className="text-muted-foreground text-xs">
							{iataCodes.length >= 2
								? `Ready to search ${iataCodes.length} airports`
								: `Add ${2 - iataCodes.length} more airport${
										iataCodes.length === 0 ? "s" : ""
									}`}
						</p>
					</div>
				</SidebarFooter>
			</Sidebar>
		</SidebarProvider>
	);
}
