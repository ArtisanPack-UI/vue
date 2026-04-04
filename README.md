# ArtisanPack UI for Vue

[![CI](https://github.com/ArtisanPack-UI/vue/actions/workflows/ci.yml/badge.svg)](https://github.com/ArtisanPack-UI/vue/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A comprehensive Vue 3 UI component library for the ArtisanPack UI ecosystem, styled with DaisyUI and Tailwind CSS.

## Packages

| Package | Description |
|---------|-------------|
| [`@artisanpack-ui/vue`](packages/vue) | 58 Vue 3 UI components organized by category (form, layout, navigation, display, data, feedback, utility) |
| [`@artisanpack-ui/vue-laravel`](packages/vue-laravel) | Inertia.js adapter wrappers for seamless Laravel integration |

## Quick Start

### Install the core package

```bash
npm install @artisanpack-ui/vue
```

### Register the plugin

```ts
import { createApp } from 'vue';
import { createArtisanPackUI } from '@artisanpack-ui/vue';
import App from './App.vue';

const app = createApp(App);
app.use(createArtisanPackUI());
app.mount('#app');
```

### Use components

```vue
<script setup lang="ts">
import { Button, Input, Card } from '@artisanpack-ui/vue';
</script>

<template>
  <Card>
    <template #header>Sign In</template>
    <Input label="Email" type="email" v-model="email" />
    <Button color="primary" @click="submit">Log In</Button>
  </Card>
</template>
```

### Tree-shakeable sub-path imports

Import only the categories you need to keep bundle sizes small:

```ts
import { Button, Input } from '@artisanpack-ui/vue/form';
import { Card, Modal } from '@artisanpack-ui/vue/layout';
import { Table } from '@artisanpack-ui/vue/data';
```

## Laravel / Inertia.js Integration

```bash
npm install @artisanpack-ui/vue-laravel
```

```ts
import { createArtisanPackUILaravel } from '@artisanpack-ui/vue-laravel';

app.use(createArtisanPackUILaravel());
```

See the [Laravel integration guide](https://github.com/ArtisanPack-UI/vue/wiki/Laravel-Inertia-Integration) for full setup instructions.

## Requirements

- Vue 3.5+
- Tailwind CSS 4+
- DaisyUI 5+
- Node.js 18+

## Documentation

Full documentation is available on the [GitHub Wiki](https://github.com/ArtisanPack-UI/vue/wiki). Source files live in the [`docs/`](docs/) directory.

- [Getting Started](https://github.com/ArtisanPack-UI/vue/wiki/Getting-Started)
- [Component API Reference](https://github.com/ArtisanPack-UI/vue/wiki/Component-API-Reference)
- [Design Tokens](https://github.com/ArtisanPack-UI/vue/wiki/Design-Tokens)
- [Theming Guide](https://github.com/ArtisanPack-UI/vue/wiki/Theming)
- [Composables Reference](https://github.com/ArtisanPack-UI/vue/wiki/Composables)
- [Laravel / Inertia Integration](https://github.com/ArtisanPack-UI/vue/wiki/Laravel-Inertia-Integration)
- [Migration from Livewire](https://github.com/ArtisanPack-UI/vue/wiki/Migration-from-Livewire)

## Development

```bash
git clone https://github.com/ArtisanPack-UI/vue.git
cd vue
npm install
npm run build
npm run test
npm run story:dev   # Launch Histoire component playground
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full contributor guide.

## License

[MIT](LICENSE)
