# @artisanpack-ui/vue-laravel

[![CI](https://github.com/ArtisanPack-UI/vue/actions/workflows/ci.yml/badge.svg)](https://github.com/ArtisanPack-UI/vue/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@artisanpack-ui/vue-laravel)](https://www.npmjs.com/package/@artisanpack-ui/vue-laravel)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/ArtisanPack-UI/vue/blob/main/LICENSE)

[Inertia.js](https://inertiajs.com/) wrappers for [`@artisanpack-ui/vue`](https://www.npmjs.com/package/@artisanpack-ui/vue) in [Laravel](https://laravel.com/) apps: form fields that show Laravel's validation errors, pagination from a Laravel paginator, menus and breadcrumbs that navigate with Inertia links, flash messages as toasts or alerts, and the signed-in user.

## Install

```bash
npm install @artisanpack-ui/vue-laravel @artisanpack-ui/css
```

It depends on `@artisanpack-ui/vue`, and needs `vue` 3.5+ and `@inertiajs/vue3` 2.0+ as peer dependencies. Load `@artisanpack-ui/css` once in your app's entry.

## Use

```vue
<script setup lang="ts">
import { Button } from '@artisanpack-ui/vue';
import {
  FlashToasts,
  InertiaForm,
  InertiaInput,
  InertiaPassword,
} from '@artisanpack-ui/vue-laravel';
</script>

<template>
  <FlashToasts />
  <InertiaForm v-slot="{ form, processing }" :data="{ email: '', password: '' }" action="/login">
    <InertiaInput v-model="form.email" name="email" label="Email" type="email" />
    <InertiaPassword v-model="form.password" name="password" label="Password" />
    <Button type="submit" color="primary" :loading="processing">Sign in</Button>
  </InertiaForm>
</template>
```

Import components where you use them, or register them all with `app.use(createArtisanPackUILaravel())` (prefixed `Ap`; its `flashColorMap` option sets the flash toast colors app-wide).

## Documentation

- [Laravel and Inertia](https://docs.artisanpackui.dev/documentation/vue/laravel-inertia)
- [Getting Started](https://docs.artisanpackui.dev/documentation/vue/getting-started)

## License

[MIT](https://github.com/ArtisanPack-UI/vue/blob/main/LICENSE)
