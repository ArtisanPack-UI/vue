---
title: Icon
menu_order: 20
meta_description: The Vue Icon component and icon registry. Registry icons, tiles, sizes, colors, labels and RTL mirroring, plus registerIcons and registerDirectionalIcons.
---

# Icon

Draws one glyph from the icon registry, plain or on a soft-colored tile, at four sizes. An icon is decorative unless you give it a `label`. Directional icons, such as arrows, mirror in right-to-left layouts. The default slot draws your own `<svg>` instead of a registry name.

```ts
import { Icon } from '@artisanpack-ui/vue/utility';
// or
import { Icon } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Icon } from '@artisanpack-ui/vue/utility';
</script>

<template>
  <Icon name="house" />
</template>
```

`name` is a registered icon name. The default set is a subset of [Lucide](https://lucide.dev), so names are Lucide's kebab case, such as `house`, `arrow-right` or `circle-alert`. An unregistered name draws nothing and logs a warning in development.

### Sizes

`size` sets the glyph size: `sm` (14px), `md` (16px, the default), `lg` (20px) or `xl` (24px).

```vue
<template>
  <Icon name="house" size="sm" />
  <Icon name="house" />
  <Icon name="house" size="lg" />
  <Icon name="house" size="xl" />
</template>
```

### Colors and tiles

A plain icon draws in `currentColor`, so it matches the text around it. `color` gives it a semantic text color. `variant="tile"` puts it on a soft-colored square, tinted by `color` (neutral when unset).

```vue
<template>
  <Icon name="circle-alert" color="error" />
  <Icon name="wallet" variant="tile" color="primary" />
  <Icon name="trending-up" variant="tile" color="success" />
  <Icon name="file-text" variant="tile" size="sm" />
</template>
```

### Labeled icons

An icon that carries meaning on its own needs a `label`. With it, the icon is `role="img"` with that `aria-label`. Without one, it's `aria-hidden`. Your own `aria-label` or `aria-labelledby` attribute also names it.

```vue
<template>
  <Icon name="circle-alert" color="error" label="Payment failed" />
</template>
```

### Mirroring

Directional icons (`arrow-left`, `arrow-right`, `chevron-left`, `chevron-right`, plus any you register with `registerDirectionalIcons`) flip in right-to-left layouts. `mirror` overrides that for one icon: `true` flips any icon, `false` never flips.

### Your own SVG

Put an `<svg>` in the default slot to draw it instead of a registry icon. It takes the same sizes, colors and tile. A slotted icon doesn't mirror unless you set `mirror`.

```vue
<template>
  <Icon variant="tile" label="Spreadsheet">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18" />
    </svg>
  </Icon>
</template>
```

## Props

| Prop      | Type                                                                                               | Default   | Description                                                                                                           |
| --------- | -------------------------------------------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------- |
| `name`    | `string`                                                                                           | —         | A registered icon name, in Lucide's kebab case (`house`). The default slot overrides it.                              |
| `variant` | `'plain' \| 'tile'`                                                                                | `'plain'` | The bare glyph, or on a soft-colored square. Emitted as `data-variant`.                                               |
| `size`    | `'sm' \| 'md' \| 'lg' \| 'xl'`                                                                     | `'md'`    | The glyph size: 14, 16, 20 or 24px. Emitted as `data-size`.                                                           |
| `color`   | `'primary' \| 'secondary' \| 'accent' \| 'neutral' \| 'success' \| 'warning' \| 'error' \| 'info'` | —         | A plain icon's text color, or a tile's soft fill. Unset: `currentColor`, and a neutral tile. Emitted as `data-color`. |
| `label`   | `string`                                                                                           | —         | The accessible name. With it the icon is `role="img"`; without it, decorative.                                        |
| `mirror`  | `boolean`                                                                                          | —         | Flips it in right-to-left layouts. Unset, directional registry icons mirror. Emitted as `data-mirror`.                |
| `classes` | `Partial<Record<IconPart, string>>`                                                                | —         | Extra classes per [part](#parts).                                                                                     |

Icon sets `inheritAttrs: false` and binds `class`, `style` and every other attribute on the root `<span>`. The component's own attributes win, except that your `role` and `aria-hidden` are kept on a named icon.

## Slots

| Slot      | Description                                |
| --------- | ------------------------------------------ |
| `default` | Your own `<svg>`, drawn instead of `name`. |

## Events

Icon has no events.

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part   | Element | Description                                                         |
| ------ | ------- | ------------------------------------------------------------------- |
| `root` | `span`  | The icon, `.apui-icon`, plus `.apui-icon-tile` for a tile.          |
| `svg`  | `svg`   | The registry glyph. `aria-hidden`. Not rendered for a slotted icon. |

## The icon registry

Every component that takes an icon name, such as Button's `leadingIcon` or Menu's `icon`, resolves it through one registry shared with the React and Livewire packages. The package root re-exports the functions to extend it from `@artisanpack-ui/behavior/icons`:

```ts
import {
  isSafeIconBody,
  registerDirectionalIcons,
  registerIcons,
  UnsafeIconError,
  type IconSet,
} from '@artisanpack-ui/vue';
```

Register icons once, before the components that use them render, such as in your app's entry file. The registry is one per page, so names registered anywhere are available everywhere.

### registerIcons

Adds icons to the registry, or replaces ones with the same name.

```ts
import { registerIcons } from '@artisanpack-ui/vue';

registerIcons({
  'brand-logo': '<path d="M4 4h16v16H4z"/><circle cx="12" cy="12" r="4"/>',
});
```

| Parameter | Type      | Description                                                                     |
| --------- | --------- | ------------------------------------------------------------------------------- |
| `icons`   | `IconSet` | Icon names mapped to the inner markup of a 24×24 SVG drawn with `currentColor`. |

It returns nothing. Bodies are injected as markup, so register trusted, static shapes only: `path`, `circle`, `rect`, `line`, `polyline`, `polygon`, `ellipse` and `g`. Any other element, event handlers, `href`, inline `style`, character references, and `javascript:`, `vbscript:` or `data:` URLs are rejected. If any body is unsafe, it throws `UnsafeIconError` and registers none of the set.

> **Warning:** Never register icons from user or CMS input.

### registerDirectionalIcons

Marks registered names as directional, so they mirror in right-to-left layouts like the built-in arrows and chevrons.

```ts
import { registerDirectionalIcons, registerIcons } from '@artisanpack-ui/vue';

registerIcons({
  'step-forward': '<path d="M5 4l10 8-10 8z"/><line x1="19" y1="5" x2="19" y2="19"/>',
});
registerDirectionalIcons(['step-forward']);
```

| Parameter | Type                | Description                 |
| --------- | ------------------- | --------------------------- |
| `names`   | `readonly string[]` | The icon names that mirror. |

It returns nothing. Only mark icons that point along the reading direction; icons that show a real-world direction or an object, such as a trend or a clock, never mirror.

### isSafeIconBody

Checks a body against the same rules `registerIcons` applies, without registering it.

```ts
import { isSafeIconBody } from '@artisanpack-ui/vue';

isSafeIconBody('<path d="M4 4h16"/>'); // true
isSafeIconBody('<path onclick="alert(1)"/>'); // false
```

| Parameter | Type      | Description         |
| --------- | --------- | ------------------- |
| `body`    | `unknown` | The candidate body. |

It returns `boolean`, and narrows `body` to `string` when `true`.

### UnsafeIconError

The `Error` subclass `registerIcons` throws for an unsafe body. Its `name` is `'UnsafeIconError'` and its message names the icon.

```ts
import { registerIcons, UnsafeIconError } from '@artisanpack-ui/vue';

const icons = { 'brand-logo': '<path d="M4 4h16v16H4z"/>' };

try {
  registerIcons(icons);
} catch (error) {
  if (error instanceof UnsafeIconError) {
    // …
  }
}
```

## Types

```ts
import type {
  IconColor,
  IconPart,
  IconProps,
  IconSize,
  IconVariant,
} from '@artisanpack-ui/vue/utility';
import type { IconSet } from '@artisanpack-ui/vue';
```

| Type          | Description                                                                                           |
| ------------- | ----------------------------------------------------------------------------------------------------- |
| `IconProps`   | The component's props.                                                                                |
| `IconVariant` | `'plain' \| 'tile'`                                                                                   |
| `IconSize`    | `'sm' \| 'md' \| 'lg' \| 'xl'`                                                                        |
| `IconColor`   | The eight semantic colors.                                                                            |
| `IconPart`    | `'root' \| 'svg'`                                                                                     |
| `IconSet`     | `Record<string, string>`: icon names mapped to inner SVG markup. Exported from the package root only. |

## Accessibility

Icon isn't interactive, so it has no keyboard behavior.

- Decorative icons (no `label`) are `aria-hidden`, so screen readers skip them.
- A labeled icon is `role="img"` with `aria-label`. The `<svg>` inside stays `aria-hidden`.
- Directional icons mirror in right-to-left layouts; others, such as trends, clocks and external links, never do.
- A plain icon draws in `currentColor`, so it meets the contrast of the text around it. Colored icons use the color's text tone (4.5:1).
- A tile's foreground meets 3:1 against its fill in every theme, and the tile gets an edge in high contrast.

## Related

- [Icon in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/icon): anatomy, tokens and live examples.
- [Icons in the design system](https://docs.artisanpackui.dev/documentation/design-system/foundations/icons): the full icon set and the registry.
- [Button](../form/button.md) and [Link](../navigation/link.md), which take icon names.
