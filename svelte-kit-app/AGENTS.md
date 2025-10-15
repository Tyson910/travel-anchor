# Agent Guidelines for TravelHelp Repository

## Build/Lint/Test Commands

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run lint` - Run Prettier and ESLint on Svelte files
- `bun run test` - Run all Vitest tests
- `bun run test:unit` - Run Vitest in watch mode
- `bun run check` - Run Svelte type checking

## Code Style Guidelines

- **Formatting**: Use Prettier with tabs, single quotes, no trailing commas, 100 char width
- **Imports**: Use absolute imports from `$lib/` for internal modules
- **Types**: Use TypeScript strictly; prefer explicit typing over `any`
- **Naming**: `camelCase` for variables/functions, `PascalCase` for components/types
- **Svelte**: Use Svelte 5 runes (`$state`, `$derived`, `$props`) and `@render` for children
- **Styling**: Use Tailwind CSS with `cn()` utility for conditional classes. Use `size-n` if height & width are the same values
- **Error Handling**: Use try/catch for async operations, avoid silent failures
- **Components**: Follow Bits-UI patterns with proper TypeScript props and slot handling

## Testing

- Client tests: `src/**/*.svelte.{test,spec}.{js,ts}` (browser environment)
- Server tests: `src/**/*.{test,spec}.{js,ts}` (node environment)
- Use `vitest` for unit testing with Playwright browser testing


## Documentation Sets

- [Abridged documentation](https://svelte.dev/llms-medium.txt): A shorter version of the Svelte and SvelteKit documentation, with examples and non-essential content removed
- [Compressed documentation](https://svelte.dev/llms-small.txt): A minimal version of the Svelte and SvelteKit documentation, with many examples and non-essential content removed
- [Complete documentation](https://svelte.dev/llms-full.txt): The complete Svelte and SvelteKit documentation including all examples and additional content

## Individual Package Documentation

- [Svelte documentation](https://svelte.dev/docs/svelte/llms.txt): This is the developer documentation for Svelte.
- [SvelteKit documentation](https://svelte.dev/docs/kit/llms.txt): This is the developer documentation for SvelteKit.
- [Svelte CLI documentation](https://svelte.dev/docs/cli/llms.txt): This is the developer documentation for Svelte CLI.
- [Svelte MCP documentation](https://svelte.dev/docs/mcp/llms.txt): This is the developer documentation for Svelte MCP.

## Notes

- The abridged and compressed documentation excludes legacy compatibility notes, detailed examples, and supplementary information
- The complete documentation includes all content from the official documentation
- Package-specific documentation files contain only the content relevant to that package
- The content is automatically generated from the same source as the official documentation