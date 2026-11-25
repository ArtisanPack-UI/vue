---
title: InertiaCheckbox
menu_order: 70
meta_description: The Vue InertiaCheckbox component. The Checkbox with its Laravel validation error bound from Inertia, bound with a plain v-model.
---

# InertiaCheckbox

[Checkbox](../form/checkbox.md) with its Laravel validation error filled in. It renders a Checkbox, binds its checked state with a plain `v-model`, and passes it the error for `name` from the surrounding [InertiaForm](inertia-form.md), or from the Inertia page's `errors`. Use it for a yes-or-no choice that's sent with the form, such as accepting the terms.

```ts
import { InertiaCheckbox } from '@artisanpack-ui/vue-laravel';
```

## Usage

```vue
<script setup lang="ts">
import { Button } from '@artisanpack-ui/vue';
import { InertiaCheckbox, InertiaForm } from '@artisanpack-ui/vue-laravel';
</script>

<template>
  <InertiaForm
    v-slot="{ form, processing }"
    :data="{ terms: false, newsletter: true }"
    action="/register"
  >
    <InertiaCheckbox
      v-model="form.terms"
      name="terms"
      label="I accept the terms of service"
      required
    />
    <InertiaCheckbox
      v-model="form.newsletter"
      name="newsletter"
      label="Send me product news"
      description="About one email a month."
    />
    <Button type="submit" :loading="processing">Create account</Button>
  </InertiaForm>
</template>
```

Bind the wrapper with `v-model`, not `v-model:checked`: the wrapper maps its `modelValue` to Checkbox's `checked`. Laravel's `accepted` and `boolean` rules take the `true` or `false` it sends.

The error resolves in the same order as every wrapper: the `error` prop, then the InertiaForm's error for `name`, then the page's `errors[name]`. See [How the field wrappers work](../inertia.md#how-the-field-wrappers-work).

## Props

| Prop         | Type      | Default | Description                                                                                                    |
| ------------ | --------- | ------- | -------------------------------------------------------------------------------------------------------------- |
| `name`       | `string`  | —       | Required. The field's key in the form data and in Laravel's validation errors. Also the native input's `name`. |
| `error`      | `string`  | —       | An explicit error. Wins over the form's and the page's errors. An empty string hides the error.                |
| `modelValue` | `boolean` | —       | Whether it's checked. Bind it with `v-model`. Passed to Checkbox as `checked`.                                 |

### Forwarded props

Every other prop goes to [Checkbox](../form/checkbox.md#props): `indeterminate`, `label`, `description`, `invalid`, `disabled`, `required` and `classes`. The wrapper sets Checkbox's `name`, `error` and `checked` itself.

`class`, `style` and every other attribute and listener also go to the Checkbox, which puts `class` on its root and the rest on the native `<input type="checkbox">`.

## v-model

| Binding   | Type      | Description                                              |
| --------- | --------- | -------------------------------------------------------- |
| `v-model` | `boolean` | The checked state. Maps to Checkbox's `v-model:checked`. |

Without `v-model`, the wrapper keeps the state itself.

## Slots

InertiaCheckbox has no slots.

## Events

| Event                | Payload   | Description                                   |
| -------------------- | --------- | --------------------------------------------- |
| `@update:modelValue` | `boolean` | The checked state changed. Used by `v-model`. |

Checkbox's own `update:checked` is handled by the wrapper. Native listeners such as `@focus` fall through to the input.

## Parts

InertiaCheckbox renders Checkbox's parts unchanged. Pass extra classes with `classes`; see [Checkbox parts](../form/checkbox.md#parts).

## Types

InertiaCheckbox exports no types of its own. Checkbox's types come from `@artisanpack-ui/vue/form`.

## Accessibility

| Keys    | Action                |
| ------- | --------------------- |
| `Space` | Toggles the checkbox. |

- The native checkbox stays in the DOM, so the platform handles the keyboard and screen readers.
- Give it a `label`; clicking the label toggles it too.
- The error from Laravel is linked to the input with `aria-describedby`.
- Use [InertiaToggle](inertia-toggle.md) for settings that apply at once, and a checkbox in forms that need a submit.

## Related

- [Checkbox in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/checkbox): anatomy, tokens and live examples.
- [Checkbox](../form/checkbox.md), the component this wraps.
- [InertiaToggle](inertia-toggle.md) and [InertiaRadioGroup](inertia-radio-group.md).
