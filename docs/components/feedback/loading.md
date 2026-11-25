---
title: Loading
menu_order: 40
meta_description: The Vue Loading component. A spinner or dots status region with a label, a show delay and an overlay mode, with every prop, slot and part.
---

# Loading

Shows that work is in progress. It renders a `<span role="status">` with a spinner or three pulsing dots and a label. The label is visible when you pass text in the default slot, and visually hidden otherwise. Use it for waits you can't measure; for measurable progress, use [Progress](../display/progress.md).

```ts
import { Loading } from '@artisanpack-ui/vue/feedback';
// or
import { Loading } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Loading } from '@artisanpack-ui/vue/feedback';
</script>

<template>
  <Loading />
</template>
```

Without slot content, screen readers hear "Loading". Name what's loading with `label`, or show visible text with the default slot:

```vue
<template>
  <Loading label="Loading listings" />
  <Loading>Loading listings…</Loading>
</template>
```

### Variants, sizes and colors

```vue
<template>
  <Loading />
  <Loading variant="dots" />
  <Loading size="xs" />
  <Loading size="xl" color="neutral" />
</template>
```

### Delay

Loading waits `delay` milliseconds (300 by default) before it shows, so fast loads don't flash a spinner. The delay is applied in CSS through the `--apui-_delay` custom property. Set it to `0` to show at once.

```vue
<template>
  <Loading :delay="0">Saving…</Loading>
</template>
```

### Overlay

`overlay` covers the nearest positioned ancestor. Set `aria-busy` on the region it covers.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Loading } from '@artisanpack-ui/vue/feedback';

const refreshing = ref(true);
</script>

<template>
  <section style="position: relative" :aria-busy="refreshing">
    <!-- the table that's refreshing -->
    <Loading v-if="refreshing" overlay label="Refreshing listings" />
  </section>
</template>
```

## Props

| Prop      | Type                                                                                               | Default                  | Description                                                                                   |
| --------- | -------------------------------------------------------------------------------------------------- | ------------------------ | --------------------------------------------------------------------------------------------- |
| `variant` | `'spinner' \| 'dots'`                                                                              | `'spinner'`              | A spinning ring or three pulsing dots. Emitted as `data-variant`.                             |
| `size`    | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                                                             | `'md'`                   | The indicator's size. Emitted as `data-size`.                                                 |
| `color`   | `'primary' \| 'secondary' \| 'accent' \| 'neutral' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'primary'`              | Tints the indicator. Emitted as `data-color`.                                                 |
| `label`   | `string`                                                                                           | `'Loading'` (translated) | What's loading, for screen readers, when the default slot is empty. Rendered visually hidden. |
| `overlay` | `boolean`                                                                                          | `false`                  | Covers the nearest positioned ancestor. Emitted as `data-overlay`.                            |
| `delay`   | `number`                                                                                           | `300`                    | Milliseconds to wait before showing, so fast loads don't flash.                               |
| `classes` | `Partial<Record<LoadingPart, string>>`                                                             | —                        | Extra classes per [part](#parts), such as `{ label: 'text-sm' }`. Use `class` for the root.   |

The component sets `inheritAttrs: false` and binds `class`, `style` and every other attribute to the root `<span>`.

## Slots

| Slot      | Description                                          |
| --------- | ---------------------------------------------------- |
| `default` | Visible text beside the indicator. Replaces `label`. |

## Events

Loading has no events of its own. Listeners fall through to the root element.

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part        | Element | Description                                                                 |
| ----------- | ------- | --------------------------------------------------------------------------- |
| `root`      | `span`  | The status region, `.apui-loading`, `role="status"`.                        |
| `indicator` | `span`  | The spinner, or the three dots. `aria-hidden`.                              |
| `label`     | `span`  | The text. Visually hidden (`.apui-sr-only`) when the default slot is empty. |

## Types

```ts
import type { LoadingPart, LoadingProps, LoadingVariant } from '@artisanpack-ui/vue/feedback';
```

| Type             | Description                        |
| ---------------- | ---------------------------------- |
| `LoadingProps`   | The component's props.             |
| `LoadingVariant` | `'spinner' \| 'dots'`              |
| `LoadingPart`    | `'root' \| 'indicator' \| 'label'` |

## Accessibility

Loading isn't focusable and has no keyboard behavior.

- It is `role="status"` with a text label, visible or visually hidden. The indicator is `aria-hidden`.
- An overlay leaves `aria-busy="true"` to the region it covers; set it yourself.
- The spinner slows and the dots stop under reduced motion.
- The indicator keeps a 3:1 contrast ratio against its surface in forced colors.

## Related

- [Loading in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/loading): anatomy, tokens and live examples.
- [Skeleton](skeleton.md) for placeholders that match the layout.
- [Progress](../display/progress.md) for measurable progress.
- [Button](../form/button.md), which has its own `loading` state.
