---
title: Accordion
menu_order: 10
meta_description: The Vue Accordion and AccordionItem components. Stacked sections that expand and collapse, with v-model, variants and every prop, slot and part.
---

# Accordion

Stacked sections that expand and collapse. Each item is a heading holding a trigger button, followed by a panel. Use it for FAQs and long settings pages where people only need one or two sections at a time. Build it from `AccordionItem` children, or pass the same items as data with `items`.

```ts
import { Accordion, AccordionItem } from '@artisanpack-ui/vue/layout';
// or
import { Accordion, AccordionItem } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Accordion, AccordionItem } from '@artisanpack-ui/vue/layout';
</script>

<template>
  <Accordion>
    <AccordionItem value="live" title="How long does a listing stay live?">
      Listings stay live until you archive them or mark them as sold.
    </AccordionItem>
    <AccordionItem value="owners" title="Can co-owners edit a listing?">
      Yes, from the Sharing tab.
    </AccordionItem>
  </Accordion>
</template>
```

### Items as data

Pass `items` to render the same markup from an array. Data items render before any `AccordionItem` children. `content` is plain text; use composed items for rich panels.

```vue
<script setup lang="ts">
import { Accordion, type AccordionItemData } from '@artisanpack-ui/vue/layout';

const faq: AccordionItemData[] = [
  { value: 'live', title: 'How long does a listing stay live?', content: 'Until you archive it.' },
  {
    value: 'owners',
    title: 'Can co-owners edit a listing?',
    content: 'Yes, from the Sharing tab.',
  },
  {
    value: 'files',
    title: 'Which file types can I upload?',
    content: 'Images and PDFs.',
    disabled: true,
  },
];
</script>

<template>
  <Accordion :items="faq" />
</template>
```

### Open items with v-model

`v-model` binds the values of the open items as a `string[]`. Without `v-model`, the accordion keeps its own state, starting from nothing open.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Accordion, AccordionItem } from '@artisanpack-ui/vue/layout';

const open = ref(['live']);
</script>

<template>
  <Accordion v-model="open">
    <AccordionItem value="live" title="How long does a listing stay live?">
      Listings stay live until you archive them or mark them as sold.
    </AccordionItem>
    <AccordionItem value="owners" title="Can co-owners edit a listing?">
      Yes, from the Sharing tab.
    </AccordionItem>
  </Accordion>
</template>
```

### Multiple and collapsible

By default one item is open at a time, and it can be closed again. `multiple` lets several items stay open. Set `:collapsible="false"` to keep one item open in a single accordion.

```vue
<template>
  <Accordion :items="faq" multiple />
  <Accordion :items="faq" :collapsible="false" />
</template>
```

### Variants

`default` draws one container around every item, `separated` gives each item its own container, and `flush` drops the container.

```vue
<template>
  <Accordion :items="faq" />
  <Accordion :items="faq" variant="separated" />
  <Accordion :items="faq" variant="flush" />
</template>
```

### Heading level

Each trigger sits in a heading. `headingLevel` sets its level, from 2 to 6 (default 3). Pick the level that fits the page outline. Values outside the range are clamped.

```vue
<template>
  <Accordion :items="faq" :heading-level="2" />
