# @artisanpack-ui/vue

[![CI](https://github.com/ArtisanPack-UI/vue/actions/workflows/ci.yml/badge.svg)](https://github.com/ArtisanPack-UI/vue/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@artisanpack-ui/vue)](https://www.npmjs.com/package/@artisanpack-ui/vue)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/ArtisanPack-UI/vue/blob/main/LICENSE)

Vue 3 components for the [ArtisanPack UI design system](https://docs.artisanpackui.dev/documentation/design-system/home): forms, layout, navigation, data display, feedback and utilities, styled by `@artisanpack-ui/css` and driven by the shared behavior engine, with the same API as the React and Livewire packages.

## Install

```bash
npm install @artisanpack-ui/vue @artisanpack-ui/css
```

Vue 3.5 or later is a peer dependency. Load the CSS once, in your app's entry:

```ts
import '@artisanpack-ui/css';
```

With Tailwind v4, import it from your Tailwind stylesheet instead; see [Getting Started](https://docs.artisanpackui.dev/documentation/vue/getting-started).

## Use

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Button, Dialog, Input } from '@artisanpack-ui/vue';

const open = ref(false);
const email = ref('');
</script>

<template>
  <Button color="primary" @click="open = true">Invite</Button>
  <Dialog v-model:open="open" title="Invite member">
    <Input v-model="email" label="Email" type="email" name="email" />
  </Dialog>
</template>
```

Every component is a named export of the package and of one category subpath (`/form`, `/layout`, `/navigation`, `/display`, `/data`, `/feedback`, `/utility`), plus `/composables` and `/ai`. The package is side-effect free, so unused components tree-shake. Built-in text is set through `*Label` (or `labels`) props with English defaults, so you can translate it.

## Documentation

- [Getting Started](https://docs.artisanpackui.dev/documentation/vue/getting-started)
- [Components](https://docs.artisanpackui.dev/documentation/vue/components)
- [Theming](https://docs.artisanpackui.dev/documentation/vue/theming)
- [Composables](https://docs.artisanpackui.dev/documentation/vue/composables)
- [TypeScript](https://docs.artisanpackui.dev/documentation/vue/typescript)
- [AI Components](https://docs.artisanpackui.dev/documentation/vue/ai-components)
- [Upgrading from 1.x](https://docs.artisanpackui.dev/documentation/vue/upgrading): 1.x components such as `Modal`, `Dropdown` and `ToastProvider` still work as deprecated aliases of their replacements.

## License

[MIT](https://github.com/ArtisanPack-UI/vue/blob/main/LICENSE)
