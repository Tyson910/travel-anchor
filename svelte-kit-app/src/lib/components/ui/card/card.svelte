<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils";

	let { class: className, children, ...rest }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
	class={cn(
		"rounded-lg border bg-card text-card-foreground shadow-sm",
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>
