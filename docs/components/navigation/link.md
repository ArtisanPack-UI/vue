---
title: Link
menu_order: 20
meta_description: The Vue Link component. Inline and standalone links, muted tone, external links and icons, with every prop, slot and part.
---

# Link

Navigates somewhere. It renders an `<a>`, or a `<button type="button">` with the same styles when there's no `href`. Use it for links in running text and for standalone links such as "View all". For the main action of a view, use a [Button](../form/button.md).

```ts
import { Link } from '@artisanpack-ui/vue/navigation';
// or
import { Link } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Link } from '@artisanpack-ui/vue/navigation';
</script>

<template>
  <p>
    Read the <Link href="/terms">listing terms</Link> or the
    <Link href="/privacy" tone="muted">privacy policy</Link>.
  </p>
</template>
```

### Standalone links

`standalone` is for a link on its own line: medium weight, underlined only on hover. Inline links stay underlined, so color isn't the only cue.

```vue
<template>
  <Link href="/properties" standalone trailing-icon="arrow-right">View all properties</Link>
</template>
```

### External links

`external` opens the link in a new tab with `rel="noopener noreferrer"`, adds the `external-link` icon and appends visually hidden text, "(opens in a new tab)". Change that text with `externalLabel`. A `trailingIcon` replaces the external-link icon.

```vue
<template>
  <Link href="https://docs.artisanpackui.dev" standalone external>Documentation</Link>
</template>
```

### Icons

`leadingIcon` and `trailingIcon` take names from the [icon registry](https://docs.artisanpackui.dev/documentation/design-system/foundations/icons). Directional icons such as `arrow-right` flip in right-to-left layouts. To render your own icon, use the `icon` or `iconEnd` slot; a slotted icon isn't mirrored for you.

```vue
<template>
  <Link href="/report.pdf" standalone leading-icon="download">Download PDF</Link>
</template>
```

### Links without a destination

Without `href`, or when `href` has an unsafe scheme such as `javascript:`, Link renders a `<button type="button">`. Use it for an action that should look like a link:

```vue
<script setup lang="ts">
import { Link } from '@artisanpack-ui/vue/navigation';

function logOut(): void {
  // …
}
</script>

<template>
  <Link @click="logOut">Log out</Link>
</template>
```

## Props

| Prop            | Type                                | Default                              | Description                                                                                                                                |
| --------------- | ----------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `href`          | `string`                            | —                                    | The destination. Only relative, `http`, `https`, `mailto`, `tel` and `sms` URLs are used. Without one, a `<button type="button">` renders. |
| `tone`          | `'primary' \| 'muted'`              | `'primary'`                          | `primary` for running text and calls to action, `muted` for secondary links. Emitted as `data-tone`.                                       |
| `standalone`    | `boolean`                           | `false`                              | A link on its own line: medium weight, underlined only on hover. Emitted as `data-standalone`.                                             |
| `external`      | `boolean`                           | `false`                              | Opens in a new tab, adds the external-link icon and announces it. Only applies when there's an `href`.                                     |
| `externalLabel` | `string`                            | `'(opens in a new tab)'`, translated | The visually hidden text an external link announces.                                                                                       |
| `leadingIcon`   | `string`                            | —                                    | Icon name before the text. The `icon` slot overrides it.                                                                                   |
| `trailingIcon`  | `string`                            | —                                    | Icon name after the text. It replaces the external-link icon. The `iconEnd` slot overrides it.                                             |
| `classes`       | `Partial<Record<LinkPart, string>>` | —                                    | Extra classes per [part](#parts), such as `{ icon: 'text-muted' }`. Use `class` for the root.                                              |

`class`, `style` and every other attribute, including `aria-label` and listeners such as `@click`, go to the root `<a>` or `<button>`.

## Slots

| Slot      | Description                                                      |
| --------- | ---------------------------------------------------------------- |
| `default` | The link text.                                                   |
| `icon`    | Replaces the icon from `leadingIcon`.                            |
| `iconEnd` | Replaces the icon from `trailingIcon` or the external-link icon. |

## Events

Link has no events of its own. Listeners such as `@click` fall through to the root element.

## Parts

Pass extra classes to a part with `classes`. The icon parts carry a `data-part` attribute you can also target in CSS.

| Part      | Element         | Description                                        |
| --------- | --------------- | -------------------------------------------------- |
| `root`    | `a` or `button` | The link itself, `.apui-link`.                     |
| `icon`    | `span`          | The leading icon. `aria-hidden`.                   |
| `iconEnd` | `span`          | The trailing or external-link icon. `aria-hidden`. |

## Types

```ts
import type { LinkPart, LinkProps, LinkTone } from '@artisanpack-ui/vue/navigation';
```

| Type        | Description                     |
| ----------- | ------------------------------- |
| `LinkProps` | The component's props.          |
| `LinkTone`  | `'primary' \| 'muted'`          |
| `LinkPart`  | `'root' \| 'icon' \| 'iconEnd'` |

## Accessibility

| Keys    | Action                                          |
| ------- | ----------------------------------------------- |
| `Enter` | Follows the link, or activates the button form. |
| `Space` | Activates the button form.                      |

- Uses a native anchor, or a native button when there's no `href`.
- Inline links are underlined, so color isn't the only cue. Standalone links are set apart by position and weight.
- External links say they open a new tab, in visually hidden text (`externalLabel`).
- Write link text that says where it goes, never "click here".
- Icons are decorative (`aria-hidden`). Give an icon-only link an `aria-label`.
- Shows a visible focus ring on `:focus-visible`.

## Related

- [Link in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/link): anatomy, tokens and live examples.
- [Button](../form/button.md) for actions, including link-styled buttons with `variant="link"`.
- [Breadcrumbs](breadcrumbs.md) and [Menu](menu.md) for navigation lists.
