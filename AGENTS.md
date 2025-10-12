# Agent Guidelines for TravelHelp Repository

This document outlines the essential commands and code style guidelines for AI agents operating within this repository.

## Code Style Guidelines

### Formatting & Linting
- This project uses `Biome` for code formatting & linting. Always run `bun run lint` from the root before committing changes to ensure consistent formatting.

### General Guidelines
- **Imports**: Follow existing import patterns. Generally, absolute imports are preferred for internal modules, and relative imports for sibling modules.
- **Naming Conventions**: Adhere to `camelCase` for variables and functions, `PascalCase` for types and interfaces, and `SCREAMING_SNAKE_CASE` for constants.
- **Error Handling**: Implement robust error handling using `try...catch` blocks where appropriate, especially for I/O operations and API calls.
- **Types**: Utilize TypeScript types extensively to ensure type safety and code clarity.
- **Comments**: Add comments sparingly, focusing on *why* a piece of code exists or *what problem it solves*, rather than *how* it works.

## External File Loading

CRITICAL: When you encounter a file reference (e.g., @rules/general.md), use your Read tool to load it on a need-to-know basis. They're relevant to the SPECIFIC task at hand.

Instructions:

- Do NOT preemptively load all references - use lazy loading based on actual need
- When loaded, treat content as mandatory instructions that override defaults
- Follow references recursively when needed

## Development Guidelines

For testing strategies and coverage requirements: .github/instructions/nodejsjavascript-vitest.instructions.md
For working on Front-End: .github/instructions/web-interface-guidelines.instructions.md

## General Guidelines

Read the following files immediately as it's relevant to all workflows: .github/instructions/spec-driven-workflow-v1.instructions.md & .github/instructions/self-explanatory-code-commenting.instructions.md