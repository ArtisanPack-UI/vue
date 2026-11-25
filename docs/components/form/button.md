---
title: Button
menu_order: 10
meta_description: The Vue Button component. Variants, colors, sizes, icons, loading and link buttons, with every prop, slot and part.
---

# Button

Triggers an action. It renders a native `<button>`, or an `<a>` with the same styles when you pass `href`. Use one solid primary Button for the main action of a view.

```ts
import { Button } from '@artisanpack-ui/vue/form';
// or
import { Button } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Button } from '@artisanpack-ui/vue/form';

function save(): void {
  // …
}
</script>

<template>
  <Button @click="save">Save changes</Button>
</template>
```

### Variants and colors

`variant` sets the visual treatment and `color` the semantic color. Any variant works with any color.

```vue
<template>
  <Button>Publish</Button>
  <Button variant="soft">Preview</Button>
  <Button variant="outline" color="neutral">Cancel</Button>
  <Button variant="ghost" color="neutral">Skip</Button>
  <Button variant="link">Learn more</Button>
  <Button color="error">Delete</Button>
</template>
```

### Sizes

```vue
<template>
  <Button size="xs">Extra small</Button>
  <Button size="sm">Small</Button>
  <Button>Medium</Button>
  <Button size="lg">Large</Button>
  <Button size="xl">Extra large</Button>
</template>
```

### Icons

`leadingIcon` and `trailingIcon` take names from the [icon registry](https://docs.artisanpackui.dev/documentation/design-system/foundations/icons). Directional icons such as `arrow-right` flip automatically in right-to-left layouts. An icon-only button needs an `aria-label`.

```vue
<template>
  <Button leading-icon="plus">New listing</Button>
  <Button variant="soft" trailing-icon="arrow-right">Next</Button>
  <Button icon-only leading-icon="trash" color="error" aria-label="Delete listing" />
</template>
```

To render your own icon, use the `icon` or `iconEnd` slot instead. A slotted icon isn't mirrored for you.

### Loading

`loading` shows a spinner, sets `aria-busy="true"` and ignores clicks. The label stays in place, so screen readers still announce it.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@artisanpack-ui/vue/form';

const saving = ref(false);

async function save(): Promise<void> {
  saving.value = true;
  try {
    await fetch('/api/listings', { method: 'POST' });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <Button :loading="saving" @click="save">Save</Button>
</template>
```

### Links

With `href`, Button renders an anchor. `type` is ignored. Unsafe URL schemes such as `javascript:` are dropped. A disabled or loading link renders without `href` and with `aria-disabled="true"`, so it can't be followed.

```vue
<template>
  <Button href="/listings/new" leading-icon="plus">New listing</Button>
  <Button href="/billing" disabled>Billing</Button>
</template>
```

### Submitting a form

Button defaults to `type="button"`, so it never submits a form by accident. Set `type="submit"` for the submit button:

```vue
<template>
  <form @submit.prevent="save">
    <!-- fields -->
    <Button type="submit">Save</Button>
  </form>
</template>
```

## Props

| Prop           | Type                                                                                               | Default     | Description                                                                                       |
| -------------- | -------------------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------- |
| `variant`      | `'solid' \| 'soft' \| 'outline' \| 'ghost' \| 'link'`                                              | `'solid'`   | Visual treatment. Emitted as `data-variant`.                                                      |
| `color`        | `'primary' \| 'secondary' \| 'accent' \| 'neutral' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'primary'` | Semantic color. Emitted as `data-color`.                                                          |
| `size`         | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                                                             | `'md'`      | Control height. Emitted as `data-size`.                                                           |
| `iconOnly`     | `boolean`                                                                                          | `false`     | Renders only the icon and hides the label. Requires an `aria-label`.                              |
| `loading`      | `boolean`                                                                                          | `false`     | Shows the spinner and sets `aria-busy`. Clicks are ignored while loading.                         |
| `disabled`     | `boolean`                                                                                          | `false`     | Disables the button. With `href`, renders an anchor without `href` and with `aria-disabled`.      |
| `href`         | `string`                                                                                           | —           | Renders an anchor with the same styles. Unsafe schemes are dropped.                               |
| `leadingIcon`  | `string`                                                                                           | —           | Icon name before the label, resolved through the icon registry. The `icon` slot overrides it.     |
| `trailingIcon` | `string`                                                                                           | —           | Icon name after the label, resolved through the icon registry. The `iconEnd` slot overrides it.   |
| `type`         | `'button' \| 'submit' \| 'reset'`                                                                  | `'button'`  | The native button type. Ignored when `href` renders an anchor.                                    |
| `classes`      | `Partial<Record<ButtonPart, string>>`                                                              | —           | Extra classes per [part](#parts), such as `{ label: 'tracking-wide' }`. Use `class` for the root. |

`class`, `style` and every other attribute, including `aria-label` and listeners such as `@click`, go to the root `<button>` or `<a>`.

## Slots

| Slot      | Description                                     |
| --------- | ----------------------------------------------- |
| `default` | The label. Not rendered when `iconOnly` is set. |
| `icon`    | Replaces the icon from `leadingIcon`.           |
| `iconEnd` | Replaces the icon from `trailingIcon`.          |

## Events

Button has no events of its own. Listeners such as `@click`, `@focus` and `@keydown` fall through to the root element. While `loading` (or while a link is disabled), the click is swallowed and your `@click` listener doesn't run.

## Parts

Pass extra classes to a part with `classes`, or `class` for the root. The root carries the `.apui-button` class, and every other part carries a `data-part` attribute you can also target in CSS.

| Part      | Element         | Description                                       |
| --------- | --------------- | ------------------------------------------------- |
| `root`    | `button` or `a` | The button itself, `.apui-button`.                |
| `icon`    | `span`          | The leading icon. `aria-hidden`.                  |
| `label`   | `span`          | The label from the default slot.                  |
| `iconEnd` | `span`          | The trailing icon. `aria-hidden`.                 |
| `spinner` | `span`          | The loading spinner. Only rendered while loading. |

## Types

```ts
import type {
  ButtonColor,
  ButtonPart,
  ButtonProps,
  ButtonSize,
  ButtonVariant,
} from '@artisanpack-ui/vue/form';
```

| Type            | Description                                             |
| --------------- | ------------------------------------------------------- |
| `ButtonProps`   | The component's props.                                  |
| `ButtonVariant` | `'solid' \| 'soft' \| 'outline' \| 'ghost' \| 'link'`   |
| `ButtonColor`   | The eight semantic colors.                              |
| `ButtonSize`    | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                  |
| `ButtonPart`    | `'root' \| 'icon' \| 'iconEnd' \| 'label' \| 'spinner'` |

## Accessibility

| Keys    | Action                                     |
| ------- | ------------------------------------------ |
| `Enter` | Activates the button.                      |
| `Space` | Activates the button (native button only). |

- Renders a native `<button>`, or an `<a>` when `href` is set, so it gets keyboard and screen reader support for free.
- Give an icon-only button an `aria-label`.
- `xs` buttons extend their hit area to the 24px minimum target size.
- Loading keeps the label for screen readers and sets `aria-busy`.
- Disabled styling uses the sunken surface and disabled text colors, never opacity alone.
- Shows a visible focus ring on `:focus-visible`.

## Related

- [Button in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/button): anatomy, tokens and live examples.
- [Link](../navigation/link.md) for navigation inside running text.
- [Form](form-component.md) for submit handling and validation.
