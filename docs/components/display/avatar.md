---
title: Avatar
menu_order: 10
meta_description: The Vue Avatar and AvatarGroup components. Images, initials, icons, hashed colors and presence status, with every prop, slot and part.
---

# Avatar

Shows a person or organization as an image, initials or an icon. It renders a `<span class="apui-avatar">` with `role="img"`, named after the person, with the image layered over the initials so a broken image still shows them. `AvatarGroup` lays several avatars out as an overlapping row with a +N avatar for the rest.

```ts
import { Avatar, AvatarGroup } from '@artisanpack-ui/vue/display';
// or
import { Avatar, AvatarGroup } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Avatar } from '@artisanpack-ui/vue/display';
</script>

<template>
  <Avatar name="Olivia Rhye" />
</template>
```

`name` gives the avatar its initials (the first letters of the first and last words, uppercased), its accessible name and its color.

### Images

`src` takes a relative, `http`, `https` or `data:image/` URL. Any other scheme, such as `javascript:`, is dropped and the initials show instead. The image is decorative: the accessible name still comes from `alt` or `name`.

```vue
<template>
  <Avatar name="Olivia Rhye" src="/avatars/olivia.jpg" />
</template>
```

### Initials, icons and colors

Without `color`, the initials' tone is hashed from `name`, so the same person gets the same color in every stack (Livewire, React and Vue). An avatar with no name is `neutral`. `initials` overrides the letters, and `icon` shows an icon from the [icon registry](https://docs.artisanpackui.dev/documentation/design-system/foundations/icons) instead. Without a name, initials or icon, the `user` icon shows.

```vue
<template>
  <Avatar name="Phoenix Baker" />
  <Avatar name="Apexify" shape="square" color="neutral" />
  <Avatar initials="AP" color="accent" alt="ArtisanPack" />
  <Avatar icon="building" alt="Head office" />
  <Avatar />
</template>
```

### Sizes and shapes

```vue
<template>
  <Avatar name="Olivia Rhye" size="xs" />
  <Avatar name="Olivia Rhye" size="sm" />
  <Avatar name="Olivia Rhye" />
  <Avatar name="Olivia Rhye" size="lg" />
  <Avatar name="Olivia Rhye" size="xl" shape="square" />
</template>
```

### Status

`status` adds a presence dot and appends the status in words to the accessible name, such as "Olivia Rhye (Online)". The built-in words are translated. Use `statusLabel` to change them.

```vue
<template>
  <Avatar name="Olivia Rhye" status="online" />
  <Avatar name="Phoenix Baker" status="away" />
  <Avatar name="Lana Steiner" status="offline" status-label="Out of office" />
</template>
```

### Groups

`AvatarGroup` renders the first `max` entries of `avatars`, a neutral +N avatar for the rest, then its default slot. Give the group a `label`.

```vue
<script setup lang="ts">
import { AvatarGroup, type AvatarGroupItem } from '@artisanpack-ui/vue/display';

const members: AvatarGroupItem[] = [
  { name: 'Olivia Rhye', src: '/avatars/olivia.jpg' },
  { name: 'Phoenix Baker', status: 'online' },
  { name: 'Lana Steiner' },
  { name: 'Demi Wilkinson' },
  { name: 'Candice Wu' },
  { name: 'Drew Cano' },
];
</script>

<template>
  <AvatarGroup :avatars="members" :max="4" size="sm" label="Project members" />
</template>
```

### Helper functions

`avatarInitials()` and `avatarColor()` are the functions Avatar uses internally. Use them to match an avatar elsewhere, for example to tint a card with a user's color.

```ts
import { avatarColor, avatarInitials } from '@artisanpack-ui/vue/display';

avatarInitials('Olivia Rhye'); // 'OR'
avatarInitials('Cher'); // 'C'
avatarColor('Olivia Rhye'); // one of the seven hash colors
avatarColor(''); // 'neutral'
```

| Function         | Signature                                    | Returns                                                                                                                                                                        |
| ---------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `avatarInitials` | `(name: string \| undefined) => string`      | Up to two letters: the first letters of the first and last words, uppercased. Multibyte letters stay whole. An empty string without a name.                                    |
| `avatarColor`    | `(name: string \| undefined) => AvatarColor` | The sum of the trimmed name's code points, modulo the seven hash colors (`primary`, `secondary`, `accent`, `success`, `warning`, `error`, `info`). `'neutral'` without a name. |

## Props

