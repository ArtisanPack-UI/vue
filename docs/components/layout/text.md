---
title: Text
menu_order: 160
meta_description: The Vue Text component. Body text with a size, tone and weight, truncated to one line or clamped to a number of lines.
---

# Text

Body text with a size, tone and weight from the type scale. It can be cut to one line or clamped to a number of lines. It renders a `<p>` by default, or a `<span>` or `<div>`.

```ts
import { Text } from '@artisanpack-ui/vue/layout';
// or
import { Text } from '@artisanpack-ui/vue';
```

> **Note:** `Text` shares its name with Vue's own `Text` vnode symbol. If you also import that from `vue`, rename one of them, for example `import { Text as ApText } from '@artisanpack-ui/vue/layout'`.

## Usage

```vue
<script setup lang="ts">
import { Text } from '@artisanpack-ui/vue/layout';
</script>

<template>
  <Text size="lead">Twenty-four bright apartments around a garden courtyard.</Text>
  <Text>Most units face south with private balconies.</Text>
</template>
```

### Size, tone and weight

`size` is `xs`, `sm`, `md` (the default), `lg` or `lead`. `lead` is muted unless you set a tone. `tone` is `default`, `muted`, `success`, `warning` or `error`. `weight` is `regular`, `medium` or `semibold`. Use `as="span"` inside running text or flex rows.

```vue
<template>
  <Text as="span" tone="muted">Muted</Text>
  <Text as="span" tone="success">+10.9% vs last month</Text>
  <Text as="span" tone="error">Payment failed</Text>
  <Text as="span" weight="semibold">Semibold</Text>
</template>
```

### Truncate and clamp

`truncate` cuts the text to one line with an ellipsis. `clamp` cuts it after a number of lines. When the content is plain text, it's copied to the `title` attribute so the full value stays available; a `title` you pass wins. For rich content, pass your own `title` or wrap the text in a [Tooltip](../utility/tooltip.md).

```vue
<template>
  <Text truncate style="max-width: 260px">
    ARK Genomic Revolution ETF — transaction declined by the issuing bank
  </Text>
  <Text :clamp="3">
    Twenty-four bright apartments around a shared garden courtyard, five minutes from the tram. Most
    units face south with private balconies. The building was renovated in 2024 with new windows,
    heat pumps and a rooftop terrace.
  </Text>
</template>
```

## Props

| Prop       | Type                                                        | Default     | Description                                                                                                                            |
| ---------- | ----------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `as`       | `'p' \| 'span' \| 'div'`                                    | `'p'`       | The element. Other values fall back to `p`.                                                                                            |
| `size`     | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'lead'`                    | `'md'`      | The size. `lead` is muted unless a tone is set. Emitted as `data-size`.                                                                |
| `tone`     | `'default' \| 'muted' \| 'success' \| 'warning' \| 'error'` | `'default'` | The color. Status tones are never the only signal. Emitted as `data-tone`.                                                             |
| `weight`   | `'regular' \| 'medium' \| 'semibold'`                       | `'regular'` | The weight. Emitted as `data-weight`.                                                                                                  |
| `truncate` | `boolean`                                                   | `false`     | Cuts to one line. Plain-text content is copied to `title`. Emitted as `data-truncate`.                                                 |
| `clamp`    | `number`                                                    | —           | Cuts after this many lines (1 or more). Plain-text content is copied to `title`. Emitted as `data-clamp` and sets `--apui-text-clamp`. |
| `classes`  | `Partial<Record<'root', string>>`                           | —           | Extra classes for the root: `{ root: '…' }`.                                                                                           |

`class`, `style` and every other attribute go to the root element.

## Slots

| Slot      | Description |
| --------- | ----------- |
| `default` | The text.   |

## Events

Text has no events.

## Types

```ts
import type {
  TextElement,
  TextProps,
  TextSize,
  TextTone,
  TextWeight,
} from '@artisanpack-ui/vue/layout';
```

| Type          | Description                                                 |
| ------------- | ----------------------------------------------------------- |
| `TextProps`   | The component's props.                                      |
| `TextElement` | `'p' \| 'span' \| 'div'`                                    |
| `TextSize`    | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'lead'`                    |
| `TextTone`    | `'default' \| 'muted' \| 'success' \| 'warning' \| 'error'` |
| `TextWeight`  | `'regular' \| 'medium' \| 'semibold'`                       |

## Accessibility

Text isn't focusable and has no keyboard interaction.

- It keeps 4.5:1 contrast in every tone and theme.
- Status tones (`success`, `warning`, `error`) are never the only signal: the words carry the meaning.
- Truncated and clamped text keeps its full value in the `title` attribute when it's plain text. Otherwise, give it a `title` or a tooltip.
- Paragraphs keep to the `--apui-measure` line length.

## Related

- [Text in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/text): anatomy, tokens and live examples.
- [Heading](heading.md) for titles.
- [Markdown](../utility/markdown.md) for rendered rich text.
