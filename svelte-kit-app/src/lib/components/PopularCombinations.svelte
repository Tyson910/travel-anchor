<script lang="ts">
	import type { Component } from "svelte";

	import { Plane, MapPin, Compass, Building, Mountain, Anchor, type IconProps } from "@lucide/svelte";
	import { Card } from "$lib/components/ui/card";

	interface PopularCombination {
		codes: string[];
		title: string;
		description: string;
		Icon: Component<IconProps, {}, "">;
	}

	const popularCombinations = [
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
	] as const satisfies PopularCombination[];
</script>

<div class="container mx-auto px-4">
	<div class="text-center mb-16">
		<h2 class="text-3xl md:text-4xl font-bold mb-4">Popular Combinations</h2>
		<p class="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
			Click any combination to instantly search for meeting points
		</p>
	</div>

	<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
		{#each popularCombinations as {codes, description, title, Icon} (codes.join('-'))}
			<Card
				class="hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 border-2 hover:border-primary-200 dark:hover:border-primary-800"
			>
				<a
					class="block p-6 lg:p-8 text-center"
					href="/search?codes={codes.join(',')}&view=map"
				>
					<div class="flex justify-center mb-4">
						<Icon
							class="size-10 text-primary-500 group-hover:scale-110 transition-transform duration-300"
						/>
					</div>
					<h3 class="text-xl font-semibold mb-2">{title}</h3>
					<p class="text-muted-foreground">{description}</p>
				</a>
			</Card>
		{/each}
	</div>
</div>