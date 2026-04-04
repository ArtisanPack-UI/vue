# Contributing to ArtisanPack UI for Vue

Thank you for your interest in contributing! This guide covers everything you need to get started.

## Local Development Setup

### Prerequisites

- Node.js 18+
- npm 9+

### Clone and install

```bash
git clone https://github.com/ArtisanPack-UI/vue.git
cd vue
npm install
```

### Build all packages

```bash
npm run build
```

### Run tests

```bash
npm run test
```

### Launch Histoire (component playground)

```bash
npm run story:dev
```

## Repository Structure

```
vue/
├── packages/
│   ├── vue/             # Core component library
│   │   ├── src/
│   │   │   ├── components/   # All Vue components by category
│   │   │   ├── composables/  # useTheme, useBreakpoint
│   │   │   ├── plugin/       # Vue plugin (createArtisanPackUI)
│   │   │   ├── types/        # Shared type definitions
│   │   │   └── __tests__/    # Unit tests
│   │   └── visual-tests/     # Playwright visual regression tests
│   └── vue-laravel/     # Inertia.js adapter package
│       └── src/
│           ├── components/   # Inertia-wrapped components
│           ├── composables/  # useInertiaForm, useFlashMessages, useAuth
│           ├── plugin/       # Vue plugin (createArtisanPackUILaravel)
│           ├── types/        # Laravel-specific types
│           └── __tests__/    # Unit tests
├── docs/                # Documentation
└── .changeset/          # Changeset configuration
```

## Code Style

This project uses ESLint and Prettier for code formatting.

```bash
# Lint
npm run lint

# Format
npm run format

# Check formatting without writing
npm run format:check
```

### Conventions

- Use TypeScript for all source files
- Define component props in a separate `types.ts` file as an interface (e.g., `ButtonProps`)
- Add JSDoc/TSDoc comments to all exported interfaces, types, and functions
- Use `defineProps<Props>()` with the imported type interface
- Follow Vue 3 Composition API patterns with `<script setup lang="ts">`

## Adding a New Component

1. Create the component directory under the appropriate category:

   ```
   packages/vue/src/components/{category}/{ComponentName}/
   ├── ComponentName.vue
   ├── ComponentName.story.vue
   └── types.ts
   ```

2. Define the props interface in `types.ts` with JSDoc comments.

3. Export the component and types from the category barrel file (`{category}/index.ts`).

4. Add a Histoire story file for interactive documentation.

5. Add unit tests in `packages/vue/src/__tests__/`.

## Pull Request Process

1. **Create a branch** from `release/1.0` (or the current release branch):

   ```bash
   git checkout -b feature/123-short-description
   ```

2. **Make your changes** following the code style and conventions above.

3. **Add a changeset** to document your change:

   ```bash
   npx changeset
   ```

   Select the affected packages and describe the change. Choose the appropriate bump type:
   - `patch` for bug fixes
   - `minor` for new features or enhancements
   - `major` for breaking changes

4. **Run checks** before pushing:

   ```bash
   npm run build
   npm run test
   npm run lint
   npm run format:check
   npm run type-check
   ```

5. **Push and open a PR** against the base branch. Fill out the PR template completely.

6. **Address review feedback** and ensure CI passes.

## Changeset Workflow

This monorepo uses [Changesets](https://github.com/changesets/changesets) for versioning and changelog generation.

- Every PR that changes package behavior should include a changeset
- Documentation-only changes do not require a changeset
- Run `npx changeset` to interactively create one
- Changesets are committed as markdown files in `.changeset/`
- On release, changesets are consumed to bump versions and generate changelogs

## Running Tests

```bash
# All tests across all packages
npm run test

# Tests for a specific package
npm run test --workspace=packages/vue
npm run test --workspace=packages/vue-laravel

# Watch mode (single package)
cd packages/vue && npm run test:watch

# Visual regression tests (requires Histoire build)
npm run test:visual

# Update visual snapshots
npm run test:visual:update
```

## Type Checking

```bash
npm run type-check
```

## Reporting Issues

Use the [issue templates](https://github.com/ArtisanPack-UI/vue/issues/new/choose) to report bugs, request features, or propose enhancements.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
