# Vue to Svelte Migration Guide

This guide provides step-by-step instructions for AI agents to convert Vue components from the Nuxt app to Svelte components in the Svelte Kit app.

## Project Structure

### Source (Vue/Nuxt)
- **Location**: `/Users/tyson/Documents/Projects/travel-anchor/nuxt-app/app/components/`
- **Framework**: Nuxt 3 with Vue 3 Composition API
- **UI Library**: Nuxt UI (UCard, UContainer, UIcon, etc.)
- **Styling**: Tailwind CSS

### Target (Svelte)
- **Location**: `/Users/tyson/Documents/Projects/travel-anchor/svelte-kit-app/src/lib/components`
- **Framework**: Svelte 5 with TypeScript
- **UI Library**: shadcn-svelte components + Lucide icons
- **Styling**: Tailwind CSS v4 with custom design system

## Migration Process

### Step 1: Analyze the Vue Component

Before starting, examine the Vue component to understand:
- **Props**: What data flows into the component
- **State**: Reactive data and lifecycle hooks
- **Computed Properties**: Derived values
- **Methods**: Functions and event handlers
- **Template**: HTML structure and directives
- **Styling**: CSS classes and responsive design

### Step 2: Set Up Required Dependencies

Check if needed shadcn-svelte components are available:

```bash
# Navigate to Svelte Kit app
cd /Users/tyson/Documents/Projects/travel-anchor/svelte-kit-app

# Check available components
ls src/lib/components/ui/

# Install missing components (if needed)
bun x shadcn-svelte@latest add [component-name]
```

**Common Component Mappings:**
- `UCard` → `Card` (shadcn-svelte)
- `UContainer` → `Container.svelte`
- `UIcon` → Lucide Svelte icons
- `NuxtLink` → `a` tag or `Link.svelte` component

### Step 3: Convert Script Section

#### Vue → Svelte Syntax Mapping

**Vue (Composition API):**
```vue
<script setup lang="ts">
interface Props {
  title: string;
  count?: number;
}

const props = defineProps<Props>();
const count = ref(0);
const doubled = computed(() => count.value * 2);

function increment() {
  count.value++;
}

onMounted(() => {
  console.log('Component mounted');
});
</script>
```

**Svelte Equivalent:**
```svelte
<script lang="ts">
  export let title: string;
  export let count: number = 0; // Default value for optional props
  
  let doubled = $derived(count * 2);
  
  function increment() {
    count++;
  }
  
  $effect(() => {
    console.log('Component mounted or count changed');
  });
</script>
```

#### Key Differences:
- `defineProps()` → `export let`
- `ref()` → Regular variable assignment
- `computed()` → `$derived()`
- `onMounted()` → `$effect()` or `onMount()` from 'svelte'
- `watch()` → `$effect()` or reactive statements

### Step 4: Convert Template Section

#### Directives and Control Flow

**Vue:**
```vue
<template>
  <div v-if="show" class="container">
    <UCard v-for="item in items" :key="item.id">
      <h3>{{ item.title }}</h3>
      <p v-html="item.content"></p>
      <UIcon :name="item.icon" />
    </UCard>
  </div>
</template>
```

**Svelte:**
```svelte
{#if show}
  <div class="container mx-auto px-4">
    {#each items as item (item.id)}
      <Card.Root>
        <h3>{item.title}</h3>
        <p>{@html item.content}</p>
        <svelte:component this={getIcon(item.icon)} />
      </Card.Root>
    {/each}
  </div>
{/if}
```

#### Key Template Conversions:
- `v-if` → `{#if}`
- `v-for` → `{#each}`
- `:key` → `(key)` in each block
- `v-html` → `{@html}`
- `v-bind:` → `{}` (curly braces)
- `v-on:` → `on:`

### Step 5: Handle Navigation

**Vue/Nuxt:**
```vue
<NuxtLink 
  :to="{
    path: '/search',
    query: { codes: ['JFK', 'LAX'], view: 'map' }
  }"
>
  Search
</NuxtLink>
```

**Svelte:**
```svelte
<a href="/search?codes=JFK,LAX&view=map">
  Search
</a>
```

### Step 6: Icon Conversion

The project uses Lucide icons. Map Nuxt UI icon names to Lucide components:

