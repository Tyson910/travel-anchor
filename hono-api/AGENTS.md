# AGENTS.md

## Build/Lint/Test Commands
- `bun run dev` - Start development server with watch mode
- `bun run build` - Build for production
- `bun test` - Run all tests
- `bun test --watch` - Run tests in watch mode
- `bun test handlers.test.ts` - Run specific test file
- `bun run db:generate` - Generate Prisma client

## Code Style Guidelines
- **TypeScript**: Strict mode enabled with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`
- **Imports**: Use ES modules with `type` imports for types
- **Formatting**: 4-space indentation, semicolons required
- **Naming**: camelCase for variables/functions, PascalCase for types/classes
- **Error Handling**: Use custom error classes (NoResultError), handle SQLite errors specifically
- **API Design**: Use Hono with Zod OpenAPI for route validation and documentation
- **Testing**: Use Bun test framework with Hono test client
- **File Structure**: Separate DAL, handlers, middleware, and validators
- **Types**: Use Zod schemas for validation with OpenAPI metadata