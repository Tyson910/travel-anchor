<script lang="ts">
	import {
		Plane,
		Plus,
		X,
		Search,
		MapPin,
		Compass,
		Building,
		Mountain,
		Anchor
	} from '@lucide/svelte';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Card } from '$lib/components/ui/card';

	import { useSearchQueryParams } from '$lib/hooks/use-query-params.svelte';
	import AirportSearch from './AirportSearch.svelte';

	interface PopularCombination {
		codes: string[];
		title: string;
		description: string;
		Icon: typeof Plane;
	}

	const popularCombinations: PopularCombination[] = [
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
	];

	const searchQuery = useSearchQueryParams();
</script>

<Sidebar.Root side="left" variant="sidebar" collapsible="offcanvas">
	<Sidebar.Header class="border-b p-4">
		<div class="flex items-center gap-2">
			<Plane class="text-primary size-5" />
			<h2 class="text-lg font-semibold">Flight Search</h2>
		</div>
		<p class="text-muted-foreground text-sm">Find meeting points between airports</p>
	</Sidebar.Header>

	<Sidebar.Content class="p-4">
		<!-- Airport Input Section -->
		<Sidebar.Group>
			<AirportSearch
				onSelect={(airport) => {
					console.log(airport);
				}}
			/>
			<Sidebar.GroupLabel class="sr-only">Selected Airports</Sidebar.GroupLabel>
			<Sidebar.GroupContent class="space-y-3">
				<!-- Selected Airports -->
				{#if searchQuery.iataCodes.length > 0}
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<span class="text-muted-foreground text-sm"
								>Selected ({searchQuery.iataCodes.length})</span
							>
							<Button variant="ghost" size="sm" onclick={searchQuery.clearAll}>Clear All</Button>
						</div>
						<div class="flex flex-wrap gap-2">
							{#each searchQuery.iataCodes as code}
								<Badge variant="default" class="flex items-center gap-1">
									{code}
									<button
										onclick={() => searchQuery.removeAirport(code)}
										class="hover:bg-secondary-foreground/20 ml-1 rounded-full p-0.5"
									>
										<X class="size-3" />
									</button>
								</Badge>
							{/each}
						</div>
					</div>
				{:else}
					<p class="text-muted-foreground text-sm">Add at least 2 airports to search</p>
				{/if}
			</Sidebar.GroupContent>
		</Sidebar.Group>

		<Sidebar.Separator class="my-4" />

		<!-- Popular Combinations -->
		<Sidebar.Group>
			<Sidebar.GroupLabel>Popular Combinations</Sidebar.GroupLabel>
			<Sidebar.GroupContent class="flex flex-col gap-y-2">
				{#each popularCombinations as { codes, description, title, Icon } (codes.join('-'))}
					<a href={searchQuery.getPopularCombinationURL(codes).toString()}>
						<Card>
							<div class="flex items-center gap-3 p-3">
								<Icon class="text-primary size-4" />
								<div class="min-w-0 flex-1">
									<div class="text-sm font-medium">{title}</div>
									<div class="text-muted-foreground text-xs">{description}</div>
								</div>
								<Plus class="text-muted-foreground size-4" />
							</div>
						</Card>
					</a>
				{/each}
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>

	<Sidebar.Footer class="border-t p-4">
		<div class="text-center">
			<p class="text-muted-foreground text-xs">
				{searchQuery.iataCodes.length >= 2
					? `Ready to search ${searchQuery.iataCodes.length} airports`
					: `Add ${2 - searchQuery.iataCodes.length} more airport${searchQuery.iataCodes.length === 0 ? 's' : ''}`}
			</p>
		</div>
	</Sidebar.Footer>
</Sidebar.Root>
