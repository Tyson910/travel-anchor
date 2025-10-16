<script lang="ts">
	import { cn } from '$lib/utils';
	import { LayoutGrid, Map } from '@lucide/svelte';

	interface Props {
		activeView: 'grid' | 'map';
		onViewChange: (view: 'grid' | 'map') => void;
		class?: string;
	}

	const props: Props = $props();

	const { activeView, onViewChange, class: className } = props;
</script>

<div
	class={cn(
		'inline-flex items-center rounded-lg border border-border bg-background p-1',
		className
	)}
>
	<button
		type="button"
		class="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-all {activeView ===
		'grid'
			? 'bg-primary text-primary-foreground shadow-sm'
			: 'text-muted-foreground hover:bg-accent hover:text-foreground'}"
		onclick={() => onViewChange('grid')}
		aria-pressed={activeView === 'grid'}
	>
		<LayoutGrid class="mr-2 size-4" />
		Grid
	</button>

	<button
		type="button"
		class="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-all {activeView ===
		'map'
			? 'bg-primary text-primary-foreground shadow-sm'
			: 'text-muted-foreground hover:bg-accent hover:text-foreground'}"
		onclick={() => onViewChange('map')}
		aria-pressed={activeView === 'map'}
	>
		<Map class="mr-2 size-4" />
		Map
	</button>
</div>
