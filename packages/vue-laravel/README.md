# @artisanpack-ui/vue-laravel

[![CI](https://github.com/ArtisanPack-UI/vue/actions/workflows/ci.yml/badge.svg)](https://github.com/ArtisanPack-UI/vue/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@artisanpack-ui/vue-laravel)](https://www.npmjs.com/package/@artisanpack-ui/vue-laravel)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/ArtisanPack-UI/vue/blob/main/LICENSE)

[Inertia.js](https://inertiajs.com/) adapter wrappers for [ArtisanPack UI Vue](https://www.npmjs.com/package/@artisanpack-ui/vue) components. Provides navigation, forms, feedback integration, and layout helpers for [Laravel](https://laravel.com/) applications.

## Installation

```bash
npm install @artisanpack-ui/vue-laravel @artisanpack-ui/vue @artisanpack-ui/tokens
```

### Peer Dependencies

```bash
npm install vue @inertiajs/vue3
```

## Setup

Import the tokens CSS in your Tailwind entry file:

```css
@import "tailwindcss";
@import "@artisanpack-ui/tokens/css";
```

Register the plugin:

```ts
import { createApp } from 'vue';
import { createArtisanPackUI } from '@artisanpack-ui/vue';
import { createArtisanPackUILaravel } from '@artisanpack-ui/vue-laravel';
import App from './App.vue';

const app = createApp(App);
app.use(createArtisanPackUI());
app.use(createArtisanPackUILaravel());
app.mount('#app');
```

## Usage

```vue
<script setup lang="ts">
import { useInertiaForm } from '@artisanpack-ui/vue-laravel';
import { Input, Button } from '@artisanpack-ui/vue';

const { form, field } = useInertiaForm({ email: '', password: '' });

function submit() {
  form.post('/login');
}
</script>

<template>
  <form @submit.prevent="submit">
    <Input label="Email" v-bind="field('email')" />
    <Input label="Password" type="password" v-bind="field('password')" />
    <Button color="primary" :loading="form.processing">Log In</Button>
  </form>
</template>
```

## Features

- **Navigation** - Inertia-aware Link and Navbar components with active state detection
- **Forms** - `useInertiaForm` composable bridging Inertia's form helper with ArtisanPack UI inputs
- **Layouts** - Persistent layout components for Inertia.js pages
- **Feedback** - Toast provider that captures Inertia flash messages

## Inertia.js Compatibility

Supports Inertia.js v2.

## Vue Compatibility

Requires Vue 3.5+.

## Documentation

- [Laravel / Inertia Integration](https://github.com/ArtisanPack-UI/vue/wiki/Laravel-Inertia-Integration)
- [Getting Started](https://github.com/ArtisanPack-UI/vue/wiki/Getting-Started)

## Part of ArtisanPack UI

| Package | Description |
|---------|-------------|
| [`@artisanpack-ui/tokens`](https://www.npmjs.com/package/@artisanpack-ui/tokens) | Design tokens, color resolver, glass helpers |
| [`@artisanpack-ui/vue`](https://www.npmjs.com/package/@artisanpack-ui/vue) | 56+ Vue 3 UI components |
| [`@artisanpack-ui/vue-laravel`](https://www.npmjs.com/package/@artisanpack-ui/vue-laravel) | Inertia.js adapter wrappers |

## License

[MIT](https://github.com/ArtisanPack-UI/vue/blob/main/LICENSE) - Jacob Martella
