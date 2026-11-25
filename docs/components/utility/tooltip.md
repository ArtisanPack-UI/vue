---
title: Tooltip
menu_order: 70
meta_description: The Vue Tooltip component. A short label on hover and keyboard focus, with placement, delay, shortcuts and v-model:open, with every prop, slot and part.
---

# Tooltip

Shows a short label on hover and keyboard focus. The default slot's element is the trigger: while the label shows, it describes the trigger with `aria-describedby`. The label is hoverable, and Escape hides it. Use it to add a hint, such as an icon button's shortcut. For interactive content, use a [Popover](../layout/popover.md).

```ts
import { Tooltip } from '@artisanpack-ui/vue/utility';
// or
import { Tooltip } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Button } from '@artisanpack-ui/vue/form';
import { Tooltip } from '@artisanpack-ui/vue/utility';
</script>

<template>
  <Tooltip content="Edit" shortcut="E">
    <Button variant="outline" color="neutral" icon-only leading-icon="pencil" aria-label="Edit" />
  </Tooltip>
</template>
```

The trigger keeps its own `aria-label`: a tooltip describes a control, it never names it.

### The trigger

Put one element, or one component that renders an element, in the default slot. It gets the trigger's attributes and keeps its own `id`. Plain text is wrapped in a focusable `<span>`, so keyboard users can reach it too.

```vue
<template>
  <p>Rent is shown <Tooltip content="Before utilities and fees">per month</Tooltip>.</p>
</template>
```

### Placement and size

`placement` puts the label on the trigger's `top` (the default), `bottom`, `start` or `end` side, centered. `start` and `end` follow the reading direction, and the label flips to stay in the viewport. `size="lg"` fits a sentence or two at body size.

```vue
<template>
  <Tooltip
    size="lg"
    placement="end"
    content="Conversion is completed deals divided by unique visits in the period."
  >
    <Button
      variant="ghost"
      color="neutral"
      icon-only
      leading-icon="info"
      aria-label="About conversion"
    />
  </Tooltip>
</template>
```

### Delay

The label shows after the pointer rests on the trigger for `delay` milliseconds (default `400`). Keyboard focus shows it at once.

### Shortcuts

`shortcut` shows keys after the label, as keys joined with `+`, such as `'⌘+K'`. A lone `+` is a key. Keys are shown as given.

### Rich content

The `content` slot replaces the `content` prop for formatted text. Keep it to text: no links or buttons.

```vue
<template>
  <Tooltip>
    <Button size="sm">Publish</Button>
    <template #content>Publishes to <strong>3 channels</strong></template>
  </Tooltip>
</template>
```

### Controlled

Pass `open` to control the label: `true` shows it and `false` hides it, whatever the pointer and focus do. Bind `v-model:open` to follow the label's own changes too. Leave `open` out to let hover and focus show it.

```vue
<template>
  <Tooltip content="New: bulk edit" :open="true" placement="bottom">
    <Button size="sm">Edit</Button>
  </Tooltip>
</template>
```

## Props

