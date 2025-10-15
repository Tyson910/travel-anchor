<script lang="ts">
	import type { Component } from 'svelte';

	import {
		Plane,
		MapPin,
		Compass,
		Building,
		Mountain,
		Anchor,
		type IconProps
	} from '@lucide/svelte';
	import { Card } from '$lib/components/ui/card';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	interface PopularCombination {
		codes: string[];
		title: string;
		description: string;
		Icon: Component<IconProps, {}, ''>;
	}

	const popularCombinations = [
		{
			codes: ['JFK', 'LAX'],
			title: 'NYC + LAX',
			description: 'East meets West Coast',
			Icon: Plane
		},
		{
			codes: ['ORD', 'MIA'],
			title: 'Chicago + Miami',
			description: 'Midwest to Sunshine',
			Icon: MapPin
		},
		{
			codes: ['SFO', 'SEA'],
			title: 'SF + Seattle',
			description: 'West Coast Connection',
			Icon: Compass
		},
		{
			codes: ['BOS', 'DCA'],
			title: 'Boston + DC',
			description: 'Northeast Corridor',
			Icon: Building
		},
		{
			codes: ['DEN', 'DFW'],
			title: 'Denver + Dallas',
			description: 'Mountain to Texas',
			Icon: Mountain
		},
		{
			codes: ['ATL', 'ORD'],
			title: 'Atlanta + Chicago',
			description: 'Major Hubs',
			Icon: Anchor
		}
	] as const satisfies PopularCombination[];

	function getURL(combo: PopularCombination) {
		const url = new URL(resolve('/search'), page.url.origin);
		url.searchParams.set('view', 'map');
		combo.codes.forEach((code) => {
			url.searchParams.append('codes', code);
		});
		return url;
	}
</script>

<div class="container mx-auto px-4">
	<div class="mb-16 text-center">
		<h2 class="mb-4 text-3xl font-bold md:text-4xl">Popular Combinations</h2>
		<p class="text-muted-foreground mx-auto max-w-2xl text-lg md:text-xl">
			Click any combination to instantly search for meeting points
		</p>
	</div>

	<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
		{#each popularCombinations as { codes, description, title, Icon } (codes.join('-'))}
			<Card
				class="hover:border-primary-200 dark:hover:border-primary-800 group cursor-pointer border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
			>
				<a
					class="block p-6 text-center lg:p-8"
					href={getURL({ codes, description, title, Icon }).toString()}
				>
					<div class="mb-4 flex justify-center">
						<Icon
							class="text-primary-500 size-10 transition-transform duration-300 group-hover:scale-110"
						/>
					</div>
					<h3 class="mb-2 text-xl font-semibold">{title}</h3>
					<p class="text-muted-foreground">{description}</p>
				</a>
			</Card>
		{/each}
	</div>
</div>
