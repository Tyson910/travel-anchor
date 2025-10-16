<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Badge } from '$lib/components/ui/badge';
	import { Card } from '$lib/components/ui/card';
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
	import type { App } from '@travel-anchor/hono-api';
	import { hc, parseResponse } from 'hono/client';
	import { parseIataCodesParams } from '$lib/hooks/use-query-params.svelte';

	interface PopularCombination {
		codes: string[];
		title: string;
		description: string;
		Icon: typeof Plane;
	}

	interface Airport {
		iata_code: string;
		name: string;
		city_name: string | null;
		state_name: string | null;
		country_name: string | null;
		country_code: string;
		latitude: number;
		longitude: number;
		timezone: string | null;
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

	let searchInput = $state('');
	let selectedAirports = $state<string[]>(parseIataCodesParams(page.url.searchParams));
	let showSuggestions = $state(false);
	let activeSuggestionIndex = $state(-1);
	let searchResults = $state<Airport[]>([]);

	const useHonoClient = () => {
		return hc<App>(`http://localhost:3000`);
	};

	$effect(() => {
		selectedAirports = parseIataCodesParams(page.url.searchParams);
	});

	// Debounced search function
	let searchTimeout: ReturnType<typeof setTimeout>;
	$effect(() => {
		if (searchInput.trim().length < 2) {
			searchResults = [];
			return;
		}

		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(async () => {
			try {
				const endpoint = useHonoClient().v1.airport.$get({
					query: { query: searchInput }
				});
				const result = await parseResponse(endpoint);
				searchResults = result.airports || [];
			} catch (error) {
				console.error('Search error:', error);
				searchResults = [];
			}
		}, 300);
	});

	function isValidIATA(code: string): boolean {
		return /^[A-Z]{3}$/.test(code.toUpperCase());
	}

	function addAirport(code: string) {
		const upperCode = code.toUpperCase();
		if (isValidIATA(upperCode) && !selectedAirports.includes(upperCode)) {
			selectedAirports = [...selectedAirports, upperCode];
			searchInput = '';
			showSuggestions = false;
			activeSuggestionIndex = -1;
			searchResults = [];
		}
	}

	function removeAirport(code: string) {
		selectedAirports = selectedAirports.filter((c) => c !== code);
	}

	function clearAll() {
		selectedAirports = [];
	}

	function searchRoutes() {
		if (selectedAirports.length >= 2) {
			const url = new URL(page.url);
			url.searchParams.delete('codes');
			selectedAirports.forEach((code) => {
				url.searchParams.append('codes', code);
			});
			goto(url.toString());
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!showSuggestions) return;

		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				activeSuggestionIndex = Math.min(
					activeSuggestionIndex + 1,
					Math.max(0, searchResults.length - 1)
				);
				break;
			case 'ArrowUp':
				event.preventDefault();
				activeSuggestionIndex = Math.max(activeSuggestionIndex - 1, -1);
				break;
			case 'Enter':
				event.preventDefault();
				if (activeSuggestionIndex >= 0 && searchResults[activeSuggestionIndex]) {
					addAirport(searchResults[activeSuggestionIndex].iata_code);
				} else if (isValidIATA(searchInput)) {
					addAirport(searchInput);
				}
				break;
			case 'Escape':
				showSuggestions = false;
				activeSuggestionIndex = -1;
				break;
		}
	}

	function selectPopularCombination(combo: PopularCombination) {
		selectedAirports = [...combo.codes];
		searchRoutes();
	}

	const canSearch = $derived(selectedAirports.length >= 2);
	const filteredSuggestions = $derived(searchResults.slice(0, 8));
</script>

