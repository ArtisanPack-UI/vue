---
title: InertiaRadio
menu_order: 130
meta_description: The deprecated Vue InertiaRadio component. Wraps the deprecated Radio; use InertiaRadioGroup instead.
---

# InertiaRadio

> **Warning:** InertiaRadio is deprecated and will be removed in a later major release. Use [InertiaRadioGroup](inertia-radio-group.md).

InertiaRadio wraps the deprecated [Radio](../deprecated.md), a 2.x alias that renders a [RadioGroup](../form/radio-group.md). Like the other field wrappers, it takes a required `name`, an optional `error`, and binds a `string` value with `v-model`. It shows the error for `name` from the surrounding [InertiaForm](inertia-form.md), or from the page's `errors`.

```ts
import { InertiaRadio } from '@artisanpack-ui/vue-laravel';
```

## Migrating to InertiaRadioGroup

Radio takes 2.x options keyed by `optionValue`, `optionLabel` and `optionHint` (default `id`, `name` and `hint`). Map them to RadioGroup's `{ value, label, description }` and switch the component:

```vue
<!-- Before -->
<template>
  <InertiaRadio
    v-model="form.plan"
    name="plan"
    label="Plan"
    :options="[{ id: 'starter', name: 'Starter', hint: 'One site.' }]"
    inline
  />
</template>
```

```vue
<!-- After -->
<template>
  <InertiaRadioGroup
    v-model="form.plan"
    name="plan"
    label="Plan"
    :options="[{ value: 'starter', label: 'Starter', description: 'One site.' }]"
    orientation="horizontal"
  />
</template>
```

| InertiaRadio (Radio prop)                  | InertiaRadioGroup (RadioGroup prop)            |
| ------------------------------------------ | ---------------------------------------------- |
| `optionValue`, `optionLabel`, `optionHint` | Option objects `{ value, label, description }` |
| `inline`                                   | `orientation="horizontal"`                     |
| `card`                                     | `variant="cards"`                              |
| `cardClass`                                | `:classes="{ item: '…' }"`                     |
| `color`                                    | None. Radios use the primary color.            |

InertiaRadioGroup's `v-model` also takes numbers, where InertiaRadio's is typed `string`.

## Props

| Prop         | Type     | Default | Description                                                                    |
| ------------ | -------- | ------- | ------------------------------------------------------------------------------ |
| `name`       | `string` | —       | Required. The field's key in the form data and in Laravel's validation errors. |
| `error`      | `string` | —       | An explicit error. Wins over the form's and the page's errors.                 |
| `modelValue` | `string` | —       | The chosen value. Bind it with `v-model`.                                      |

Every other prop and attribute goes to the deprecated Radio. See [Deprecated components](../deprecated.md).

## Related

- [InertiaRadioGroup](inertia-radio-group.md), the replacement.
- [RadioGroup in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/radio-group).
