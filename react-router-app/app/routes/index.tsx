import type { Route } from "./+types/index";

import { AirportComboboxSelector } from "~/features/landing/AirportComboboxSelector";

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
	return <AirportComboboxSelector />;
}