<Sidebar.Root side="left" variant="sidebar" collapsible="offcanvas">
	<Sidebar.Header class="border-b p-4">
		<div class="flex items-center gap-2">
			<Plane class="size-5 text-primary" />
			<h2 class="text-lg font-semibold">Flight Search</h2>
		</div>
		<p class="text-sm text-muted-foreground">Find meeting points between airports</p>
	</Sidebar.Header>

	<Sidebar.Content class="p-4">
		<!-- Airport Input Section -->
		<Sidebar.Group>
			<Sidebar.GroupLabel>Departure Airports</Sidebar.GroupLabel>
			<Sidebar.GroupContent class="space-y-3">
				<!-- Search Input -->
				<div class="relative">
					<Input
						placeholder="Enter airport code (e.g., JFK)..."
						bind:value={searchInput}
						onfocus={() => (showSuggestions = true)}
						onblur={() => setTimeout(() => (showSuggestions = false), 200)}
						onkeydown={handleKeydown}
						class="pr-8"
					/>
					{#if searchInput}
						<button
							onclick={() => {
								searchInput = '';
								showSuggestions = false;
								searchResults = [];
							}}
							class="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
						>
							<X class="size-4" />
						</button>
					{/if}

					<!-- Suggestions Dropdown -->
					{#if showSuggestions && filteredSuggestions.length > 0}
						<div
							class="absolute top-full z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-lg"
						>
							<div class="max-h-60 overflow-auto p-1">
								{#each filteredSuggestions as airport, index}
									<button
										class="w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-accent focus:bg-accent data-[active=true]:bg-accent"
										class:data-active={index === activeSuggestionIndex}
										onclick={() => addAirport(airport.iata_code)}
										onmouseenter={() => (activeSuggestionIndex = index)}
									>
										<div class="flex items-center justify-between">
											<div>
												<span class="font-medium">{airport.iata_code}</span>
												<span class="ml-2 text-muted-foreground">{airport.name}</span>
											</div>
											<span class="text-xs text-muted-foreground">{airport.city_name}</span>
										</div>
									</button>
								{/each}
							</div>
						</div>
					{/if}
				</div>

				<!-- Selected Airports -->
				{#if selectedAirports.length > 0}
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<span class="text-sm text-muted-foreground">Selected ({selectedAirports.length})</span
							>
							<Button variant="ghost" size="sm" onclick={clearAll}>Clear All</Button>
						</div>
						<div class="flex flex-wrap gap-2">
							{#each selectedAirports as code}
								<Badge variant="secondary" class="flex items-center gap-1">
									{code}
									<button
										onclick={() => removeAirport(code)}
										class="ml-1 rounded-full p-0.5 hover:bg-secondary-foreground/20"
									>
										<X class="size-3" />
									</button>
								</Badge>
							{/each}
						</div>
					</div>
				{:else}
					<p class="text-sm text-muted-foreground">Add at least 2 airports to search</p>
				{/if}

				<!-- Search Button -->
				<Button class="w-full" disabled={!canSearch} onclick={searchRoutes}>
					<Search class="mr-2 size-4" />
					Search Routes
				</Button>
			</Sidebar.GroupContent>
		</Sidebar.Group>

		<Sidebar.Separator class="my-4" />

		<!-- Popular Combinations -->
		<Sidebar.Group>
			<Sidebar.GroupLabel>Popular Combinations</Sidebar.GroupLabel>
			<Sidebar.GroupContent class="space-y-2">
				{#each popularCombinations as { codes, description, title, Icon } (codes.join('-'))}
					<Card
						class="hover:border-primary-200 dark:hover:border-primary-800 cursor-pointer border transition-all duration-200"
						onclick={() => selectPopularCombination({ codes, description, title, Icon })}
					>
						<div class="flex items-center gap-3 p-3">
							<Icon class="size-4 text-primary" />
							<div class="min-w-0 flex-1">
								<div class="text-sm font-medium">{title}</div>
								<div class="text-xs text-muted-foreground">{description}</div>
							</div>
							<Plus class="size-4 text-muted-foreground" />
						</div>
					</Card>
				{/each}
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>

	<Sidebar.Footer class="border-t p-4">
		<div class="text-center">
			<p class="text-xs text-muted-foreground">
				{selectedAirports.length >= 2
					? `Ready to search ${selectedAirports.length} airports`
					: `Add ${2 - selectedAirports.length} more airport${selectedAirports.length === 0 ? 's' : ''}`}
			</p>
		</div>
	</Sidebar.Footer>
</Sidebar.Root>
