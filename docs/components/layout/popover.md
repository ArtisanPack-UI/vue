---
title: Popover
menu_order: 130
meta_description: The Vue Popover component. An anchored, non-modal panel for a short task, with placements, own triggers, v-model:open and every prop and part.
---

# Popover

An anchored, non-modal panel for a short task tied to one control, such as sharing a link or explaining a metric. The panel is a labelled `role="dialog"`. Focus moves into it when it opens and returns to the trigger on Escape. An outside click closes it, and the rest of the page stays usable.

```ts
import { Popover } from '@artisanpack-ui/vue/layout';
// or
import { Popover } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Button, Input } from '@artisanpack-ui/vue/form';
import { Popover } from '@artisanpack-ui/vue/layout';
</script>

<template>
  <Popover trigger="Share" title="Share report">
    <Input label="Link" readonly value="horizon.app/r/q4-income" />
    <template #actions>
      <Button size="sm" leading-icon="copy">Copy link</Button>
    </template>
  </Popover>
</template>
```

`trigger` renders an outline neutral [Button](../form/button.md) that opens and closes the popover.

### Your own trigger

When the `trigger` slot holds exactly one element, that element becomes the trigger itself: the popover adds its trigger attributes and handlers to it instead of wrapping it. The element keeps its own classes and handlers. Text in the slot renders the outline Button instead.

```vue
<template>
  <Popover placement="top" title="What counts as a visit?">
    <template #trigger>
      <Button
        variant="ghost"
        color="neutral"
        size="sm"
        icon-only
        leading-icon="info"
        aria-label="About visits"
      />
    </template>
    <p>A unique person who opened the listing for at least 5 seconds, counted once a day.</p>
  </Popover>
</template>
```

### Placement and arrow

`placement` sets the trigger's side the panel sits on: `top`, `bottom` (the default), `start` or `end`. Start and end follow the reading direction. The panel lines up with the trigger's start edge and flips to stay in the viewport; the side it settled on is emitted as `data-side`. `:arrow="false"` drops the arrow.

```vue
<template>
  <Popover trigger="Filters" placement="end" :arrow="false" aria-label="Filters">
    <!-- … -->
  </Popover>
</template>
```

### Controlled open state

`v-model:open` binds whether the popover is open. When you pass `open`, the popover is controlled: it reports changes through `update:open` and shows only what the prop says. Without it, the popover keeps its own state.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@artisanpack-ui/vue/form';
import { Popover } from '@artisanpack-ui/vue/layout';

const open = ref(false);
</script>

<template>
  <Popover v-model:open="open" trigger="Rename" title="Rename listing">
    <!-- form -->
    <template #actions>
      <Button size="sm" @click="open = false">Save</Button>
    </template>
  </Popover>
</template>
```

## Props

| Prop        | Type                                    | Default    | Description                                                                                                                            |
| ----------- | --------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `open`      | `boolean`                               | `false`    | Whether it's open. Passing it makes the popover controlled. Bind with `v-model:open`.                                                  |
| `placement` | `'top' \| 'bottom' \| 'start' \| 'end'` | `'bottom'` | The trigger's side the panel sits on. Emitted as `data-placement`; the side after flipping is `data-side`.                             |
| `arrow`     | `boolean`                               | `true`     | Draws the arrow that points at the trigger.                                                                                            |
| `title`     | `string`                                | —          | The heading (an `<h3>`) and the panel's accessible name. Without one, give the popover an `aria-label`. The `title` slot overrides it. |
| `actions`   | `string`                                | —          | A row of actions at the end of the panel. Usually the `actions` slot.                                                                  |
| `trigger`   | `string`                                | —          | Text for an outline Button that opens the popover. The `trigger` slot overrides it.                                                    |
| `portal`    | `boolean`                               | `true`     | Teleports the panel to the end of `<body>`. Off renders it in place.                                                                   |
| `classes`   | `Partial<Record<PopoverPart, string>>`  | —          | Extra classes per [part](#parts), such as `{ title: '…', body: '…' }`.                                                                 |

Popover doesn't inherit attributes onto a wrapper. `class`, `style`, `aria-label` and every other attribute go to the panel (`.apui-popover`), not the trigger.

## v-model

| Binding        | Type      | Carries                                                                         |
| -------------- | --------- | ------------------------------------------------------------------------------- |
| `v-model:open` | `boolean` | Whether the popover is open. Updated by the trigger, Escape and outside clicks. |

## Slots

| Slot      | Description                                                                                   |
| --------- | --------------------------------------------------------------------------------------------- |
| `default` | The body. The body part is omitted when this has no visible content.                          |
| `trigger` | One element to use as the trigger itself, or text for the outline Button. Replaces `trigger`. |
| `title`   | The heading content. Replaces `title`.                                                        |
| `actions` | The actions row. Replaces `actions`.                                                          |

## Events

| Event          | Payload   | Description                                                                |
| -------------- | --------- | -------------------------------------------------------------------------- |
| `@update:open` | `boolean` | The popover opened or closed itself (trigger, Escape or an outside click). |

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part         | Element                  | Description                                                             |
| ------------ | ------------------------ | ----------------------------------------------------------------------- |
| `trigger`    | `button` or your element | The trigger.                                                            |
| `positioner` | `div`                    | Positions the panel next to the trigger.                                |
| `root`       | `div`                    | The panel, `.apui-popover`, `role="dialog"`. Same element as `content`. |
| `content`    | `div`                    | The panel. Same element as `root`.                                      |
| `arrow`      | `span`                   | The arrow. `aria-hidden`.                                               |
| `title`      | `h3`                     | The title.                                                              |
| `body`       | `div`                    | The default slot.                                                       |
| `actions`    | `div`                    | The actions row.                                                        |

## Types

```ts
import type { PopoverPart, PopoverPlacement, PopoverProps } from '@artisanpack-ui/vue/layout';
```

| Type               | Description                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| `PopoverProps`     | The component's props.                                                                          |
| `PopoverPlacement` | `'top' \| 'bottom' \| 'start' \| 'end'`                                                         |
| `PopoverPart`      | `'root' \| 'content' \| 'trigger' \| 'positioner' \| 'arrow' \| 'title' \| 'body' \| 'actions'` |

## Accessibility

| Keys               | Action                                                                                                         |
| ------------------ | -------------------------------------------------------------------------------------------------------------- |
| `Enter`, `Space`   | On the trigger, opens or closes the popover; focus moves to its first control.                                 |
| `Tab`, `Shift+Tab` | Moves between the controls inside. Past the last one, focus moves on after the trigger and the popover closes. |
| `Escape`           | Closes the popover and returns focus to the trigger.                                                           |

- The panel is `role="dialog"`, labelled by its title or an `aria-label`, and isn't modal: the page stays usable.
- The trigger has `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls`. An icon-only trigger needs an `aria-label`.
- `start` and `end` follow the reading direction, and the panel flips to stay in the viewport.
- Keep it to a short task. Don't put a long form in a popover; use a [Dialog](dialog.md) or a [Drawer](drawer.md).

## Related

- [Popover in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/popover): anatomy, tokens and live examples.
- [Tooltip](../utility/tooltip.md) for a short, non-interactive hint.
- [DropdownMenu](dropdown-menu.md) for a list of actions.
- [Dialog](dialog.md) for a modal task.
