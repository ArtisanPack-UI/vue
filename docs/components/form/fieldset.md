---
title: Fieldset
menu_order: 80
meta_description: The Vue Fieldset component. Groups related fields under a legend with a title and description, as a panel, divided section or plain group.
---

# Fieldset

Groups related fields under a legend. It renders a native `<fieldset>` whose `<legend>` holds a title and an optional description, so screen readers announce the group's name with each field inside. Use it to split a long form into sections such as contact details or a billing address.

```ts
import { Fieldset } from '@artisanpack-ui/vue/form';
// or
import { Fieldset } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Fieldset, Input } from '@artisanpack-ui/vue/form';
</script>

<template>
  <Fieldset title="Contact" description="Who buyers and renters should reach.">
    <div data-scope="fieldset" data-part="row">
      <Input label="Full name" name="name" />
      <Input label="Email" type="email" name="email" />
    </div>
    <Input label="Phone" type="tel" name="phone" />
  </Fieldset>
</template>
```

Fields stack with the field gap. To put fields side by side, wrap them in `<div data-scope="fieldset" data-part="row">`, a grid that wraps on narrow screens.

### Variants

`variant` sets the chrome: a bordered `panel` (the default), a `divided` section with an edge under it, or `plain` with none.

```vue
<template>
  <Fieldset variant="divided" title="Billing address">
    <!-- fields -->
  </Fieldset>
  <Fieldset variant="plain" title="Payout account">
    <!-- fields -->
  </Fieldset>
</template>
```

### Disabled

`disabled` sets the native `disabled` attribute, which disables every control inside, including nested components.

```vue
<template>
  <Fieldset title="Payout account" description="Locked while a payout is processing." disabled>
    <Input label="IBAN" model-value="ES91 •••• •••• 1332" />
  </Fieldset>
</template>
```

### Rich title and description

The `title` and `description` slots replace the props when you need markup. Without a title or description, no legend is rendered; give such a group an `aria-label` instead.

```vue
<template>
  <Fieldset>
    <template #title>Notifications <small>(optional)</small></template>
    <template #description>Choose how we reach you.</template>
    <!-- fields -->
  </Fieldset>
</template>
```

## Props

| Prop          | Type                                    | Default   | Description                                                                                 |
| ------------- | --------------------------------------- | --------- | ------------------------------------------------------------------------------------------- |
| `variant`     | `'panel' \| 'divided' \| 'plain'`       | `'panel'` | A bordered panel, a section with an edge under it, or no chrome. Emitted as `data-variant`. |
| `title`       | `string`                                | —         | The group's name, in the legend. The `title` slot overrides it.                             |
| `description` | `string`                                | —         | Supporting text in the legend, under the title. The `description` slot overrides it.        |
| `disabled`    | `boolean`                               | `false`   | Disables every control inside (native `disabled`). Emitted as `data-disabled`.              |
| `classes`     | `Partial<Record<FieldsetPart, string>>` | —         | Extra classes per [part](#parts), such as `{ title: 'text-lg' }`. Use `class` for the root. |

`class`, `style` and every other attribute, including `id`, `name`, `aria-*` and listeners, go to the `<fieldset>`.

## Slots

| Slot          | Description                                       |
| ------------- | ------------------------------------------------- |
| `default`     | The fields.                                       |
| `title`       | Rich title content. Replaces `title`.             |
| `description` | Rich description content. Replaces `description`. |

## Events

Fieldset has no events of its own. Listeners fall through to the `<fieldset>`.

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part          | Element    | Description                                                        |
| ------------- | ---------- | ------------------------------------------------------------------ |
| `root`        | `fieldset` | The group, `.apui-fieldset`.                                       |
| `legend`      | `legend`   | Holds the title and description. Only rendered when either is set. |
| `title`       | `span`     | The group's name.                                                  |
| `description` | `span`     | The supporting text.                                               |

The `row` part (`<div data-scope="fieldset" data-part="row">`) is markup you write yourself, so it has no `classes` key.

## Types

```ts
import type { FieldsetPart, FieldsetProps, FieldsetVariant } from '@artisanpack-ui/vue/form';
```

| Type              | Description                                      |
| ----------------- | ------------------------------------------------ |
| `FieldsetProps`   | The component's props.                           |
| `FieldsetVariant` | `'panel' \| 'divided' \| 'plain'`                |
| `FieldsetPart`    | `'root' \| 'legend' \| 'title' \| 'description'` |

## Accessibility

Fieldset has no keyboard interaction of its own; focus moves through the fields inside.

- A native `<fieldset>` and `<legend>`, so the group's name is announced with each field inside. The description is part of the legend, so it's announced with the name.
- Disabled uses the native `disabled` attribute, which disables every control inside.
- Don't nest fieldsets more than one level.
- For a group of checkboxes or radios, use [CheckboxGroup](checkbox-group.md) or [RadioGroup](radio-group.md), which render their own fieldset.

## Related

- [Fieldset in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/fieldset): anatomy, tokens and live examples.
- [Form](form-component.md) for the form around the fieldsets.
- [CheckboxGroup](checkbox-group.md) and [RadioGroup](radio-group.md) for grouped choices.
