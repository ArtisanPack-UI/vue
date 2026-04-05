# @artisanpack-ui/vue

[![CI](https://github.com/ArtisanPack-UI/vue/actions/workflows/ci.yml/badge.svg)](https://github.com/ArtisanPack-UI/vue/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@artisanpack-ui/vue)](https://www.npmjs.com/package/@artisanpack-ui/vue)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/ArtisanPack-UI/vue/blob/main/LICENSE)

56+ Vue 3 UI components for building modern web applications, styled with [DaisyUI](https://daisyui.com/) and [Tailwind CSS](https://tailwindcss.com/). Part of the [ArtisanPack UI](https://github.com/ArtisanPack-UI/vue) ecosystem.

## Installation

```bash
npm install @artisanpack-ui/vue @artisanpack-ui/tokens
```

### Peer Dependencies

```bash
npm install vue
```

Optional peers for chart components:

```bash
npm install apexcharts vue3-apexcharts
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
import App from './App.vue';

const app = createApp(App);
app.use(createArtisanPackUI());
app.mount('#app');
```

## Usage

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

### Tree-Shakeable Imports

Import from specific categories to minimize bundle size:

```ts
import { Button, Input, Select } from '@artisanpack-ui/vue/form';
import { Card, Modal, Tabs } from '@artisanpack-ui/vue/layout';
import { Menu, Breadcrumbs } from '@artisanpack-ui/vue/navigation';
import { Table, Calendar } from '@artisanpack-ui/vue/data';
import { Avatar, Badge, Progress } from '@artisanpack-ui/vue/display';
import { Alert, Toast, Loading } from '@artisanpack-ui/vue/feedback';
import { Icon, ThemeToggle, Tooltip } from '@artisanpack-ui/vue/utility';
import { useTheme, useBreakpoint } from '@artisanpack-ui/vue/composables';
```

## Component Categories

- **Form** - Button, Input, Select, Checkbox, Toggle, DatePicker, ColorPicker, RichTextEditor, Password, Pin, and more
- **Layout** - Card, Modal, Tabs, Accordion, Drawer, Dropdown, Grid, Stack, Popover, Collapse, Divider
- **Navigation** - Menu, Breadcrumbs, Pagination, Steps, Navbar, Sidebar, SpotlightSearch
- **Display** - Avatar, Badge, Progress, Stat, Timeline, Carousel, Code, Diff, Sparkline
- **Data** - Table, Calendar, Chart
- **Feedback** - Alert, Toast, Loading, Skeleton, EmptyState, Error
- **Utility** - Icon, ThemeToggle, Tooltip, Clipboard, Markdown

## Theming

All components support DaisyUI's 31 built-in themes plus custom themes via the `ThemeToggle` component.

## Vue Compatibility

Requires Vue 3.5+.

## Documentation

- [Getting Started](https://github.com/ArtisanPack-UI/vue/wiki/Getting-Started)
- [Component API Reference](https://github.com/ArtisanPack-UI/vue/wiki/Component-API-Reference)
- [Theming Guide](https://github.com/ArtisanPack-UI/vue/wiki/Theming)
- [Composables Reference](https://github.com/ArtisanPack-UI/vue/wiki/Composables)

## Part of ArtisanPack UI

| Package | Description |
|---------|-------------|
| [`@artisanpack-ui/tokens`](https://www.npmjs.com/package/@artisanpack-ui/tokens) | Design tokens, color resolver, glass helpers |
| [`@artisanpack-ui/vue`](https://www.npmjs.com/package/@artisanpack-ui/vue) | 56+ Vue 3 UI components |
| [`@artisanpack-ui/vue-laravel`](https://www.npmjs.com/package/@artisanpack-ui/vue-laravel) | Inertia.js adapter wrappers |

## License

[MIT](https://github.com/ArtisanPack-UI/vue/blob/main/LICENSE) - Jacob Martella
