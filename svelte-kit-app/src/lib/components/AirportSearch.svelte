<script lang="ts">
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Button from '$lib/components/ui/button/button.svelte';

	import { useAirportSearchQuery, type UseAirportSearchQuery } from '$lib/queries.remote';

	interface Props {
		onSelect: (airport: UseAirportSearchQuery['airports'][number]) => void | Promise<void>;
	}

	const { onSelect }: Props = $props();
	let searchInput = $state('');
	let isDialogOpen = $state(false);

	const searchResults = $derived(await useAirportSearchQuery(searchInput));
</script>

<Dialog.Root bind:open={isDialogOpen}>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Button {...props} class="w-full" variant="outline">Search for Airport</Button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
			<Dialog.Description>
				This action cannot be undone. This will permanently delete your account and remove your data
				from our servers.
			</Dialog.Description>
		</Dialog.Header>

		<Command.Root disablePointerSelection shouldFilter={false}>
			<Command.Input placeholder="Type a command or search..." bind:value={searchInput} />
			<Command.List>
				<Command.Empty>No results found.</Command.Empty>
				<Command.Group>
					{#each searchResults.airports as airport}
						<Command.Item
							onSelect={() => {
								isDialogOpen = false;
								Promise.try(onSelect, airport);
							}}
							value={airport.iata_code}>{airport.name}</Command.Item
						>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Dialog.Content>
</Dialog.Root>
