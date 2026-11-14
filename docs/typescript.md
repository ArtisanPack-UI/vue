---
title: TypeScript
menu_order: 8
---

# TypeScript

Both packages are written in TypeScript and ship their declarations. Every entry has its own: the root and each subpath (`/form`, `/layout`, `/navigation`, `/display`, `/data`, `/feedback`, `/utility`, `/composables`, `/ai`), so imports from a subpath are typed too. Use Vue's language tools (Vue - Official in the editor, `vue-tsc` on the command line) to type-check props, events and slots in templates.

## Component types

Each component exports its types beside it, from the root and from its subpath:

| Type          | What it is                                                         |
| ------------- | ------------------------------------------------------------------ |
| `<Name>Props` | The props, such as `ButtonProps` or `DialogProps`                  |
| `<Name>Emits` | The events, for components that declare them, such as `InputEmits` |
| `<Name>Part`  | The part names `classes` takes, such as `ButtonPart`               |

Many components also export the types of their data, such as `TableColumn` for Table's `headers`, `MenuItemData` for Menu's `items`, `BreadcrumbItem` for Breadcrumbs, and value unions such as `AlertColor` and `ToastColor`.

```ts
import type { ButtonProps, TableColumn } from '@artisanpack-ui/vue';

const columns: TableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'total', label: 'Total', numeric: true },
];

const saveButton: ButtonProps = { color: 'primary', leadingIcon: 'check' };
```

The composables export `Breakpoint`, `BreakpointContext`, `ColorScheme` and `ThemeContextValue`. The plugin exports `ArtisanPackUIOptions`. The AI subpath exports its API types; see [AI Components](Ai-Components). `@artisanpack-ui/vue-laravel` exports the Laravel types; see [Laravel and Inertia](Laravel-Inertia).

## Globally registered components

The [Vue plugin](Getting-Started) registers components at runtime, under names you choose, so it can't declare their types. To type them in templates, declare them yourself:

```ts
// src/components.d.ts
import type { Button, Card } from '@artisanpack-ui/vue';

declare module 'vue' {
  export interface GlobalComponents {
    ApButton: typeof Button;
    ApCard: typeof Card;
  }
}
```

Importing components where you use them needs none of this.
