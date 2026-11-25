---
title: Timeline
menu_order: 130
meta_description: The Vue Timeline and TimelineItem components. Events in order with icon or dot markers, times, details and cards, as data or composed.
---

# Timeline

Shows events in order, such as an activity feed or an order history. It renders an ordered list, `<ol class="apui-timeline">`, with one `<li>` per event: a marker, a head (what happened and when), muted detail and an optional card. Pass events as data with `items`, compose them with `TimelineItem` children, or both.

```ts
import { Timeline, TimelineItem } from '@artisanpack-ui/vue/display';
// or
import { Timeline, TimelineItem } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Timeline, type TimelineItemData } from '@artisanpack-ui/vue/display';

const events: TimelineItemData[] = [
  {
    title: 'Order placed',
    time: 'May 2, 9:14 AM',
    datetime: '2026-05-02T09:14',
    icon: 'shopping-cart',
  },
  {
    title: 'Payment captured',
    time: 'May 2, 9:15 AM',
    datetime: '2026-05-02T09:15',
    icon: 'credit-card',
    color: 'success',
  },
  {
    title: 'Shipped',
    time: 'May 3',
    datetime: '2026-05-03',
    icon: 'truck',
    color: 'info',
    description: 'UPS 1Z999AA10123456784',
  },
];
</script>

<template>
  <Timeline :items="events" label="Order history" />
</template>
```

`time` is shown as written. Pass `datetime` with the machine-readable value (ISO 8601) for the `<time>` element.

### Composition

`TimelineItem` children take the same props as an `items` entry. Its default slot replaces `title` with markup, and its `card` slot replaces `card`. Children render after any `items`.

```vue
<script setup lang="ts">
import { Timeline, TimelineItem } from '@artisanpack-ui/vue/display';
</script>

<template>
  <Timeline label="Activity">
    <TimelineItem icon="message-circle" time="2h ago" datetime="2026-11-25T08:00">
      <strong>Olivia Rhye</strong> commented on <a href="/tasks/42">Homepage copy</a>
      <template #card> Looks great. Can we swap the hero image before launch? </template>
    </TimelineItem>
    <TimelineItem icon="check" color="success" title="Task completed" time="Yesterday" />
  </Timeline>
</template>
```

### Dots and cards

`variant="dot"` swaps icon markers for small dots, for a compact history. `card` adds a sunken box under the head, such as a comment.

```vue
<template>
  <Timeline
    variant="dot"
    :items="[
      { title: 'Draft saved', time: '10:02' },
      {
        title: 'Review requested',
        time: '10:30',
        color: 'warning',
        card: 'Please check the pricing table.',
      },
      { title: 'Published', time: '11:15', color: 'success' },
    ]"
  />
</template>
```

## Props

| Prop      | Type                                    | Default  | Description                                                                                                      |
| --------- | --------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------- |
| `items`   | `TimelineItemData[]`                    | —        | The events as data, rendered as TimelineItems before the default slot.                                           |
| `variant` | `'icon' \| 'dot'`                       | `'icon'` | Icon markers, or small dots for a compact history. Emitted as `data-variant`.                                    |
| `label`   | `string`                                | —        | The list's accessible name.                                                                                      |
| `classes` | `Partial<Record<TimelinePart, string>>` | —        | Extra classes per [part](#parts), including its items' parts. They apply to `items` and composed children alike. |

`class`, `style` and every other attribute go to the root `<ol>`.

## Slots

| Slot      | Description                                      |
| --------- | ------------------------------------------------ |
| `default` | `TimelineItem` children, rendered after `items`. |

## Events

Timeline has no events of its own. Listeners fall through to the root `<ol>`.

## Parts

Pass extra classes to a part with Timeline's `classes`. Every part except the root carries a `data-part` attribute you can also target in CSS.

| Part     | Element | Description                                        |
| -------- | ------- | -------------------------------------------------- |
| `root`   | `ol`    | The list, `.apui-timeline`.                        |
| `item`   | `li`    | One event.                                         |
| `marker` | `span`  | The icon or dot, with `data-color`. `aria-hidden`. |
| `head`   | `div`   | What happened, then the time.                      |
| `time`   | `time`  | When, with `datetime`.                             |
| `body`   | `div`   | The muted description.                             |
| `card`   | `div`   | The sunken box under the head.                     |

## TimelineItem

One event of a Timeline. It renders an `<li>` and must be a child of `Timeline` (or another `<ol>`/`<ul>`). Its parts take their extra classes from the parent Timeline's `classes`.

### Props

| Prop          | Type                                                                                               | Default | Description                                                                  |
| ------------- | -------------------------------------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------- |
| `title`       | `string`                                                                                           | —       | What happened: the head. The default slot replaces it.                       |
| `time`        | `string`                                                                                           | —       | When, as shown, such as "2h ago".                                            |
| `datetime`    | `string`                                                                                           | —       | When, machine-readable (ISO 8601), for the `<time>` element's `datetime`.    |
| `icon`        | `string`                                                                                           | —       | A registry icon name for the marker.                                         |
| `color`       | `'primary' \| 'secondary' \| 'accent' \| 'neutral' \| 'success' \| 'warning' \| 'error' \| 'info'` | —       | Tints the marker. Unknown values are ignored.                                |
| `description` | `string`                                                                                           | —       | Muted detail under the head.                                                 |
| `card`        | `string`                                                                                           | —       | A sunken box under the head, such as a comment. The `card` slot replaces it. |

`class`, `style` and every other attribute go to the `<li>`.

### Slots

| Slot      | Description                                              |
| --------- | -------------------------------------------------------- |
| `default` | Replaces `title` in the head. The time still follows it. |
| `card`    | Replaces `card`.                                         |

### Events

TimelineItem has no events of its own.

## Types

```ts
import type {
  TimelineColor,
  TimelineItemData,
  TimelineItemProps,
  TimelinePart,
  TimelineProps,
  TimelineVariant,
} from '@artisanpack-ui/vue/display';
```

| Type                | Description                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------ |
| `TimelineProps`     | Timeline's props.                                                                          |
| `TimelineItemProps` | TimelineItem's props. The same as `TimelineItemData`.                                      |
| `TimelineItemData`  | One entry in `items`: `title`, `time`, `datetime`, `icon`, `color`, `description`, `card`. |
| `TimelineVariant`   | `'icon' \| 'dot'`                                                                          |
| `TimelineColor`     | The eight semantic colors.                                                                 |
| `TimelinePart`      | `'root' \| 'item' \| 'marker' \| 'head' \| 'time' \| 'body' \| 'card'`                     |

## Accessibility

Timeline has no keyboard behavior of its own. Links and buttons inside items keep theirs.

- It's an ordered list, so the count and position are announced. Give it a `label` when the page has more than one list.
- Times use `<time>` elements. Pass `datetime` for the machine-readable value.
- Markers are decorative and hidden: say what happened in the head, never only with an icon or color.
- Times and body text keep a 4.5:1 contrast (`--apui-text-muted`).

## Related

- [Timeline in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/timeline): anatomy, tokens and live examples.
- [Steps](../navigation/steps.md) for progress through a flow.
- [Avatar](avatar.md) for people in an activity feed.
