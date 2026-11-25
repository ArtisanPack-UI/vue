---
title: InertiaRadioGroup
menu_order: 140
meta_description: The Vue InertiaRadioGroup component. The RadioGroup with its Laravel validation error bound from Inertia, with every prop it forwards.
---

# InertiaRadioGroup

[RadioGroup](../form/radio-group.md) with its Laravel validation error filled in. It renders a fieldset of native radios that share `name`, and passes it the error for `name` from the surrounding [InertiaForm](inertia-form.md), or from the Inertia page's `errors`. Use it to pick one of a few options in an Inertia form. It replaces the deprecated [InertiaRadio](inertia-radio.md).

```ts
import { InertiaRadioGroup } from '@artisanpack-ui/vue-laravel';
```

## Usage

```vue
<script setup lang="ts">
import { Button } from '@artisanpack-ui/vue';
import { InertiaForm, InertiaRadioGroup } from '@artisanpack-ui/vue-laravel';
</script>

<template>
  <InertiaForm v-slot="{ form, processing }" :data="{ plan: 'starter' }" action="/subscription">
    <InertiaRadioGroup
      v-model="form.plan"
      name="plan"
      label="Plan"
      :options="[
        { value: 'starter', label: 'Starter', description: 'One site.' },
        { value: 'pro', label: 'Pro', description: 'Up to ten sites.' },
        { value: 'agency', label: 'Agency', description: 'Unlimited sites.' },
      ]"
      variant="cards"
    />
    <Button type="submit" :loading="processing">Change plan</Button>
  </InertiaForm>
</template>
```

`name` names every radio, so the arrow keys move between them. `v-model` carries the chosen option's value as given, so a numeric `value` comes back as a number.

### Horizontal

```vue
<template>
  <InertiaRadioGroup
    v-model="form.billing"
    name="billing"
    label="Billing"
    orientation="horizontal"
    :options="['monthly', 'yearly']"
  />
</template>
```

The error resolves in the same order as every wrapper: the `error` prop, then the InertiaForm's error for `name`, then the page's `errors[name]`. See [How the field wrappers work](../inertia.md#how-the-field-wrappers-work).

## Props

| Prop         | Type               | Default | Description                                                                                       |
| ------------ | ------------------ | ------- | ------------------------------------------------------------------------------------------------- |
| `name`       | `string`           | —       | Required. The field's key in the form data and in Laravel's validation errors. Names every radio. |
| `error`      | `string`           | —       | An explicit error. Wins over the form's and the page's errors. An empty string hides the error.   |
| `modelValue` | `string \| number` | —       | The chosen value. Bind it with `v-model`.                                                         |

### Forwarded props

Every other prop goes to [RadioGroup](../form/radio-group.md#props): `options`, `label`, `hint`, `invalid`, `disabled`, `required`, `orientation`, `variant` and `classes`. The wrapper sets RadioGroup's `name`, `error` and `modelValue` itself.

`class`, `style` and every other attribute and listener also go to the RadioGroup's `<fieldset>`.

## v-model

| Binding   | Type               | Description                          |
| --------- | ------------------ | ------------------------------------ |
| `v-model` | `string \| number` | The chosen option's value, as given. |

Without `v-model`, the wrapper keeps the value itself.

## Slots

InertiaRadioGroup has no slots.

## Events

| Event                | Payload            | Description                            |
| -------------------- | ------------------ | -------------------------------------- |
| `@update:modelValue` | `string \| number` | The choice changed. Used by `v-model`. |

## Parts

InertiaRadioGroup renders RadioGroup's parts unchanged. Pass extra classes with `classes`; see [RadioGroup parts](../form/radio-group.md#parts).

## Types

InertiaRadioGroup exports no types of its own. RadioGroup's types come from `@artisanpack-ui/vue/form`.

## Accessibility

| Keys                      | Action                                                         |
| ------------------------- | -------------------------------------------------------------- |
| `Tab`                     | Moves focus into the group, to the checked radio or the first. |
| `ArrowDown`, `ArrowRight` | Moves to the next option and checks it.                        |
| `ArrowUp`, `ArrowLeft`    | Moves to the previous option and checks it.                    |
| `Space`                   | Checks the focused option.                                     |

- Native radios sharing `name`, in a `<fieldset>` with a `<legend>` from `label`, so the platform supplies the radio group role and arrow keys. Arrow keys follow the text direction.
- The error from Laravel is linked to the fieldset with `aria-describedby` and sets `aria-invalid` on each radio.
- Use [InertiaSelect](inertia-select.md) for more than about six options.

## Related

- [RadioGroup in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/radio-group): anatomy, tokens and live examples.
- [RadioGroup](../form/radio-group.md), the component this wraps.
- [InertiaSelect](inertia-select.md) and [InertiaCheckbox](inertia-checkbox.md).
