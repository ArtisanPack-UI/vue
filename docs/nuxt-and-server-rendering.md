---
title: Nuxt and Server Rendering
menu_order: 7
---

# Nuxt and Server Rendering

The components render on the server with Vue's SSR renderer and hydrate in the browser. Generated IDs, which link labels, hints and errors to their controls, come from Vue's `useId()`, so they match on both sides.

## Nuxt

Load the CSS through `nuxt.config.ts`:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  css: ['@artisanpack-ui/css'],
});
```

With Tailwind v4, import `@artisanpack-ui/css` from your Tailwind entry stylesheet instead; see [Getting Started](Getting-Started).

Apply the stored theme choice before the first paint by adding `themeScript()` to the head, in `app.vue`:

```vue
<script setup lang="ts">
import { themeScript } from '@artisanpack-ui/behavior';

useHead({
  script: [{ innerHTML: themeScript(), tagPriority: 'critical' }],
});
</script>
```

`@artisanpack-ui/behavior` comes with `@artisanpack-ui/vue`; add it to your own dependencies as well, since you import it directly.

Import components where you use them. To register some globally, install the [Vue plugin](Getting-Started) from a Nuxt plugin:

```ts
// plugins/artisanpack-ui.ts
import { Button, Card, createArtisanPackUI } from '@artisanpack-ui/vue';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(createArtisanPackUI({ components: { Button, Card } }));
});
```

## Other server-rendered apps

Without Nuxt, render `ThemeScript` from `@artisanpack-ui/vue` first in the document `<head>`, before any stylesheet; see [Theming](Theming). With Inertia, the head is in the Blade template; see [Laravel and Inertia](Laravel-Inertia).

## What runs only in the browser

- **Toasts.** A `Toaster` starts routing `toast.create()` calls once it has mounted, so nothing is registered during server rendering.
- **Theme.** `ThemeToggle` reads the stored choice in the browser. The server can't know it, which is why the head script applies it before the page paints.
- **Breakpoints.** `useBreakpoint()` has no viewport on the server and reports `'md'` there. Don't use it to decide what the server renders, or the markup won't match on hydration.
- **Color scheme.** `provideTheme()` resolves `'system'` to `'light'` on the server.
