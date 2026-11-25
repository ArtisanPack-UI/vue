---
title: InertiaTextarea
menu_order: 160
meta_description: The Vue InertiaTextarea component. The Textarea field with its Laravel validation error bound from Inertia, with every prop it forwards.
---

# InertiaTextarea

[Textarea](../form/textarea.md) with its Laravel validation error filled in. It renders a Textarea and passes it the error for `name` from the surrounding [InertiaForm](inertia-form.md), or from the Inertia page's `errors`. Use it for multi-line text in an Inertia form.

```ts
import { InertiaTextarea } from '@artisanpack-ui/vue-laravel';
```

## Usage

```vue
<script setup lang="ts">
import { Button } from '@artisanpack-ui/vue';
import { InertiaForm, InertiaTextarea } from '@artisanpack-ui/vue-laravel';
</script>

<template>
  <InertiaForm v-slot="{ form, processing }" :data="{ bio: '' }" method="patch" action="/profile">
    <InertiaTextarea v-model="form.bio" name="bio" label="Bio" :max-length="280" auto-resize />
    <Button type="submit" :loading="processing">Save</Button>
  </InertiaForm>
</template>
```

`maxLength` shows Textarea's character counter. Match it to Laravel's `max:` rule so the counter and the server agree.

The error resolves in the same order as every wrapper: the `error` prop, then the InertiaForm's error for `name`, then the page's `errors[name]`. See [How the field wrappers work](../inertia.md#how-the-field-wrappers-work).

## Props

| Prop         | Type     | Default | Description                                                                                                       |
| ------------ | -------- | ------- | ----------------------------------------------------------------------------------------------------------------- |
| `name`       | `string` | —       | Required. The field's key in the form data and in Laravel's validation errors. Also the native textarea's `name`. |
| `error`      | `string` | —       | An explicit error. Wins over the form's and the page's errors. An empty string hides the error.                   |
| `modelValue` | `string` | —       | The value. Bind it with `v-model`.                                                                                |

### Forwarded props

Every other prop goes to [Textarea](../form/textarea.md#props): `rows`, `maxLength`, `autoResize`, `label`, `hint`, `invalid`, `disabled`, `readonly`, `required`, `placeholder`, `remainingLabel` and `classes`. The wrapper sets Textarea's `name`, `error` and `modelValue` itself.

`class`, `style` and every other attribute and listener also go to the Textarea, which puts `class` on its root and the rest on the native `<textarea>`.

## v-model

| Binding   | Type     | Description           |
| --------- | -------- | --------------------- |
| `v-model` | `string` | The textarea's value. |

Without `v-model`, the wrapper keeps the value itself.

## Slots

InertiaTextarea has no slots.

## Events

| Event                | Payload  | Description                           |
| -------------------- | -------- | ------------------------------------- |
| `@update:modelValue` | `string` | The value changed. Used by `v-model`. |

Native listeners such as `@blur` fall through to the `<textarea>`.

## Parts

InertiaTextarea renders Textarea's parts unchanged. Pass extra classes with `classes`; see [Textarea parts](../form/textarea.md#parts).

## Types

InertiaTextarea exports no types of its own. Textarea's types come from `@artisanpack-ui/vue/form`.

## Accessibility

| Keys  | Action                                                                  |
| ----- | ----------------------------------------------------------------------- |
| `Tab` | Moves focus to the textarea. Typing edits the value; Enter adds a line. |

- Give the field a visible `label`. A placeholder never replaces it.
- The error from Laravel is linked to the textarea with `aria-describedby` and sets `aria-invalid`.
- The counter is hidden from screen readers; a polite live region announces the characters left near the limit.

## Related

- [Textarea in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/textarea): anatomy, tokens and live examples.
- [Textarea](../form/textarea.md), the component this wraps.
- [InertiaForm](inertia-form.md) and [InertiaInput](inertia-input.md).