| Prop          | Type                                                                                               | Default                                         | Description                                                                                                     |
| ------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `name`        | `string`                                                                                           | —                                               | The full name. Gives the initials, the accessible name and the hashed color.                                    |
| `src`         | `string`                                                                                           | —                                               | The image URL (relative, `http`, `https` or `data:image/`). It covers the initials. Unsafe schemes are dropped. |
| `alt`         | `string`                                                                                           | —                                               | The accessible name, when it should differ from `name`.                                                         |
| `initials`    | `string`                                                                                           | —                                               | Overrides the initials taken from `name`, such as `+4`.                                                         |
| `icon`        | `string`                                                                                           | —                                               | Icon name shown instead of the initials. Without a name or initials, `user` shows.                              |
| `size`        | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                                                             | `'md'`                                          | Size. Emitted as `data-size`.                                                                                   |
| `shape`       | `'circle' \| 'square'`                                                                             | `'circle'`                                      | Shape. Emitted as `data-shape`.                                                                                 |
| `color`       | `'primary' \| 'secondary' \| 'accent' \| 'neutral' \| 'success' \| 'warning' \| 'error' \| 'info'` | hashed from `name`                              | The initials' tone. Emitted as `data-color`.                                                                    |
| `status`      | `'online' \| 'away' \| 'offline'`                                                                  | —                                               | Shows a presence dot and adds the status in words to the accessible name.                                       |
| `statusLabel` | `string`                                                                                           | `'Online'`, `'Away'` or `'Offline'`, translated | The status in words.                                                                                            |
| `classes`     | `Partial<Record<AvatarPart, string>>`                                                              | —                                               | Extra classes per [part](#parts).                                                                               |

`class`, `style` and every other attribute go to the root `<span>`.

## Slots

Avatar has no slots.

## Events

Avatar has no events of its own. Listeners fall through to the root `<span>`.

## Parts

Pass extra classes to a part with `classes`. Every part except the root carries a `data-part` attribute you can also target in CSS.

| Part       | Element | Description                                                   |
| ---------- | ------- | ------------------------------------------------------------- |
| `root`     | `span`  | The avatar, `.apui-avatar`. `role="img"` when it has a name.  |
| `initials` | `span`  | The initials. `aria-hidden`. Not rendered when an icon shows. |
| `image`    | `img`   | The image, with an empty `alt`. `aria-hidden`.                |
| `status`   | `span`  | The presence dot, with `data-status`. `aria-hidden`.          |

## AvatarGroup

A `<span class="apui-avatar-group" role="group">` of overlapping avatars, each ringed in the surface color.

### Props

| Prop        | Type                                   | Default                      | Description                                                                                                                                       |
| ----------- | -------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `avatars`   | `AvatarGroupItem[]`                    | `[]`                         | Avatars as data, rendered before the default slot. Each item takes `name`, `src`, `alt`, `initials`, `icon`, `color`, `status` and `statusLabel`. |
| `max`       | `number`                               | —                            | How many of `avatars` show before a +N avatar. Unset shows them all.                                                                              |
| `size`      | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'`                       | The data avatars' size, including the +N avatar.                                                                                                  |
| `label`     | `string`                               | —                            | The group's accessible name, such as "Project members".                                                                                           |
| `moreLabel` | `string`                               | `'{count} more'`, translated | The +N avatar's accessible name. `{count}` is replaced with the number hidden.                                                                    |

`class`, `style` and every other attribute go to the root `<span>`.

### Slots

| Slot      | Description                                                                                              |
| --------- | -------------------------------------------------------------------------------------------------------- |
| `default` | Extra `Avatar` components, rendered after the data avatars and the +N avatar. Set their `size` yourself. |

### Events

AvatarGroup has no events.

## Types

```ts
import type {
  AvatarColor,
  AvatarGroupItem,
  AvatarGroupProps,
  AvatarPart,
  AvatarProps,
  AvatarShape,
  AvatarSize,
  AvatarStatus,
} from '@artisanpack-ui/vue/display';
```

| Type               | Description                                                                                         |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| `AvatarProps`      | Avatar's props.                                                                                     |
| `AvatarGroupProps` | AvatarGroup's props.                                                                                |
| `AvatarGroupItem`  | One entry in `avatars`: `name`, `src`, `alt`, `initials`, `icon`, `color`, `status`, `statusLabel`. |
| `AvatarColor`      | The eight semantic colors.                                                                          |
| `AvatarSize`       | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                                                              |
| `AvatarShape`      | `'circle' \| 'square'`                                                                              |
| `AvatarStatus`     | `'online' \| 'away' \| 'offline'`                                                                   |
| `AvatarPart`       | `'root' \| 'image' \| 'initials' \| 'status'`                                                       |

## Accessibility

Avatar isn't interactive and has no keyboard behavior.

- The root is `role="img"`, named by `alt` or `name` plus the status in words. The image, initials, icon and dot inside it are decorative.
- Without a `name` or `alt`, the avatar is decorative: `aria-hidden="true"` and no role. Give an avatar that carries meaning a `name` or `alt`.
- Status is announced in words, never by the dot's color alone. The dot has a ring in the surface color.
- Initials keep a 4.5:1 contrast on their soft fill in every theme.
- AvatarGroup is `role="group"`. Give it a `label`. The +N avatar is named "{count} more".
- In forced colors the avatar keeps an edge and the dot uses `CanvasText`.

## Related

- [Avatar in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/avatar): anatomy, tokens and live examples.
- [Badge](badge.md) for status labels.
- [Stat](stat.md) and [Card](../layout/card.md) for profile and summary layouts.
