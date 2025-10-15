<script lang="ts">
	import { Card } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Plane, MapPin, Users } from '@lucide/svelte';

	interface FlightRoute {
		destination: {
			iata: string;
			name: string;
			city: string;
			country: string;
		};
		averagePrice?: number;
		airlineCount?: number;
		flightFrequency?: number;
	}

	interface Props {
		route: FlightRoute;
	}

	const props: Props = $props();

	const { route } = props;
</script>

<Card class="group hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
	<div class="p-6">
		<div class="flex items-start justify-between mb-4">
			<div>
				<div class="flex items-center gap-2 mb-2">
					<Badge variant="secondary">{route.destination.iata}</Badge>
					<h3 class="text-lg font-semibold">{route.destination.name}</h3>
				</div>
				<div class="flex items-center gap-1 text-muted-foreground text-sm">
					<MapPin class="size-4" />
					<span>{route.destination.city}, {route.destination.country}</span>
				</div>
			</div>
			<Plane class="text-primary size-5 transition-transform duration-300 group-hover:scale-110" />
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
			{#if route.averagePrice}
				<div class="text-center">
					<div class="text-2xl font-bold text-primary">${route.averagePrice}</div>
					<div class="text-xs text-muted-foreground">Avg Price</div>
				</div>
			{/if}
			
			{#if route.airlineCount}
				<div class="text-center">
					<div class="text-2xl font-bold text-secondary-foreground">{route.airlineCount}</div>
					<div class="text-xs text-muted-foreground">Airlines</div>
				</div>
			{/if}
			
			{#if route.flightFrequency}
				<div class="text-center">
					<div class="text-2xl font-bold text-secondary-foreground">{route.flightFrequency}</div>
					<div class="text-xs text-muted-foreground">Daily Flights</div>
				</div>
			{/if}
		</div>

		{#if route.averagePrice && route.airlineCount}
			<div class="mt-4 pt-4 border-t border-border">
				<div class="flex items-center gap-2 text-sm text-muted-foreground">
					<Users class="size-4" />
					<span>Popular meeting destination</span>
				</div>
			</div>
		{/if}
	</div>
</Card>