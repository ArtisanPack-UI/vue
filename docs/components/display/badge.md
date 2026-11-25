---
title: Badge
menu_order: 20
meta_description: The Vue Badge component. A small non-interactive label for a status, category or count, with variants, colors, sizes, dots and icons.
---

# Badge

A small, non-interactive label for a status, category or count. It renders a `<span class="apui-badge">` with the label from its default slot. Use the same color for the same status everywhere in your app.

```ts
import { Badge } from '@artisanpack-ui/vue/display';
// or
import { Badge } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Badge } from '@artisanpack-ui/vue/display';
</script>

<template>
  <Badge color="success">Published</Badge>
</template>
```

### Variants and colors

`variant` sets the visual treatment and `color` the semantic color. The default is a soft, neutral badge.

```vue
<template>
  <Badge>Draft</Badge>
  <Badge variant="solid" color="primary">New</Badge>
  <Badge variant="outline" color="warning">Pending</Badge>
  <Badge variant="ghost" color="info">Beta</Badge>
  <Badge color="error">Failed</Badge>
</template>
```

### Sizes

`sm`, `md` and `lg` are 18, 20 and 24px tall.

```vue
<template>
  <Badge size="sm">Small</Badge>
  <Badge>Medium</Badge>
  <Badge size="lg">Large</Badge>
</template>
```

### Dots and icons

`dot` adds a decorative dot before the label. `leadingIcon` takes a name from the [icon registry](https://docs.artisanpackui.dev/documentation/design-system/foundations/icons). Directional icons such as `arrow-up-right` flip in right-to-left layouts. The `icon` slot replaces `leadingIcon` with your own icon, which isn't mirrored for you.

```vue
<template>
  <Badge dot color="success">Online</Badge>
  <Badge leading-icon="arrow-up-right" color="success">12%</Badge>
  <Badge color="info">
    <template #icon>
      <MyIcon />
    </template>
    Custom icon
  </Badge>
</template>
```

## Props

| Prop          | Type                                                                                               | Default     | Description                                                                                                                    |
| ------------- | -------------------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `variant`     | `'solid' \| 'soft' \| 'outline' \| 'ghost'`                                                        | `'soft'`    | Visual treatment. Emitted as `data-variant`.                                                                                   |
| `color`       | `'primary' \| 'secondary' \| 'accent' \| 'neutral' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'neutral'` | Semantic color. Emitted as `data-color`.                                                                                       |
| `size`        | `'sm' \| 'md' \| 'lg'`                                                                             | `'md'`      | Height: 18, 20 or 24px. Emitted as `data-size`.                                                                                |
| `dot`         | `boolean`                                                                                          | `false`     | Shows a decorative dot before the label.                                                                                       |
| `leadingIcon` | `string`                                                                                           | —           | Icon name before the label, resolved through the icon registry. Directional icons mirror in RTL. The `icon` slot overrides it. |
| `classes`     | `Partial<Record<BadgePart, string>>`                                                               | —           | Extra classes per [part](#parts). Use `class` for the root.                                                                    |

`class`, `style` and every other attribute go to the root `<span>`.

## Slots

| Slot      | Description                           |
| --------- | ------------------------------------- |
| `default` | The label.                            |
| `icon`    | Replaces the icon from `leadingIcon`. |

## Events

Badge has no events. It isn't interactive.

## Parts

Pass extra classes to a part with `classes`. Every part except the root carries a `data-part` attribute you can also target in CSS.

| Part    | Element | Description                                                  |
| ------- | ------- | ------------------------------------------------------------ |
| `root`  | `span`  | The badge, `.apui-badge`.                                    |
| `dot`   | `span`  | The decorative dot. `aria-hidden`. Only rendered with `dot`. |
| `icon`  | `span`  | The leading icon. `aria-hidden`.                             |
| `label` | `span`  | The label from the default slot.                             |

## Types

```ts
import type {
  BadgeColor,
  BadgePart,
  BadgeProps,
  BadgeSize,
  BadgeVariant,
} from '@artisanpack-ui/vue/display';
```

| Type           | Description                                 |
| -------------- | ------------------------------------------- |
| `BadgeProps`   | The component's props.                      |
| `BadgeVariant` | `'solid' \| 'soft' \| 'outline' \| 'ghost'` |
| `BadgeColor`   | The eight semantic colors.                  |
| `BadgeSize`    | `'sm' \| 'md' \| 'lg'`                      |
| `BadgePart`    | `'root' \| 'dot' \| 'icon' \| 'label'`      |

## Accessibility

Badge isn't interactive and has no keyboard behavior.

- A badge is never a button or a link. Use a [Button](../form/button.md) or a filter chip for that.
- The label is always present. The dot and the icon are `aria-hidden`, so don't rely on them alone to carry meaning.
- Soft and solid badges keep a 4.5:1 text contrast on their fill in every theme. Outline and ghost badges keep it on the surface.
- In high contrast, soft badges gain an edge in the tone's border color. In forced colors the badge keeps an edge and the dot uses `CanvasText`.

## Related

- [Badge in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/badge): anatomy, tokens and live examples.
- [Avatar](avatar.md) for presence status.
- [Button](../form/button.md) for anything clickable.