**Icon Mapping Function:**
```typescript
import { Plane, MapPin, Compass, Building, Mountain, Anchor } from "@lucide/svelte";

function getIcon(iconName: string) {
  switch (iconName) {
    case "lucide:plane":
    case "plane":
      return Plane;
    case "lucide:map-pin":
    case "map-pin":
      return MapPin;
    case "lucide:compass":
    case "compass":
      return Compass;
    case "lucide:building":
    case "building":
      return Building;
    case "lucide:mountain":
    case "mountain":
      return Mountain;
    case "lucide:anchor":
    case "anchor":
      return Anchor;
    default:
      return Plane;
  }
}
```

**Usage:**
```svelte
<svelte:component this={getIcon(combination.icon)} class="w-10 h-10" />
```

### Step 7: Styling Preservation

- **Keep all Tailwind classes** - they work the same in Svelte
- **Maintain responsive design** - grid, flexbox, breakpoints
- **Preserve dark mode** - uses CSS custom properties
- **Keep transitions and animations** - same CSS syntax

### Step 8: Component File Structure

**File Location:**
- Create Svelte components in `/Users/tyson/Documents/Projects/travel-anchor/svelte-kit-app/src/lib/`
- Use `.svelte` extension
- Include TypeScript with `<script lang="ts">`

**Example Structure:**
```svelte
<script lang="ts">
  // Imports
  import { Card } from "$lib/components/ui/card";
  import { Plane } from "@lucide/svelte";
  
  // Props
  export let title: string;
  
  // Reactive state
  let count = 0;
  
  // Functions
  function handleClick() {
    count++;
  }
</script>

<!-- Template -->
<div class="container mx-auto">
  <Card.Root class="p-4">
    <h2>{title}</h2>
    <button on:click={handleClick}>
      <Plane class="w-6 h-6" />
      Clicked {count} times
    </button>
  </Card.Root>
</div>
```

### Step 9: Testing and Validation

After creating the component:

1. **Run Svelte Check:**
   ```bash
   cd /Users/tyson/Documents/Projects/travel-anchor/svelte-kit-app
   bun run check
   ```

2. **Build Test:**
   ```bash
   bun run build
   ```

3. **Lint (if needed):**
   ```bash
   bun run lint
   ```

### Step 10: Integration

To use the converted component:

```svelte
<script lang="ts">
  import PopularCombinations from "$lib/PopularCombinations.svelte";
</script>

<PopularCombinations />
```

## Common Patterns and Solutions

### 1. Reactive State
- **Vue:** `const count = ref(0)`
- **Svelte:** `let count = 0` (automatically reactive)

### 2. Computed Values
- **Vue:** `const doubled = computed(() => count.value * 2)`
- **Svelte:** `$: doubled = count * 2` or `let doubled = $derived(count * 2)`

### 3. Event Handling
- **Vue:** `@click="handleClick"`
- **Svelte:** `on:click={handleClick}`

### 4. Conditional Rendering
- **Vue:** `v-if="show"`, `v-else-if="other"`, `v-else`
- **Svelte:** `{#if show}...{:else if other}...{:else}...{/if}`

### 5. List Rendering
- **Vue:** `v-for="item in items" :key="item.id"`
- **Svelte:** `{#each items as item (item.id)}...{/each}`

## Available UI Components

### shadcn-svelte Components
- Card (`Card.Root`)
- Button
- Input
- Label
- And many more (check `/src/lib/components/ui/`)

### Lucide Icons
- All Lucide icons available via `@lucide/svelte`
- Import specific icons: `import { Plane, MapPin } from "@lucide/svelte"`

## Best Practices

1. **Type Safety**: Always use TypeScript for props and state
2. **Component Structure**: Follow existing patterns in the codebase
3. **Styling**: Maintain consistent Tailwind class usage
4. **Accessibility**: Preserve semantic HTML structure
5. **Performance**: Use Svelte's reactive system efficiently
6. **Testing**: Verify component works with build and type checks

## Troubleshooting

### Common Issues:
- **Type errors**: Check TypeScript imports and prop types
- **Build failures**: Verify all imports and component syntax
- **Styling issues**: Ensure Tailwind classes are preserved
- **Navigation problems**: Check URL format for query parameters

### Resources:
- [Svelte Documentation](https://svelte.dev/docs)
- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [shadcn-svelte Components](https://shadcn-svelte.com/docs/components)
- [Lucide Icons](https://lucide.dev/icons/)

---