| Prop        | Type                                    | Default | Description                                                                                                                  |
| ----------- | --------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `content`   | `string`                                | —       | The label. It describes the trigger (`aria-describedby`). The `content` slot overrides it.                                   |
| `placement` | `'top' \| 'bottom' \| 'start' \| 'end'` | `'top'` | The trigger's side the label sits on, centered. `start` and `end` follow the reading direction. Emitted as `data-placement`. |
| `delay`     | `number`                                | `400`   | Milliseconds the pointer rests on the trigger before the label shows. Focus shows it at once.                                |
| `size`      | `'md' \| 'lg'`                          | `'md'`  | `lg` for a sentence or two, at body size. Emitted as `data-size`.                                                            |
| `shortcut`  | `string`                                | —       | A keyboard shortcut shown after the label, as keys joined with `+` (`⌘+K`).                                                  |
| `open`      | `boolean`                               | —       | Controls the label (`v-model:open`). `true` shows it and `false` hides it. Leave it out to let hover and focus show it.      |
| `disabled`  | `boolean`                               | `false` | Never shows the label. Emitted as `data-disabled`.                                                                           |
| `portal`    | `boolean`                               | `true`  | Teleports the label to the end of `<body>`. Off renders it in place.                                                         |
| `classes`   | `Partial<Record<TooltipPart, string>>`  | —       | Extra classes per [part](#parts), such as `{ kbd: 'font-mono' }`.                                                            |

Tooltip sets `inheritAttrs: false`. `class`, `style` and every other attribute go to the label (`.apui-tooltip`), not the trigger. Put attributes for the trigger on the element in the default slot.

## v-model

| Binding        | Type      | Description                                                                           |
| -------------- | --------- | ------------------------------------------------------------------------------------- |
| `v-model:open` | `boolean` | Whether the label shows. Updated when hover, focus, blur or Escape shows or hides it. |

## Slots

| Slot      | Description                                                        |
| --------- | ------------------------------------------------------------------ |
| `default` | The trigger: one element, or text wrapped in a focusable `<span>`. |
| `content` | The label's content. Replaces `content`.                           |

## Events

| Event          | Payload         | Description                                                  |
| -------------- | --------------- | ------------------------------------------------------------ |
| `@update:open` | `open: boolean` | The label showed or hid itself (hover, focus, blur, Escape). |

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part         | Element      | Description                                                                  |
| ------------ | ------------ | ---------------------------------------------------------------------------- |
| `root`       | `div`        | The label, `.apui-tooltip`, `role="tooltip"`. The same element as `content`. |
| `content`    | `div`        | The label. Carries `class` and attributes.                                   |
| `trigger`    | Your element | The default slot's element, or the wrapping `<span>`.                        |
| `positioner` | `div`        | Positions the label.                                                         |
| `arrow`      | `span`       | The arrow pointing at the trigger. `aria-hidden`.                            |
| `kbd`        | `kbd`        | One shortcut key.                                                            |

## Deprecated types

`TooltipPosition` (`'top' | 'bottom' | 'left' | 'right'`) is the 2.x placement type. Use `TooltipPlacement`: `left` and `right` are `start` and `end`.

## Types

```ts
import type {
  TooltipPart,
  TooltipPlacement,
  TooltipPosition,
  TooltipProps,
  TooltipSize,
} from '@artisanpack-ui/vue/utility';
```

| Type               | Description                                                            |
| ------------------ | ---------------------------------------------------------------------- |
| `TooltipProps`     | The component's props.                                                 |
| `TooltipPlacement` | `'top' \| 'bottom' \| 'start' \| 'end'`                                |
| `TooltipSize`      | `'md' \| 'lg'`                                                         |
| `TooltipPart`      | `'root' \| 'content' \| 'trigger' \| 'positioner' \| 'arrow' \| 'kbd'` |
| `TooltipPosition`  | Deprecated. `'top' \| 'bottom' \| 'left' \| 'right'`.                  |

## Accessibility

| Keys     | Action                                        |
| -------- | --------------------------------------------- |
| `Tab`    | Focusing the trigger shows the label at once. |
| `Escape` | Hides the label. Focus stays on the trigger.  |

- Shown on hover and keyboard focus, dismissible with Escape without moving focus or the pointer, and hoverable, so the pointer can move onto it (WCAG 1.4.13).
- The label is `role="tooltip"` and is linked to the trigger with `aria-describedby` while it shows.
- Never the only name of an icon button: the button keeps its own `aria-label`.
- No links, buttons or other interactive content in the label. Use a [Popover](../layout/popover.md).
- Text keeps 4.5:1 on the inverse surface in every theme, and the label has a visible edge in forced colors.
- `start` and `end` follow the reading direction, and the label flips to stay in the viewport.

## Related

- [Tooltip in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/tooltip): anatomy, tokens and live examples.
- [Popover](../layout/popover.md) for interactive content in an overlay.
- [Kbd](kbd.md) for shortcuts in running text.
