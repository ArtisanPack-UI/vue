---
title: InertiaPassword
menu_order: 120
meta_description: The Vue InertiaPassword component. The Password field with its Laravel validation error bound from Inertia, with every prop it forwards.
---

# InertiaPassword

[Password](../form/password.md) with its Laravel validation error filled in. It renders a Password field, with its reveal button and optional strength meter, and passes it the error for `name` from the surrounding [InertiaForm](inertia-form.md), or from the Inertia page's `errors`. Use it for sign-in, registration and password reset forms.

```ts
import { InertiaPassword } from '@artisanpack-ui/vue-laravel';
```

## Usage

```vue
<script setup lang="ts">
import { Button } from '@artisanpack-ui/vue';
import { InertiaForm, InertiaInput, InertiaPassword } from '@artisanpack-ui/vue-laravel';
</script>

<template>
  <InertiaForm v-slot="{ form, processing }" :data="{ email: '', password: '' }" action="/login">
    <InertiaInput
      v-model="form.email"
      name="email"
      label="Email"
      type="email"
      autocomplete="username"
    />
    <InertiaPassword v-model="form.password" name="password" label="Password" />
    <Button type="submit" :loading="processing">Sign in</Button>
  </InertiaForm>
</template>
```

### Registration

Use `autocomplete="new-password"` and the strength meter on a new password. Laravel's `confirmed` rule reports its error on `password`, so the confirmation field shows its own errors only:

```vue
<template>
  <InertiaForm
    v-slot="{ form, processing }"
    :data="{ name: '', email: '', password: '', password_confirmation: '' }"
    action="/register"
  >
    <InertiaPassword
      v-model="form.password"
      name="password"
      label="Password"
      autocomplete="new-password"
      strength-meter
    />
    <InertiaPassword
      v-model="form.password_confirmation"
      name="password_confirmation"
      label="Confirm password"
      autocomplete="new-password"
    />
    <Button type="submit" :loading="processing">Create account</Button>
  </InertiaForm>
</template>
```

The error resolves in the same order as every wrapper: the `error` prop, then the InertiaForm's error for `name`, then the page's `errors[name]`. See [How the field wrappers work](../inertia.md#how-the-field-wrappers-work).

## Props

| Prop         | Type     | Default | Description                                                                                                    |
| ------------ | -------- | ------- | -------------------------------------------------------------------------------------------------------------- |
| `name`       | `string` | —       | Required. The field's key in the form data and in Laravel's validation errors. Also the native input's `name`. |
| `error`      | `string` | —       | An explicit error. Wins over the form's and the page's errors. An empty string hides the error.                |
| `modelValue` | `string` | —       | The value. Bind it with `v-model`.                                                                             |

### Forwarded props

Every other prop goes to [Password](../form/password.md#props): `size`, `autocomplete` (default `'current-password'`), `label`, `hint`, `invalid`, `disabled`, `readonly`, `required`, `placeholder`, `leadingIcon`, `strengthMeter`, `requirements`, `revealLabel`, `labels` and `classes`. The wrapper sets Password's `name`, `error` and `modelValue` itself.

`class`, `style` and every other attribute and listener also go to the Password, which puts `class` on its root and the rest on the native `<input>`.

## v-model

| Binding   | Type     | Description           |
| --------- | -------- | --------------------- |
| `v-model` | `string` | The password's value. |

Without `v-model`, the wrapper keeps the value itself.

## Slots

InertiaPassword has no slots. Password's `icon` slot isn't forwarded, so use `leadingIcon` for an icon.

## Events

| Event                | Payload  | Description                           |
| -------------------- | -------- | ------------------------------------- |
| `@update:modelValue` | `string` | The value changed. Used by `v-model`. |

Native listeners such as `@blur` fall through to the `<input>`.

## Parts

InertiaPassword renders Password's parts unchanged. Pass extra classes with `classes`; see [Password parts](../form/password.md#parts).

## Types

InertiaPassword exports no types of its own. Password's types come from `@artisanpack-ui/vue/form`.

## Accessibility

| Keys            | Action                                               |
| --------------- | ---------------------------------------------------- |
| `Tab`           | Moves focus to the input, then to the reveal button. |
| `Enter`/`Space` | On the reveal button, shows or hides the value.      |

- Give the field a visible `label`.
- The error from Laravel is linked to the input with `aria-describedby` and sets `aria-invalid`.
- Set `autocomplete` to `current-password` on sign-in and `new-password` on registration and reset forms, so password managers fill and save it.
- The reveal button keeps one name and toggles `aria-pressed`. Paste is never blocked.

## Related

- [Password in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/password): anatomy, tokens and live examples.
- [Password](../form/password.md), the component this wraps.
- [InertiaForm](inertia-form.md) and [InertiaInput](inertia-input.md).
