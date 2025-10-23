import type { Route } from "./+types/index";

import { AirportComboboxSelector } from "~/components/landing/AirportComboboxSelector";
import { MinimalFooter } from "~/components/landing/MinimalFooter";
import { MinimalHeader } from "~/components/landing/MinimalHeader";

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
	return (
		<div className="min-h-screen bg-background flex flex-col">
			<MinimalHeader />
			<div className="flex-1">
				<AirportComboboxSelector />
			</div>
			<MinimalFooter />
		</div>
	);
}
