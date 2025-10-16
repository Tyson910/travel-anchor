<script lang="ts">
	import type { UseFlightRouteQueryResult } from '$lib/queries.remote';

	import * as Accordion from '$lib/components/ui/accordion/index.js';

	import { Card } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';

	interface Props {
		route: UseFlightRouteQueryResult['routes'][number];
	}

	const { route }: Props = $props();
</script>

<Card
	class="hover:border-primary-200 dark:hover:border-primary-800 group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
>
	<div class="p-6">
		<div class="mb-4 flex items-start justify-between">
			<div>
				<div class="mb-2 flex items-center gap-2">
					<Badge variant="secondary">{route.destination_airport.iata_code}</Badge>
					<h3 class="text-lg font-semibold">{route.destination_airport.name}</h3>
				</div>
			</div>
		</div>

		<Accordion.Root type="multiple">
			{#each route.origin_airport_options as option}
				<Accordion.Item value={option.iata_code}>
					<Accordion.Trigger>{option.name}</Accordion.Trigger>
					<Accordion.Content>
						<ul class="mt-4 flex list-disc flex-col gap-4">
							<div class="font-bold text-secondary-foreground">
								{option.airline_options.length} airline options
							</div>
							{#each option.airline_options as airline}
								<li class="list-disc">
									{airline.name}
								</li>
							{/each}
						</ul>
					</Accordion.Content>
				</Accordion.Item>
			{/each}
		</Accordion.Root>
	</div>
</Card>
