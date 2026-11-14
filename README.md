# ArtisanPack UI for Vue

[![CI](https://github.com/ArtisanPack-UI/vue/actions/workflows/ci.yml/badge.svg)](https://github.com/ArtisanPack-UI/vue/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Vue 3 components for the [ArtisanPack UI design system](https://docs.artisanpackui.dev/documentation/design-system/home). Styling comes from `@artisanpack-ui/css` (design tokens in cascade layers, Tailwind optional) and interaction from `@artisanpack-ui/behavior`, so every component shares its props, parts, events and keyboard behavior with the React and Livewire packages.

## Packages

| Package                                               | What it is                                                                                                  |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [`@artisanpack-ui/vue`](packages/vue)                 | The components, the composables, the Vue plugin and the AI admin components (`/ai`)                         |
| [`@artisanpack-ui/vue-laravel`](packages/vue-laravel) | Inertia.js wrappers for Laravel: validation-aware form fields, pagination, menus, flash toasts and the user |

## Quick start

```bash
npm install @artisanpack-ui/vue @artisanpack-ui/css
```

```ts
// main.ts
import '@artisanpack-ui/css';
```

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Button, Input } from '@artisanpack-ui/vue';

const email = ref('');
</script>

<template>
  <Input v-model="email" label="Email" type="email" name="email" />
  <Button type="submit" color="primary">Sign in</Button>
</template>
```

Requires Vue 3.5 or later. Coming from 1.x? DaisyUI is no longer used; see [Upgrading from 1.x](https://docs.artisanpackui.dev/documentation/vue/upgrading).

## Documentation

- [Getting Started](https://docs.artisanpackui.dev/documentation/vue/getting-started)
- [Components](https://docs.artisanpackui.dev/documentation/vue/components)
- [Theming](https://docs.artisanpackui.dev/documentation/vue/theming)
- [Laravel and Inertia](https://docs.artisanpackui.dev/documentation/vue/laravel-inertia)
- [Nuxt and Server Rendering](https://docs.artisanpackui.dev/documentation/vue/nuxt-and-server-rendering)
- [All topics](https://docs.artisanpackui.dev/documentation/vue/home)

## Development

```bash
scripts/checkout-design-system.sh --build   # the design-system packages, at ../design-system
npm ci
npm run build
npm test
npm run story:dev                           # the Histoire playground
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the contributor guide.

## License

[MIT](LICENSE)
