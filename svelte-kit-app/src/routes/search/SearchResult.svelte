<script lang="ts">
	import AirportCard from '$lib/components/AirportCard.svelte';
	import ViewToggle from '$lib/components/ViewToggle.svelte';
	import { Card } from '$lib/components/ui/card';
	import { useSearchQueryParams } from '$lib/hooks/use-query-params.svelte';
	import { useFlightRouteQuery } from '$lib/queries.remote';
	import { AlertCircle } from '@lucide/svelte';
	import { browser } from '$app/environment';

	const searchParams = useSearchQueryParams();
	const IATA_CODES = $derived(searchParams.iataCodes);
</script>

<!-- Results Header -->
<div class="mb-6 flex items-center justify-between">
	<div>
		<h2 class="text-2xl font-semibold">
			Meeting Points from {IATA_CODES.join(' + ')}
		</h2>
		<p class="text-muted-foreground">Common destinations reachable from all selected airports</p>
	</div>
	<ViewToggle />
</div>

<!-- Results Content -->
<svelte:boundary>
	{@const result = await useFlightRouteQuery(IATA_CODES)}

	{#if result.routes.length == 0}
		No results found
	{:else if searchParams.activeView === 'grid'}
		<!-- Grid View -->
		<div class="grid gap-6 md:grid-cols-2">
			{#each result.routes as route}
				<AirportCard {route} />
			{/each}
		</div>
	{:else if searchParams.activeView == 'map'}
		<!-- Map View -->
		<Card class="overflow-hidden p-0">
			<div class="h-[600px]">
				{#if browser}
					{@const formattedAirports = result.routes.map((route) => ({
						iata_code: route.destination_airport.iata_code,
						name: route.destination_airport.name,
						city_name: route.destination_airport.city_name,
						country_name: route.destination_airport.country_name,
						latitude: route.destination_airport.latitude,
						longitude: route.destination_airport.longitude
					}))}
					{#await import('$lib/components/AirportsMap.svelte') then { default: AirportsMap }}
						<AirportsMap airports={formattedAirports} />
					{/await}
				{/if}
			</div>
		</Card>
	{/if}
	{#snippet pending()}
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each { length: 6 } as _}
				<Card class="animate-pulse p-6">
					<div class="mb-4 h-4 w-3/4 rounded bg-muted"></div>
					<div class="mb-2 h-3 w-1/2 rounded bg-muted"></div>
					<div class="h-3 w-2/3 rounded bg-muted"></div>
				</Card>
			{/each}
		</div>
	{/snippet}

	{#snippet failed(err)}
		<Card class="p-12 text-center">
			{err}
			<AlertCircle class="mx-auto mb-4 size-16 text-destructive" />
			<h2 class="mb-2 text-2xl font-semibold">Search Error {err}</h2>
			<p class="text-muted-foreground">
				There was an error searching for flight routes. Please try again.
			</p>
		</Card>
	{/snippet}
</svelte:boundary>
