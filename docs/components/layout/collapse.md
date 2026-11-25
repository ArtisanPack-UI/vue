---
title: Collapse
menu_order: 40
meta_description: The Vue Collapse component. A single disclosure or read-more region, with v-model:open and every prop, slot, event and part.
---

# Collapse

A single disclosure: a trigger button that shows and hides a region. With `variant="read-more"`, the region is clamped behind a fade instead, and the trigger follows it. Use it for optional settings and long descriptions. For several sections, use an [Accordion](accordion.md).

```ts
import { Collapse } from '@artisanpack-ui/vue/layout';
// or
import { Collapse } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Collapse } from '@artisanpack-ui/vue/layout';
</script>

<template>
  <Collapse label="Advanced settings"> Custom URL and search visibility. </Collapse>
</template>
```

### Open state with v-model:open

Bind `v-model:open` to control or read the state. Without it, the Collapse keeps its own state, starting from `open` (closed by default).

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Collapse } from '@artisanpack-ui/vue/layout';

const advanced = ref(false);
</script>

<template>
  <Collapse v-model:open="advanced" label="Advanced settings">
    Custom URL and search visibility.
  </Collapse>
</template>
```

### Read more

`variant="read-more"` clamps the text behind a fade and puts the trigger after it. The labels default to "Read more" and "Show less" (translated). The clamped text stays in the accessibility tree.

```vue
<template>
  <Collapse variant="read-more">
    Twenty-four bright apartments around a shared garden courtyard, five minutes from the tram. Most
    units face south with private balconies. The building was renovated in 2024.
  </Collapse>
</template>
```

### Labels

`label` is the trigger's text and `openLabel` its text while open. Without `openLabel`, a section keeps `label` in both states. For richer trigger content, use the `trigger` slot; it replaces both labels.

```vue
<template>
  <Collapse label="Show filters" open-label="Hide filters">
    <!-- filters -->
  </Collapse>
</template>
```

## Props

| Prop        | Type                                    | Default                                      | Description                                                                                              |
| ----------- | --------------------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `open`      | `boolean`                               | `false`                                      | Whether the region shows. Bind with `v-model:open`.                                                      |
| `variant`   | `'section' \| 'read-more'`              | `'section'`                                  | `section` hides the region while closed; `read-more` clamps it behind a fade. Emitted as `data-variant`. |
| `label`     | `string`                                | — (`'Read more'`, translated, for read-more) | The trigger's text.                                                                                      |
| `openLabel` | `string`                                | — (`'Show less'`, translated, for read-more) | The trigger's text while open. Falls back to `label`.                                                    |
| `disabled`  | `boolean`                               | `false`                                      | The trigger can't be focused or toggled.                                                                 |
| `classes`   | `Partial<Record<CollapsePart, string>>` | —                                            | Extra classes per [part](#parts). `classes.root` merges with `class`.                                    |

`class`, `style` and other attributes go to the root `<div>`.

## v-model

| Binding        | Type      | Carries                     |
| -------------- | --------- | --------------------------- |
| `v-model:open` | `boolean` | Whether the region is open. |

When you pass `open`, the region follows it and the trigger only emits `update:open`. Without it, the Collapse toggles itself.

## Slots

| Slot      | Description                                              |
| --------- | -------------------------------------------------------- |
| `default` | The region's content.                                    |
| `trigger` | The trigger's content. Replaces `label` and `openLabel`. |

## Events

| Event          | Payload   | Description                              |
| -------------- | --------- | ---------------------------------------- |
| `@update:open` | `boolean` | The trigger opened or closed the region. |

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part      | Element  | Description                                                          |
| --------- | -------- | -------------------------------------------------------------------- |
| `root`    | `div`    | The collapse, `.apui-collapse`.                                      |
| `trigger` | `button` | The toggle. Before the region in a section, after it in a read-more. |
| `icon`    | `span`   | The chevron. `aria-hidden`.                                          |
| `content` | `div`    | The region.                                                          |
| `fade`    | `span`   | The fade over clamped text. Read-more only. `aria-hidden`.           |

## Types

```ts
import type { CollapsePart, CollapseProps, CollapseVariant } from '@artisanpack-ui/vue/layout';
```

| Type              | Description                                            |
| ----------------- | ------------------------------------------------------ |
| `CollapseProps`   | The component's props.                                 |
| `CollapseVariant` | `'section' \| 'read-more'`                             |
| `CollapsePart`    | `'root' \| 'trigger' \| 'icon' \| 'content' \| 'fade'` |

## Accessibility

| Keys             | Action                                       |
| ---------------- | -------------------------------------------- |
| `Enter`, `Space` | Opens or closes the region.                  |
| `Tab`            | Moves from the trigger into the open region. |

- The trigger is a `<button>` with `aria-expanded` and `aria-controls`. A section's region follows it in the DOM.
- A closed section's region is hidden; a closed read-more's text stays in the accessibility tree and is only clamped visually.
- The fade and the chevron are `aria-hidden`. Make the trigger's text say what will appear.
- Don't clamp text that holds the main point.

## Related

- [Collapse in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/collapse): anatomy, tokens and live examples.
- [Accordion](accordion.md) for several expandable sections.
- [Drawer](drawer.md) for content that slides over the page.
