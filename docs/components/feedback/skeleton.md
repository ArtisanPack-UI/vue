---
title: Skeleton
menu_order: 50
meta_description: The Vue Skeleton component. Placeholder blocks, text lines and circles that match the layout while content loads.
---

# Skeleton

A placeholder shape that matches the layout while content loads. It renders an empty `<span>` hidden from assistive technology. Compose several to sketch a card, a row or a profile. For waits where the layout isn't known, use [Loading](loading.md).

```ts
import { Skeleton } from '@artisanpack-ui/vue/feedback';
// or
import { Skeleton } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Skeleton } from '@artisanpack-ui/vue/feedback';
</script>

<template>
  <Skeleton width="100%" :height="160" />
</template>
```

### Shapes

`shape` picks a rounded block, a 10px text line or a circle.

```vue
<template>
  <Skeleton shape="block" :width="240" :height="120" />
  <Skeleton shape="text" width="60%" />
  <Skeleton shape="circle" :width="40" :height="40" />
</template>
```

### Sizing

`width` and `height` take a CSS length, or a number of pixels. A number becomes `px`; a string is used as is. A text line keeps its own height unless you set `height`.

```vue
<template>
  <Skeleton :width="320" :height="24" />
  <Skeleton width="12rem" shape="text" />
</template>
```

> **Note:** Without a binding, `width="240"` passes the string `'240'`, which isn't a valid CSS length. Use `:width="240"` or `width="240px"`.

### A loading card

Set `aria-busy` on the container while it loads, and swap the skeletons for the content when it arrives.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Skeleton } from '@artisanpack-ui/vue/feedback';
import { Card } from '@artisanpack-ui/vue/layout';

const loading = ref(true);
</script>

<template>
  <Card :aria-busy="loading">
    <template v-if="loading">
      <Skeleton shape="circle" :width="40" :height="40" />
      <Skeleton shape="text" width="70%" />
      <Skeleton shape="text" width="40%" />
    </template>
    <template v-else>
      <!-- the content -->
    </template>
  </Card>
</template>
```

## Props

| Prop     | Type                            | Default   | Description                                                                                                      |
| -------- | ------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------- |
| `shape`  | `'block' \| 'text' \| 'circle'` | `'block'` | A rounded block, a 10px text line or a circle. Emitted as `data-shape`.                                          |
| `width`  | `string \| number`              | —         | A CSS length, or a number of px. Set as an inline `width`.                                                       |
| `height` | `string \| number`              | —         | A CSS length, or a number of px. Set as an inline `height`. A text line keeps its own height unless this is set. |

The component sets `inheritAttrs: false` and binds `class`, `style` and every other attribute to the root `<span>`. A `style` you pass merges with the inline width and height.

## Slots

Skeleton has no slots.

## Events

Skeleton has no events of its own. Listeners fall through to the root element.

## Parts

Skeleton has a single part, `root`: the `<span class="apui-skeleton" data-part="root">`. It takes no `classes` prop; use `class`.

## Types

```ts
import type { SkeletonProps } from '@artisanpack-ui/vue/feedback';
```

| Type            | Description            |
| --------------- | ---------------------- |
| `SkeletonProps` | The component's props. |

## Accessibility

Skeleton isn't focusable and has no keyboard behavior.

- Every skeleton is `aria-hidden`. The container that is loading sets `aria-busy="true"` and drops it when the content arrives.
- The shimmer moves in the reading direction and stops under reduced motion.
- Don't show skeletons for more than a few seconds; switch to a status message such as [Loading](loading.md) or an [ErrorState](error-state.md).

## Related

- [Skeleton in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/skeleton): anatomy, tokens and live examples.
- [Loading](loading.md) for a spinner with a status label.
- [Card](../layout/card.md) for the container skeletons usually fill.