</template>
```

## Props

| Prop           | Type                                     | Default     | Description                                                                    |
| -------------- | ---------------------------------------- | ----------- | ------------------------------------------------------------------------------ |
| `modelValue`   | `string[]`                               | —           | The open items' values. Bind with `v-model`.                                   |
| `items`        | `AccordionItemData[]`                    | —           | Items as data, rendered before the `AccordionItem` children.                   |
| `multiple`     | `boolean`                                | `false`     | Lets several items be open at once. Emitted as `data-multiple`.                |
| `collapsible`  | `boolean`                                | `true`      | Lets the open item of a single accordion close. Emitted as `data-collapsible`. |
| `variant`      | `'default' \| 'separated' \| 'flush'`    | `'default'` | Container style. Emitted as `data-variant`.                                    |
| `headingLevel` | `number`                                 | `3`         | The heading level of each item, clamped to 2–6.                                |
| `disabled`     | `boolean`                                | `false`     | Disables every item.                                                           |
| `classes`      | `Partial<Record<AccordionPart, string>>` | —           | Extra classes per [part](#parts). `classes.root` merges with `class`.          |

`class`, `style` and other attributes go to the root `<div>`.

## v-model

| Binding   | Type       | Carries                       |
| --------- | ---------- | ----------------------------- |
| `v-model` | `string[]` | The values of the open items. |

When you pass `modelValue`, the accordion shows exactly what it says, so a bound value that you don't update keeps items as they are. Without it, the accordion tracks its own open items and still emits `update:modelValue`.

## Slots

| Slot      | Description                                                |
| --------- | ---------------------------------------------------------- |
| `default` | `AccordionItem` children, rendered after the `items` data. |

## Events

| Event                | Payload    | Description                                               |
| -------------------- | ---------- | --------------------------------------------------------- |
| `@update:modelValue` | `string[]` | An item opened or closed. Carries the open items' values. |

## Parts

Pass extra classes to a part with `classes` on the Accordion. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part      | Element   | Description                                      |
| --------- | --------- | ------------------------------------------------ |
| `root`    | `div`     | The accordion, `.apui-accordion`.                |
| `item`    | `div`     | One item.                                        |
| `title`   | `h2`–`h6` | The heading that holds the trigger.              |
| `trigger` | `button`  | The button that opens and closes the item.       |
| `chevron` | `span`    | The chevron icon. `aria-hidden`.                 |
| `content` | `div`     | The panel, `role="region"`. Hidden while closed. |

## AccordionItem

One section of an Accordion. The default slot is the panel. It must be rendered inside an `Accordion`, or it throws.

### AccordionItem props

| Prop       | Type      | Default | Description                                              |
| ---------- | --------- | ------- | -------------------------------------------------------- |
| `value`    | `string`  | —       | Required. The item's value, unique within the accordion. |
| `title`    | `string`  | —       | The trigger's text. The `title` slot overrides it.       |
| `disabled` | `boolean` | `false` | Disables the item. The arrow keys skip it.               |

`class`, `style` and other attributes go to the item's root `<div>`, not the panel.

### AccordionItem slots

| Slot      | Description                            |
| --------- | -------------------------------------- |
| `default` | The panel content.                     |
| `title`   | The trigger content. Replaces `title`. |

AccordionItem has no events.

## Types

```ts
import type {
  AccordionItemData,
  AccordionItemProps,
  AccordionPart,
  AccordionProps,
  AccordionVariant,
} from '@artisanpack-ui/vue/layout';
```

| Type                 | Description                                                          |
| -------------------- | -------------------------------------------------------------------- |
| `AccordionProps`     | The Accordion's props.                                               |
| `AccordionItemProps` | The AccordionItem's props.                                           |
| `AccordionItemData`  | One entry of `items`: `{ value, title, content?, disabled? }`.       |
| `AccordionVariant`   | `'default' \| 'separated' \| 'flush'`                                |
| `AccordionPart`      | `'root' \| 'item' \| 'title' \| 'trigger' \| 'chevron' \| 'content'` |

## Accessibility

| Keys                   | Action                                                          |
| ---------------------- | --------------------------------------------------------------- |
| `Enter`, `Space`       | Opens or closes the focused item.                               |
| `Tab`, `Shift+Tab`     | Moves through the triggers and into an open panel's content.    |
| `ArrowDown`, `ArrowUp` | Moves to the next or previous trigger, skipping disabled items. |
| `Home`, `End`          | Moves to the first or last trigger.                             |

- Each trigger is a `<button>` inside a heading at `headingLevel`, with `aria-expanded` and `aria-controls` pointing at its panel.
- Each panel is `role="region"`, labelled by its trigger, and hidden while its item is closed.
- Disabled items set `disabled` on the trigger.
- The chevron is `aria-hidden`; the open state is announced through `aria-expanded`.
- Don't hide required form fields in collapsed items.

## Related

- [Accordion in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/accordion): anatomy, tokens and live examples.
- [Collapse](collapse.md) for a single expandable section.
- [Tabs](tabs.md) when only one section should be visible at a time.
