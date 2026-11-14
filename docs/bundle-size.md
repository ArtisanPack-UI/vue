---
title: Bundle Size
menu_order: 9
---

# Bundle Size

`@artisanpack-ui/vue` is published as ES modules only, so a bundler that tree-shakes (Vite, Rollup, webpack, esbuild) keeps only the components you import.

## How the package is built

- **One entry per subpath.** The root and each subpath (`/form`, `/layout`, `/navigation`, `/display`, `/data`, `/feedback`, `/utility`, `/composables`, `/ai`) is its own module. Code they share is split into shared chunks rather than copied into each.
- **Dependencies stay external.** Vue, `@artisanpack-ui/behavior`, `@zag-js/vue` and `@artisanpack-ui/tokens` aren't bundled into the package, so your app holds one copy of each, shared with anything else that uses them.
- **No chart library.** Chart and Sparkline draw inline SVG from tokens, so there's no charting dependency to load.
- **No CSS in JavaScript.** The styles live in `@artisanpack-ui/css`, loaded once as a stylesheet.

## Importing

Import named components, from the root or from a subpath. Both tree-shake:

```ts
import { Button, Input } from '@artisanpack-ui/vue';
import { Button, Input } from '@artisanpack-ui/vue/form';
```

A subpath gives the bundler less to read, which can help in development servers that don't tree-shake. The AI components are only in `@artisanpack-ui/vue/ai`, so nothing from them reaches your bundle unless you import that subpath.

The [Vue plugin](Getting-Started) registers only the components you pass to it. Registering a component globally keeps it in the bundle whether or not a page uses it.

## Measuring

The cost of the package depends on what you import, so measure your own app's production build rather than the package as a whole.
