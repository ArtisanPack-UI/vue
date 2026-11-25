---
title: InertiaSelect
menu_order: 150
meta_description: The Vue InertiaSelect component. The native Select with its Laravel validation error bound from Inertia, with every prop it forwards.
---

# InertiaSelect

[Select](../form/select.md) with its Laravel validation error filled in. It renders a native Select and passes it the error for `name` from the surrounding [InertiaForm](inertia-form.md), or from the Inertia page's `errors`. Use it to pick one value from a list in an Inertia form.

```ts
import { InertiaSelect } from '@artisanpack-ui/vue-laravel';
```

## Usage

```vue
<script setup lang="ts">
import { Button } from '@artisanpack-ui/vue';
import { InertiaForm, InertiaSelect } from '@artisanpack-ui/vue-laravel';

defineProps<{ roles: { id: number; name: string }[] }>();
</script>

<template>
  <InertiaForm v-slot="{ form, processing }" :data="{ role_id: '' }" action="/invitations">
    <InertiaSelect
      v-model="form.role_id"
      name="role_id"
      label="Role"
      placeholder="Choose a role"
      :options="roles.map((role) => ({ value: role.id, label: role.name }))"
      required
    />
    <Button type="submit" :loading="processing">Invite</Button>
  </InertiaForm>
</template>
```

`v-model` carries the chosen option's value as given, so a numeric `value` comes back as a number.

### Grouped options

Pass `{ label, options }` entries to render `<optgroup>`s, as on [Select](../form/select.md):

```vue
<template>
  <InertiaSelect
    v-model="form.timezone"
    name="timezone"
    label="Time zone"
    :options="[
      { label: 'Americas', options: ['America/New_York', 'America/Chicago'] },
      { label: 'Europe', options: ['Europe/London', 'Europe/Berlin'] },
    ]"
  />
</template>
```

The error resolves in the same order as every wrapper: the `error` prop, then the InertiaForm's error for `name`, then the page's `errors[name]`. See [How the field wrappers work](../inertia.md#how-the-field-wrappers-work).

## Props

| Prop         | Type               | Default | Description                                                                                                     |
| ------------ | ------------------ | ------- | --------------------------------------------------------------------------------------------------------------- |
| `name`       | `string`           | —       | Required. The field's key in the form data and in Laravel's validation errors. Also the native select's `name`. |
| `error`      | `string`           | —       | An explicit error. Wins over the form's and the page's errors. An empty string hides the error.                 |
| `modelValue` | `string \| number` | —       | The chosen value. Bind it with `v-model`.                                                                       |

### Forwarded props

Every other prop goes to [Select](../form/select.md#props): `size`, `options`, `label`, `hint`, `invalid`, `disabled`, `required`, `placeholder`, `leadingIcon` and `classes`. The wrapper sets Select's `name`, `error` and `modelValue` itself.

`class`, `style` and every other attribute and listener also go to the Select, which puts `class` on its root and the rest on the native `<select>`.

## v-model

| Binding   | Type               | Description                          |
| --------- | ------------------ | ------------------------------------ |
| `v-model` | `string \| number` | The chosen option's value, as given. |

Without `v-model`, the wrapper keeps the value itself.

## Slots

| Slot   | Description                                   |
| ------ | --------------------------------------------- |
| `icon` | Passed to Select. Replaces the `leadingIcon`. |

Select's default slot, for extra `<option>` elements, isn't forwarded. Pass every option through `options`.

## Events

| Event                | Payload            | Description                            |
| -------------------- | ------------------ | -------------------------------------- |
| `@update:modelValue` | `string \| number` | The choice changed. Used by `v-model`. |

Native listeners such as `@blur` fall through to the `<select>`.

## Parts

InertiaSelect renders Select's parts unchanged. Pass extra classes with `classes`; see [Select parts](../form/select.md#parts).

## Types

InertiaSelect exports no types of its own. Select's types, such as `SelectOption` and `SelectOptionGroup`, come from `@artisanpack-ui/vue/form`.

## Accessibility

| Keys                              | Action                                     |
| --------------------------------- | ------------------------------------------ |
| `Tab`                             | Moves focus to the select.                 |
| `Space`, `Enter`, `Alt+ArrowDown` | Opens the native list (platform behavior). |
| `ArrowUp`, `ArrowDown`            | Moves through the options.                 |
| `Escape`                          | Closes the list and keeps the value.       |

- Uses the native `<select>`, so the platform supplies the keyboard and screen reader support.
- Give the field a visible `label`, or an `aria-label` without one.
- The error from Laravel is linked to the select with `aria-describedby` and sets `aria-invalid`.

## Related

- [Select in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/select): anatomy, tokens and live examples.
- [Select](../form/select.md), the component this wraps.
- [InertiaRadioGroup](inertia-radio-group.md) for six or fewer options.
