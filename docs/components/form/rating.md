---
title: Rating
menu_order: 160
meta_description: The Vue Rating component. Show a star score with half stars and a review count, or collect one with native radios.
---

# Rating

Shows a star score, or collects one. Read-only, it renders one image with a text alternative, such as "4.2 out of 5", and fills half stars. As an input, it renders native radios that share one name, so arrow keys change the score. Use it for reviews and feedback.

```ts
import { Rating } from '@artisanpack-ui/vue/form';
// or
import { Rating } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Rating } from '@artisanpack-ui/vue/form';

const score = ref<number | null>(null);
</script>

<template>
  <Rating v-model="score" label="Rate the viewing" />
</template>
```

### Showing a score

`readonly` shows the score instead of collecting it. The stars round to the nearest half, and the value text rounds to one decimal. `count` adds the number of reviews.

```vue
<template>
  <Rating readonly :model-value="4.2" :count="17" />
</template>
```

This renders the stars, "4.2" and "(17 reviews)". The count uses the singular "(1 review)" for one.

### Number of stars

`max` sets the number of stars. It defaults to `5`.

```vue
<template>
  <Rating v-model="score" label="Rate the difficulty" :max="10" />
</template>
```

### Translating the labels

`valueLabel` is the read-only text alternative and each radio's name. It takes `:value` and `:max` placeholders and defaults to the translated ":value out of :max". `countLabel` is the count text with a `:count` placeholder. Without it, Rating uses the translated "(:count review)" or "(:count reviews)" by count. A `countLabel` you pass is used for every count, so it doesn't change for one.

```vue
<template>
  <Rating
    readonly
    :model-value="4.5"
    :count="12"
    value-label=":value sur :max"
    count-label="(:count avis)"
  />
</template>
```

### Sizes and disabled

```vue
<template>
  <Rating v-model="score" label="Rating" size="sm" />
  <Rating v-model="score" label="Rating" size="lg" />
  <Rating v-model="score" label="Rating" disabled />
</template>
```

## Props

| Prop         | Type                                  | Default                                                | Description                                                                                                                |
| ------------ | ------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `modelValue` | `number \| null`                      | —                                                      | The score, bound with `v-model`. Read-only, the stars round to the nearest half.                                           |
| `max`        | `number`                              | `5`                                                    | The number of stars.                                                                                                       |
| `readonly`   | `boolean`                             | `false`                                                | Shows the score instead of collecting it.                                                                                  |
| `disabled`   | `boolean`                             | `false`                                                | Disables the radios and sets `aria-disabled` on the group.                                                                 |
| `size`       | `'sm' \| 'md' \| 'lg'`                | `'md'`                                                 | Star size. Emitted as `data-size`.                                                                                         |
| `count`      | `number`                              | —                                                      | The number of reviews, shown after the value.                                                                              |
| `label`      | `string`                              | —                                                      | The input's accessible name, such as "Rate the viewing". Set as `aria-label` on the radio group. Not used when `readonly`. |
| `valueLabel` | `string`                              | `':value out of :max'`, translated                     | The read-only text alternative and each radio's name, with `:value` and `:max` placeholders.                               |
| `countLabel` | `string`                              | `'(:count review)'` / `'(:count reviews)'`, translated | The count text, with a `:count` placeholder.                                                                               |
| `classes`    | `Partial<Record<RatingPart, string>>` | —                                                      | Extra classes per [part](#parts), such as `{ star: 'text-warning' }`.                                                      |

Rating sets `inheritAttrs: false`. `class` and every other attribute go to the root, except `name`, which names every radio. Without a `name`, the radios share the root's id, which is the `id` you pass or a generated one. Each radio's id is the root id plus its star number, such as `rating-3`.

## v-model

| Binding   | Type     | Carries                             |
| --------- | -------- | ----------------------------------- |
| `v-model` | `number` | The chosen star, from `1` to `max`. |

Without `v-model`, Rating keeps track of the chosen star itself.

## Slots

Rating has no slots.

## Events

| Event                | Payload  | Description        |
| -------------------- | -------- | ------------------ |
| `@update:modelValue` | `number` | A star was chosen. |

Other listeners fall through to the root.

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part      | Element | Description                                                                                                                                                         |
| --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `root`    | `div`   | The rating, `.apui-rating`. `role="img"` when read-only, else `role="radiogroup"`. Carries `data-size`, `data-disabled`, and `data-readonly` or `data-interactive`. |
| `item`    | `label` | One star as an input, wrapping its radio. Not rendered when read-only.                                                                                              |
| `control` | `input` | A native radio. Not rendered when read-only.                                                                                                                        |
| `star`    | `span`  | A drawn star. `aria-hidden`. Read-only, it carries `data-filled` or `data-half`.                                                                                    |
| `half`    | `span`  | The half-star overlay inside a star.                                                                                                                                |
| `value`   | `span`  | The numeric score. `aria-hidden`. Rendered when there's a score.                                                                                                    |
| `count`   | `span`  | The review count. `aria-hidden` when read-only, since the image already carries the score.                                                                          |

## Types

```ts
import type { RatingPart, RatingProps, RatingSize } from '@artisanpack-ui/vue/form';
```

| Type          | Description                                                               |
| ------------- | ------------------------------------------------------------------------- |
| `RatingProps` | The component's props.                                                    |
| `RatingSize`  | `'sm' \| 'md' \| 'lg'`                                                    |
| `RatingPart`  | `'root' \| 'item' \| 'control' \| 'star' \| 'half' \| 'value' \| 'count'` |

## Accessibility

| Keys                     | Action                                                 |
| ------------------------ | ------------------------------------------------------ |
| `Tab`                    | Moves focus to the checked star, or the first.         |
| `ArrowRight`, `ArrowUp`  | Raises the score by one, following the text direction. |
| `ArrowLeft`, `ArrowDown` | Lowers the score by one, following the text direction. |
| `Space`                  | Chooses the focused star.                              |

- Read-only, the root is `role="img"` with the value label, such as "4.2 out of 5". The stars are decorative.
- As an input, the root is `role="radiogroup"` named by `label`, and each radio is named by the value label, such as "3 out of 5". Always pass `label` for an input.
- The stars run in the inline direction and mirror under right-to-left layouts. The half star fills from the start side.
- The filled stars follow the native `:checked` state.
- The numeric value shows next to the stars, so color is never the only cue.
- Shows a visible focus ring on the star whose radio has `:focus-visible`.

## Related

- [Rating in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/rating): anatomy, tokens and live examples.
- [RadioGroup](radio-group.md) for choosing one option by name.
- [Range](range.md) for picking a value on a scale.
