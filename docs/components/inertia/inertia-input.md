---
title: InertiaInput
menu_order: 90
meta_description: The Vue InertiaInput component. The Input field with its Laravel validation error bound from Inertia, with every prop and slot it forwards.
---

# InertiaInput

[Input](../form/input.md) with its Laravel validation error filled in. It renders an Input and passes it the error for `name` from the surrounding [InertiaForm](inertia-form.md), or from the Inertia page's `errors`. Use it for single-line text fields in an Inertia form.

```ts
import { InertiaInput } from '@artisanpack-ui/vue-laravel';
```

## Usage

```vue
<script setup lang="ts">
import { Button } from '@artisanpack-ui/vue';
import { InertiaForm, InertiaInput } from '@artisanpack-ui/vue-laravel';
</script>

<template>
  <InertiaForm v-slot="{ form, processing }" :data="{ name: '', email: '' }" action="/users">
    <InertiaInput v-model="form.name" name="name" label="Name" required />
    <InertiaInput
      v-model="form.email"
      name="email"
      label="Email"
      type="email"
      autocomplete="email"
    />
    <Button type="submit" :loading="processing">Create user</Button>
  </InertiaForm>
</template>
```

`name` names the native input and picks the error. Bind `v-model` to the form field yourself.

### Without InertiaForm

Outside an InertiaForm, the wrapper shows `errors[name]` from the page props, which Inertia fills after a failed visit. That covers a form built on Inertia's `useForm()` or [`useInertiaForm`](../../laravel-inertia.md#useinertiaform):

```vue
<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { Button } from '@artisanpack-ui/vue';
import { InertiaInput } from '@artisanpack-ui/vue-laravel';

const form = useForm({ search: '' });
</script>

<template>
  <form @submit.prevent="form.get('/users')">
    <InertiaInput v-model="form.search" name="search" label="Search users" type="search" />
    <Button type="submit">Search</Button>
  </form>
</template>
```

### Setting the error yourself

The `error` prop wins over both sources. Pass an empty string to hide the error:

```vue
<template>
  <InertiaInput
    v-model="form.slug"
    name="slug"
    label="Slug"
    :error="slugTaken ? 'That slug is taken.' : undefined"
  />
</template>
```

### Input features

Every other Input prop and slot works as on Input: sizes, `hint`, `prefix` and `suffix`, icons, `disabled`, `readonly`. See [Input](../form/input.md).

```vue
<template>
  <InertiaInput
    v-model="form.price"
    name="price"
    label="Price"
    type="number"
    prefix="$"
    hint="Before tax."
  />
</template>
```

`v-model` always carries a string, even with `type="number"`, because Input emits the native input's value. Convert it before sending if Laravel expects a number, or rely on Laravel's `numeric` rule.

## Props

| Prop         | Type     | Default | Description                                                                                                    |
| ------------ | -------- | ------- | -------------------------------------------------------------------------------------------------------------- |
| `name`       | `string` | —       | Required. The field's key in the form data and in Laravel's validation errors. Also the native input's `name`. |
| `error`      | `string` | —       | An explicit error. Wins over the form's and the page's errors. An empty string hides the error.                |
| `modelValue` | `string` | —       | The value. Bind it with `v-model`.                                                                             |

### Forwarded props

Every other prop goes to [Input](../form/input.md#props): `size`, `type`, `label`, `hint`, `invalid`, `disabled`, `readonly`, `required`, `placeholder`, `prefix`, `suffix`, `leadingIcon`, `trailingIcon` and `classes`. The wrapper sets Input's `name`, `error` and `modelValue` itself.

`class`, `style` and every other attribute and listener also go to the Input, which puts `class` on its root and the rest, such as `autocomplete` or `@blur`, on the native `<input>`.

## v-model

| Binding   | Type     | Description                                    |
| --------- | -------- | ---------------------------------------------- |
| `v-model` | `string` | The input's value, emitted on every keystroke. |

Without `v-model`, the wrapper keeps the value itself.

## Slots

| Slot      | Description                                   |
| --------- | --------------------------------------------- |
| `icon`    | Passed to Input. Replaces the `leadingIcon`.  |
| `iconEnd` | Passed to Input. Replaces the `trailingIcon`. |
| `prefix`  | Passed to Input. Replaces the `prefix` text.  |
| `suffix`  | Passed to Input. Replaces the `suffix` text.  |

## Events

| Event                | Payload  | Description                           |
| -------------------- | -------- | ------------------------------------- |
| `@update:modelValue` | `string` | The value changed. Used by `v-model`. |

Native listeners such as `@blur`, `@focus` and `@keydown` fall through to the `<input>`.

## Parts

InertiaInput renders Input's parts unchanged. Pass extra classes with `classes`; see [Input parts](../form/input.md#parts).

## Types

InertiaInput exports no types of its own. Input's types, such as `InputProps` and `InputPart`, come from `@artisanpack-ui/vue/form`.

## Accessibility

| Keys  | Action                                            |
| ----- | ------------------------------------------------- |
| `Tab` | Moves focus to the input. Typing edits the value. |

- Give every field a `label`. A placeholder never replaces it.
- The error from Laravel is rendered by Input as text linked to the input with `aria-describedby`, and sets `aria-invalid`.
- `required` sets the native `required` attribute; the visual mark is hidden from screen readers.

## Related

- [Input in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/input): anatomy, tokens and live examples.
- [Input](../form/input.md), the component this wraps.
- [InertiaForm](inertia-form.md), [InertiaPassword](inertia-password.md) and [InertiaTextarea](inertia-textarea.md).
