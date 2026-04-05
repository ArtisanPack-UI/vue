# Getting Started

This guide walks you through installing and configuring ArtisanPack UI for Vue.

## Prerequisites

- Node.js 18+
- Vue 3.5+
- Tailwind CSS 4+
- DaisyUI 5+

## Installation

### 1. Install the package

```bash
npm install @artisanpack-ui/vue
```

### 2. Install peer dependencies

Tailwind CSS and DaisyUI must be configured in your project:

```bash
npm install -D tailwindcss @tailwindcss/vite daisyui
```

Add Tailwind and DaisyUI to your CSS entry point:

```css
@import "tailwindcss";
@plugin "daisyui";
```

### 3. Register the Vue plugin

In your application entry file (e.g., `main.ts`):

```ts
import { createApp } from 'vue';
import { createArtisanPackUI } from '@artisanpack-ui/vue';
import App from './App.vue';

const app = createApp(App);
app.use(createArtisanPackUI());
app.mount('#app');
```

### 4. Set up the theme provider

Wrap your root component with `provideTheme()` to enable dark mode support:

```vue
<!-- App.vue -->
<script setup lang="ts">
import { provideTheme } from '@artisanpack-ui/vue';

const { resolvedColorScheme } = provideTheme();
</script>

<template>
  <div :data-theme="resolvedColorScheme">
    <RouterView />
  </div>
</template>
```

## Using Components

Import components directly for tree-shaking:

```vue
<script setup lang="ts">
import { Button, Input, Card } from '@artisanpack-ui/vue';
</script>

<template>
  <Card title="Sign In">
    <Input label="Email" type="email" v-model="email" />
    <Input label="Password" type="password" v-model="password" />
    <Button color="primary" @click="submit">Log In</Button>
  </Card>
</template>
```

### Category imports

Import from specific categories to reduce bundle size:

```ts
import { Button, Input, Select } from '@artisanpack-ui/vue/form';
import { Card, Modal, Tabs } from '@artisanpack-ui/vue/layout';
import { Menu, Breadcrumbs } from '@artisanpack-ui/vue/navigation';
import { Avatar, Badge, Table } from '@artisanpack-ui/vue/display';
import { Calendar, Chart } from '@artisanpack-ui/vue/data';
import { Alert, Loading, ToastProvider } from '@artisanpack-ui/vue/feedback';
import { Icon, ThemeToggle, Tooltip } from '@artisanpack-ui/vue/utility';
```

### Global registration (optional)

If you prefer global components instead of imports:

```ts
import { createArtisanPackUI, Button, Card, Input } from '@artisanpack-ui/vue';

app.use(createArtisanPackUI({
  prefix: 'Ap',
  components: { Button, Card, Input },
}));

// Now available as <ApButton />, <ApCard />, <ApInput />
```

## Plugin Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `prefix` | `string` | `'Ap'` | Prefix for globally registered component names |
| `defaultColorScheme` | `'light' \| 'dark' \| 'system'` | `'system'` | Initial color scheme for the theme provider |
| `components` | `Record<string, Component>` | `{}` | Components to register globally |

## What's Next

- [[Component API Reference]] — Full props, slots, and events for every component
- [[Theming]] — Customize colors and dark mode
- [[Design Tokens]] — Shared types and values
- [[Composables]] — `useTheme` and `useBreakpoint`
- [[Laravel Inertia Integration]] — Set up with Inertia.js
