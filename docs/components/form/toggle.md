---
title: Toggle
menu_order: 210
meta_description: The Vue Toggle component. A switch for settings that take effect immediately, bound with v-model:checked, with every prop and part.
---

# Toggle

A switch for settings that take effect immediately, such as notifications or dark mode. It renders a native checkbox with `role="switch"` under a drawn track and thumb. In a form that people submit, use [Checkbox](checkbox.md) instead.

```ts
import { Toggle } from '@artisanpack-ui/vue/form';
// or
import { Toggle } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Toggle } from '@artisanpack-ui/vue/form';

const notify = ref(true);
</script>

<template>
  <Toggle v-model:checked="notify" label="Email me about replies" />
</template>
```

Toggle binds `checked`, not `modelValue`, so use `v-model:checked`. Name the setting in the label, not the state: "Email me about replies", not "On".

### Saving right away

A Toggle takes effect when it changes. Listen for `@update:checked` to save the setting.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Toggle } from '@artisanpack-ui/vue/form';

const publicProfile = ref(false);

async function save(checked: boolean): Promise<void> {
  publicProfile.value = checked;
  await fetch('/api/settings', {
    method: 'PATCH',
    body: JSON.stringify({ publicProfile: checked }),
  });
}
</script>

<template>
  <Toggle
    :checked="publicProfile"
    label="Public profile"
    description="Anyone can see your listings and reviews."
    @update:checked="save"
  />
</template>
```

### Colors and sizes

`color` sets the track color when on.

```vue
<template>
  <Toggle v-model:checked="enabled" label="Autopay" color="success" />
  <Toggle v-model:checked="enabled" label="Small" size="sm" />
  <Toggle v-model:checked="enabled" label="Large" size="lg" />
</template>
```

### Description, error and states

```vue
<template>
  <Toggle
    v-model:checked="beta"
    label="Beta features"
    description="Try new tools before they launch."
  />
  <Toggle
    v-model:checked="terms"
    label="Accept the terms"
    error="You need to accept the terms."
    required
  />
  <Toggle v-model:checked="beta" label="Beta features" disabled />
</template>
```

## Props

| Prop          | Type                                                                                               | Default     | Description                                                                                                  |
| ------------- | -------------------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------ |
| `checked`     | `boolean`                                                                                          | `false`     | Whether it's on, bound with `v-model:checked`.                                                               |
| `size`        | `'sm' \| 'md' \| 'lg'`                                                                             | `'md'`      | Track size. Emitted as `data-size`.                                                                          |
| `color`       | `'primary' \| 'secondary' \| 'accent' \| 'neutral' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'primary'` | The track color when on. Emitted as `data-color`.                                                            |
| `label`       | `string`                                                                                           | —           | The visible label, linked to the control. Name the setting, not the state. Without it, pass an `aria-label`. |
| `description` | `string`                                                                                           | —           | Supporting text under the label, linked with `aria-describedby`.                                             |
| `error`       | `string`                                                                                           | —           | Validation message. Marks it invalid and is linked with `aria-describedby`.                                  |
| `invalid`     | `boolean`                                                                                          | `false`     | Marks it invalid without a message.                                                                          |
| `disabled`    | `boolean`                                                                                          | `false`     | Disables the control.                                                                                        |
| `required`    | `boolean`                                                                                          | `false`     | Sets `required` on the control.                                                                              |
| `classes`     | `Partial<Record<TogglePart, string>>`                                                              | —           | Extra classes per [part](#parts), such as `{ label: 'font-medium' }`.                                        |

Toggle sets `inheritAttrs: false`. `class` goes to the root. Every other attribute, including `id`, `name`, `value`, `aria-*` and listeners, goes to the native checkbox. An `id` you pass replaces the generated one, and an `aria-describedby` you pass is added after the description and error ids.

## v-model

| Binding           | Type      | Carries          |
| ----------------- | --------- | ---------------- |
| `v-model:checked` | `boolean` | Whether it's on. |

Without `v-model:checked`, Toggle keeps its own state, starting from `checked`.

## Slots

Toggle has no slots.

## Events

| Event             | Payload   | Description          |
| ----------------- | --------- | -------------------- |
| `@update:checked` | `boolean` | It turned on or off. |

Other listeners, such as `@change` and `@focus`, fall through to the native checkbox.

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part          | Element | Description                                                                                                                                |
| ------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `root`        | `div`   | The field, `.apui-toggle`. Carries `data-size`, `data-color`, `data-state` (`checked` or `unchecked`), `data-invalid` and `data-disabled`. |
| `track`       | `span`  | The drawn track around the control and thumb.                                                                                              |
| `control`     | `input` | The native checkbox with `role="switch"`, laid over the track.                                                                             |
| `thumb`       | `span`  | The drawn thumb. `aria-hidden`.                                                                                                            |
| `label`       | `label` | The visible label.                                                                                                                         |
| `description` | `p`     | The supporting text.                                                                                                                       |
| `error`       | `p`     | The error text with its icon.                                                                                                              |

## Types

```ts
import type {
  ToggleColor,
  ToggleEmits,
  TogglePart,
  ToggleProps,
  ToggleSize,
} from '@artisanpack-ui/vue/form';
```

| Type          | Description                                                                        |
| ------------- | ---------------------------------------------------------------------------------- |
| `ToggleProps` | The component's props.                                                             |
| `ToggleEmits` | The component's events.                                                            |
| `ToggleColor` | The eight semantic colors.                                                         |
| `ToggleSize`  | `'sm' \| 'md' \| 'lg'`                                                             |
| `TogglePart`  | `'root' \| 'track' \| 'control' \| 'thumb' \| 'label' \| 'description' \| 'error'` |

## Accessibility

| Keys    | Action              |
| ------- | ------------------- |
| `Space` | Turns it on or off. |

- A native checkbox with `role="switch"` stays in the DOM over the track, so the platform handles the keyboard and screen readers.
- Give every Toggle a `label`, linked with `for` and `id`. The description and error are linked with `aria-describedby`.
- Off keeps a 3:1 outline, so the control is visible without color. On fills with the color.
- The thumb moves toward the logical end, so it mirrors under right-to-left layouts. Its motion is removed under `prefers-reduced-motion`.
- Disabled uses the sunken surface and disabled text colors, never opacity alone.
- Shows a visible focus ring on the track while the control has `:focus-visible`.

## Related

- [Toggle in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/toggle): anatomy, tokens and live examples.
- [Checkbox](checkbox.md) for choices in a form that people submit.
- [ThemeToggle](../utility/theme-toggle.md) for switching the color theme.
