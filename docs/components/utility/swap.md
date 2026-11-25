---
title: Swap
menu_order: 50
meta_description: The Vue Swap component. A two-state toggle that swaps its on and off content, on a native checkbox, with v-model:checked, icons, slots and transitions.
---

# Swap

A two-state toggle that swaps its on and off content, such as a sun and a moon or a menu and a close icon. A native checkbox with an accessible name sits over the content, so the platform handles the keyboard and screen readers. Use it for a compact on/off control whose two states are best shown as two icons. For a labeled setting, use a [Toggle](../form/toggle.md).

```ts
import { Swap } from '@artisanpack-ui/vue/utility';
// or
import { Swap } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Swap } from '@artisanpack-ui/vue/utility';

const dark = ref(false);
</script>

<template>
  <Swap v-model:checked="dark" label="Dark mode" />
</template>
```

`label` is required: it names the checkbox for assistive technology and isn't shown. By default the on state shows a sun and the off state a moon.

### Icons and transitions

`onIcon` and `offIcon` take names from the [icon registry](https://docs.artisanpackui.dev/documentation/design-system/foundations/icons). `transition` is `fade` (the default), `rotate` or `none`. Under reduced motion it always swaps at once.

```vue
<template>
  <Swap label="Menu" transition="rotate" on-icon="x" off-icon="list" size="lg" />
</template>
```

### Custom content

The `on` and `off` slots replace the icons with any content:

```vue
<script setup lang="ts">
import { Icon, Swap } from '@artisanpack-ui/vue/utility';
</script>

<template>
  <Swap label="Starred" transition="none" size="sm">
    <template #on><Icon name="star" color="warning" /></template>
    <template #off><Icon name="star" /></template>
  </Swap>
</template>
```

### Controlled and uncontrolled

Without `v-model:checked`, Swap starts on `checked` and keeps its own state as the user toggles it. A bound `checked` replaces that state whenever it changes. Inside a `<form>`, a form reset puts it back to the `checked` prop.

### Forms

Every attribute other than `class` goes to the checkbox, so `name`, `value`, `id` and `form` work as on a native checkbox:

```vue
<template>
  <form method="post" action="/preferences">
    <Swap label="Dark mode" name="dark_mode" value="1" />
  </form>
</template>
```

## Props

| Prop         | Type                                | Default  | Description                                                                               |
| ------------ | ----------------------------------- | -------- | ----------------------------------------------------------------------------------------- |
| `checked`    | `boolean`                           | `false`  | Whether it's on (`v-model:checked`). Unbound, the initial state.                          |
| `label`      | `string`                            | —        | Required. The checkbox's accessible name, such as "Dark mode". Not shown.                 |
| `onIcon`     | `string`                            | `'sun'`  | The icon shown when on. The `on` slot overrides it.                                       |
| `offIcon`    | `string`                            | `'moon'` | The icon shown when off. The `off` slot overrides it.                                     |
| `transition` | `'fade' \| 'rotate' \| 'none'`      | `'fade'` | How the content swaps. Reduced motion always swaps at once. Emitted as `data-transition`. |
| `size`       | `'sm' \| 'md' \| 'lg'`              | `'md'`   | The target and icon size. Emitted as `data-size`.                                         |
| `disabled`   | `boolean`                           | `false`  | Disables the checkbox. Emitted as `data-disabled`.                                        |
| `classes`    | `Partial<Record<SwapPart, string>>` | —        | Extra classes per [part](#parts).                                                         |

Swap sets `inheritAttrs: false`. `class` goes to the root `<label>`. Every other attribute and listener, including `style`, `id`, `name` and `@focus`, goes to the checkbox.

## v-model

| Binding           | Type      | Description                                        |
| ----------------- | --------- | -------------------------------------------------- |
| `v-model:checked` | `boolean` | Whether it's on. Updated when the user toggles it. |

## Slots

| Slot  | Description                                     |
| ----- | ----------------------------------------------- |
| `on`  | The content shown when on. Replaces `onIcon`.   |
| `off` | The content shown when off. Replaces `offIcon`. |

## Events

| Event             | Payload            | Description          |
| ----------------- | ------------------ | -------------------- |
| `@update:checked` | `checked: boolean` | It turned on or off. |

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part      | Element | Description                                                           |
| --------- | ------- | --------------------------------------------------------------------- |
| `root`    | `label` | The target, `.apui-swap`, with `data-state` `checked` or `unchecked`. |
| `control` | `input` | The native checkbox, over the content.                                |
| `on`      | `span`  | The on content. `aria-hidden`.                                        |
| `off`     | `span`  | The off content. `aria-hidden`.                                       |

## Types

```ts
import type {
  SwapEmits,
  SwapPart,
  SwapProps,
  SwapSize,
  SwapTransition,
} from '@artisanpack-ui/vue/utility';
```

| Type             | Description                               |
| ---------------- | ----------------------------------------- |
| `SwapProps`      | The component's props.                    |
| `SwapEmits`      | The component's events: `update:checked`. |
| `SwapSize`       | `'sm' \| 'md' \| 'lg'`                    |
| `SwapTransition` | `'fade' \| 'rotate' \| 'none'`            |
| `SwapPart`       | `'root' \| 'control' \| 'on' \| 'off'`    |

## Accessibility

| Keys    | Action                      |
| ------- | --------------------------- |
| `Space` | Turns it on or off.         |
| `Tab`   | Moves focus to and from it. |

- A native `<input type="checkbox">` stays in the DOM over the target, so the state is announced as checked or not checked.
- The checkbox is named by `label`, which should name the setting. The swapping content is `aria-hidden`.
- The target is at least 24×24px and shows a focus ring while the checkbox has `:focus-visible`.
- The fade and rotate are removed under `prefers-reduced-motion`.
- Disabled uses the disabled text color, never opacity alone.

## Related

- [Swap in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/swap): anatomy, tokens and live examples.
- [ThemeToggle](theme-toggle.md) to switch the theme, with storage and system preference built in.
- [Toggle](../form/toggle.md) for a labeled on/off setting.
- [Icon](icon.md) for the icons in the slots.
