<script lang="ts">
	import type { Component } from 'svelte';
	import { useSearchQueryParams } from '$lib/hooks/use-query-params.svelte';
	import { LayoutGrid, Map } from '@lucide/svelte';

	const searchParams = useSearchQueryParams();
</script>

{#snippet ToggleButton(label: 'grid' | 'map', Icon: Component)}
	<button
		type="button"
		class="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium capitalize transition-all {searchParams.activeView ===
		label
			? 'bg-primary text-primary-foreground shadow-sm'
			: 'text-muted-foreground hover:bg-accent hover:text-foreground'}"
		onclick={() => searchParams.setView(label)}
		aria-pressed={searchParams.activeView === label}
	>
		<Icon class="mr-2 size-4" />
		{label}
	</button>
{/snippet}

<div class="inline-flex items-center rounded-lg border border-border bg-background p-1">
	{@render ToggleButton('grid', LayoutGrid)}
	{@render ToggleButton('map', Map)}
</div>
