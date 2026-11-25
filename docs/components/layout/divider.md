---
title: Divider
menu_order: 60
meta_description: The Vue Divider component. Horizontal, vertical and labelled rules that separate content, with every prop, slot and part.
---

# Divider

Separates content with a muted rule. A plain horizontal divider renders an `<hr>`; a vertical or labelled one renders a `<div role="separator">`, named by its label. Use it between groups of content that aren't already separated by spacing or containers.

```ts
import { Divider } from '@artisanpack-ui/vue/layout';
// or
import { Divider } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Divider } from '@artisanpack-ui/vue/layout';
</script>

<template>
  <p>Account details</p>
  <Divider />
  <p>Billing</p>
</template>
```

### Labels

`label` puts text in the middle of the rule, and `align` moves it to the `start` or `end`. You can pass the label as the default slot instead; when both are set, the `label` prop wins.

```vue
<template>
  <Divider label="or continue with" />
  <Divider label="Older activity" align="start" />
  <Divider>Today</Divider>
</template>
```

### Vertical

A vertical divider separates inline items. Give its container a height or use it inside a flex row.

```vue
<template>
  <div style="display: flex; gap: 8px">
    <span>Edit</span>
    <Divider orientation="vertical" />
    <span>Duplicate</span>
  </div>
</template>
```

### Strength

`subtle` (the default) uses the muted border color. `strong` uses the default border color and is the only strength that meets 3:1 contrast against the surface.

```vue
<template>
  <Divider strength="strong" />
</template>
```

### Decorative

Set `decorative` when the divider adds nothing for screen reader users. A plain or vertical divider gets `aria-hidden="true"`; a labelled one gets `role="none"` so its label is read as plain text.

```vue
<template>
  <Divider decorative />
</template>
```

## Props

| Prop          | Type                                   | Default        | Description                                                                                  |
| ------------- | -------------------------------------- | -------------- | -------------------------------------------------------------------------------------------- |
| `orientation` | `'horizontal' \| 'vertical'`           | `'horizontal'` | The rule's direction. Emitted as `data-orientation` and, on a separator, `aria-orientation`. |
| `label`       | `string`                               | —              | Text in the middle of the rule. Wins over the default slot.                                  |
| `align`       | `'start' \| 'center' \| 'end'`         | `'center'`     | Where the label sits along the rule. Emitted as `data-align`.                                |
| `strength`    | `'subtle' \| 'strong'`                 | `'subtle'`     | `subtle` uses the muted border, `strong` the default border. Emitted as `data-strength`.     |
| `decorative`  | `boolean`                              | `false`        | Hides the divider from assistive technology. Emitted as `data-decorative`.                   |
| `classes`     | `Partial<Record<DividerPart, string>>` | —              | Extra classes per [part](#parts). `classes.root` merges with `class`.                        |

`class`, `style` and other attributes go to the root `<hr>` or `<div>`.

## Slots

| Slot      | Description                             |
| --------- | --------------------------------------- |
| `default` | The label, used when `label` isn't set. |

## Events

Divider has no events.

## Parts

Pass extra classes to a part with `classes`.

| Part    | Element       | Description                                                                             |
| ------- | ------------- | --------------------------------------------------------------------------------------- |
| `root`  | `hr` or `div` | The divider, `.apui-divider`. An `<hr>` when plain and horizontal, otherwise a `<div>`. |
| `label` | `span`        | The label. Carries `data-part="label"`. Only rendered with a label.                     |

## Types

```ts
import type {
  DividerAlign,
  DividerOrientation,
  DividerPart,
  DividerProps,
  DividerStrength,
} from '@artisanpack-ui/vue/layout';
```

| Type                 | Description                    |
| -------------------- | ------------------------------ |
| `DividerProps`       | The component's props.         |
| `DividerOrientation` | `'horizontal' \| 'vertical'`   |
| `DividerAlign`       | `'start' \| 'center' \| 'end'` |
| `DividerStrength`    | `'subtle' \| 'strong'`         |
| `DividerPart`        | `'root' \| 'label'`            |

## Accessibility

Divider isn't focusable and has no keyboard interaction.

- It has the `separator` role: an `<hr>`'s own role, or `role="separator"` with `aria-orientation` on a vertical or labelled divider.
- A labelled divider is named by its label through `aria-labelledby`, since a separator's children are presentational.
- A decorative divider is hidden from assistive technology.
- Only `strength="strong"` meets 3:1 against its surface; subtle rules are decorative contrast, like edges.

## Related

- [Divider in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/divider): anatomy, tokens and live examples.
- [Stack](stack.md) for spacing between items without a rule.
- [DropdownMenu](dropdown-menu.md) has its own `DropdownMenuSeparator`.
