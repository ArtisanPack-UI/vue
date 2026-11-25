---
title: Carousel
menu_order: 30
meta_description: The Vue Carousel component. Scroll-snapped slides with previous and next buttons, dots, several slides per view, loop and autoplay.
---

# Carousel

Scroll-snapped slides with previous and next buttons, position dots and optional autoplay with a pause button. It renders a `<div class="apui-carousel">` region. Each slide is a [Card](../layout/card.md) unless you draw it with the `slide` slot. Use it for a row of related cards, such as featured products or articles. For a full-width image slideshow, use [ImageSlider](image-slider.md).

```ts
import { Carousel } from '@artisanpack-ui/vue/display';
// or
import { Carousel } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Carousel, type CarouselSlide } from '@artisanpack-ui/vue/display';

const slides: CarouselSlide[] = [
  {
    id: 1,
    image: '/img/cabin.jpg',
    alt: 'A cabin by a lake',
    title: 'Lakeside cabin',
    description: 'Sleeps four.',
    href: '/stays/1',
  },
  {
    id: 2,
    image: '/img/loft.jpg',
    alt: 'A bright city loft',
    title: 'City loft',
    description: 'Walk to everything.',
    href: '/stays/2',
  },
  {
    id: 3,
    image: '/img/barn.jpg',
    alt: 'A converted barn',
    title: 'Converted barn',
    description: 'Room for the whole family.',
    href: '/stays/3',
  },
];
</script>

<template>
  <Carousel :slides="slides" />
</template>
```

Each slide's `image`, `alt`, `title`, `description` and `href` become the default Card's media, media alt, title, description and title link. The 2.x `src` and `caption` keys still work as `image` and `title`.

### Several slides per view

`perView` shows several slides at once, with the next one peeking at the inline end. There's one dot per start position, and the dots are hidden when everything fits.

```vue
<template>
  <Carousel :slides="slides" :per-view="3" />
</template>
```

### Title and buttons

With `title`, the carousel gets a header with the heading and outline previous and next buttons beside it. Without a title, soft buttons overlay the slides. `headingLevel` sets the heading tag, from 2 to 6.

```vue
<template>
  <Carousel :slides="slides" :per-view="2" title="Featured stays" :heading-level="2" />
</template>
```

### Loop and autoplay

`loop` wraps from the last position to the first and back. `autoplay` advances every `interval` milliseconds and adds a pause button. Autoplay pauses while the pointer or focus is on the carousel, and starts paused when the user prefers reduced motion.

```vue
<template>
  <Carousel :slides="slides" loop autoplay :interval="7000" label="Featured stays" />
</template>
```

### Custom slides

The `slide` slot draws each slide. It receives the slide object and its 0-based index. Give every slide a distinct `id` so reordering the list keeps each slot's own state with its slide. Without distinct ids, slides are keyed by position.

```vue
<template>
  <Carousel :slides="slides" :per-view="2">
    <template #slide="{ slide, index }">
      <figure class="testimonial">
        <blockquote>{{ slide.quote }}</blockquote>
        <figcaption>{{ index + 1 }}. {{ slide.author }}</figcaption>
      </figure>
    </template>
  </Carousel>
</template>
```

`CarouselSlide` allows extra keys, so you can carry your own data (such as `quote` above) on each slide.

### Controlling the position

Carousel has no `v-model`. `index` sets the starting position. When you pass `index`, the carousel shows only what it says: listen to `index-change` and write the new position back.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Carousel } from '@artisanpack-ui/vue/display';

const position = ref(0);
</script>

<template>
  <Carousel :slides="slides" :index="position" @index-change="position = $event" />
  <p>Showing position {{ position + 1 }}</p>
</template>
```

## Props

| Prop             | Type                                    | Default                                                             | Description                                                                                        |
| ---------------- | --------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `slides`         | `CarouselSlide[]`                       | —                                                                   | Required. The slides, in order.                                                                    |
| `perView`        | `number`                                | `1`                                                                 | Slides in view at once, a whole number. Above 1 the next slide peeks.                              |
| `index`          | `number`                                | `0`                                                                 | The position shown, 0-based. When passed, the carousel is controlled: pair it with `index-change`. |
| `loop`           | `boolean`                               | `false`                                                             | Wraps from the last position to the first and back.                                                |
| `autoplay`       | `boolean`                               | `false`                                                             | Advances every `interval` ms, with a pause button.                                                 |
| `interval`       | `number`                                | `5000`                                                              | Milliseconds between slides while autoplay runs.                                                   |
| `title`          | `string`                                | —                                                                   | A heading in the header, with the buttons beside it. Without it the buttons overlay the slides.    |
| `headingLevel`   | `number`                                | `3`                                                                 | The title's heading level, clamped to 2–6.                                                         |
| `label`          | `string`                                | a passed `aria-label`, then `title`, else `'Carousel'` (translated) | Names the region.                                                                                  |
| `previousLabel`  | `string`                                | `'Previous slide'`, translated                                      | The previous button's accessible name.                                                             |
| `nextLabel`      | `string`                                | `'Next slide'`, translated                                          | The next button's accessible name.                                                                 |
| `indicatorLabel` | `string`                                | `'Go to slide {index}'`, translated                                 | A dot's accessible name. `{index}` is replaced.                                                    |
| `slideLabel`     | `string`                                | `'{index} of {count}'`, translated                                  | A slide's accessible name.                                                                         |
| `playLabel`      | `string`                                | `'Start slide rotation'`, translated                                | The autoplay button's name while paused.                                                           |
| `pauseLabel`     | `string`                                | `'Stop slide rotation'`, translated                                 | The autoplay button's name while playing.                                                          |
| `classes`        | `Partial<Record<CarouselPart, string>>` | —                                                                   | Extra classes per [part](#parts).                                                                  |

Carousel sets `inheritAttrs: false` and merges `class`, `style` and every other attribute onto the root `<div>` itself. A passed `aria-label` names the region when `label` isn't set.

### Slide shape

| Key             | Type               | Description                                                          |
| --------------- | ------------------ | -------------------------------------------------------------------- |
| `id`            | `string \| number` | A stable id. When every slide has a distinct one, it keys the slide. |
| `image`         | `string`           | The Card's image URL. `src` is the 2.x alias.                        |
| `alt`           | `string`           | Describes the image.                                                 |
| `title`         | `string`           | The Card's title. `caption` is the 2.x alias.                        |
| `description`   | `string`           | The Card's supporting text.                                          |
| `href`          | `string`           | Links the Card's title.                                              |
| `[key: string]` | `unknown`          | Anything else, for the `slide` slot.                                 |

## Slots

| Slot    | Slot props                                | Description                                 |
| ------- | ----------------------------------------- | ------------------------------------------- |
| `slide` | `{ slide: CarouselSlide, index: number }` | Draws one slide. Replaces the default Card. |

## Events

| Event           | Payload         | Description                                                                                                            |
| --------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `@index-change` | `index: number` | The position changed, from a button, a dot, a swipe or autoplay. When `index` is bound, write this value back to move. |

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part              | Element   | Description                                                        |
| ----------------- | --------- | ------------------------------------------------------------------ |
| `root`            | `div`     | The region, `.apui-carousel`.                                      |
| `header`          | `div`     | The header with the title and buttons. Only rendered with `title`. |
| `title`           | `h2`–`h6` | The heading.                                                       |
| `viewport`        | `div`     | Clips the track. Holds the overlay buttons without a title.        |
| `itemGroup`       | `div`     | The scroll-snapped track. A polite live region, focusable.         |
| `item`            | `div`     | One slide, a group named "n of N".                                 |
| `prevTrigger`     | `button`  | The previous button, a `Button`.                                   |
| `nextTrigger`     | `button`  | The next button, a `Button`.                                       |
| `indicatorGroup`  | `div`     | The dots. Only rendered with more than one position.               |
| `indicator`       | `button`  | One dot. The current one has `aria-current`.                       |
| `autoplayTrigger` | `button`  | The pause and play button. Only rendered with `autoplay`.          |

## Types

```ts
import type { CarouselPart, CarouselProps, CarouselSlide } from '@artisanpack-ui/vue/display';
```

| Type            | Description                                                                                                                                                      |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CarouselProps` | The component's props.                                                                                                                                           |
| `CarouselSlide` | One slide. See [Slide shape](#slide-shape).                                                                                                                      |
| `CarouselPart`  | `'root' \| 'header' \| 'title' \| 'viewport' \| 'itemGroup' \| 'item' \| 'prevTrigger' \| 'nextTrigger' \| 'indicatorGroup' \| 'indicator' \| 'autoplayTrigger'` |

## Accessibility

| Keys                      | Action                                                                                                                     |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `Tab`, `Shift+Tab`        | Move between the autoplay button, the previous and next buttons, the track and the dots.                                   |
| `Enter`, `Space`          | On a button or dot: shows its position, or pauses and resumes autoplay.                                                    |
| `ArrowRight`, `ArrowLeft` | On the dots: show the next or previous position. They follow the text direction, so in RTL `ArrowLeft` shows the next one. |
| `Home`, `End`             | On the dots: show the first or last position.                                                                              |

- The root is a region with `aria-roledescription="carousel"`, named by `label`, a passed `aria-label`, the title, or "Carousel".
- Each slide is a group with `aria-roledescription="slide"`, named "n of N". Slides out of view are hidden from assistive technology.
- The track is a polite live region, turned off while autoplay runs, so moves are announced.
- The buttons and dots have translatable accessible names. The current dot carries `aria-current`.
- Autoplay never runs without a visible pause button, which comes first in the Tab order. It pauses on hover and focus, and starts paused under `prefers-reduced-motion`.
- Give each slide image an `alt`. The previous and next icons mirror in RTL.

## Related

- [Carousel in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/carousel): anatomy, tokens and live examples.
- [ImageSlider](image-slider.md) for a full-width image slideshow.
- [ImageGallery](image-gallery.md) for a grid of images with a lightbox.
- [Card](../layout/card.md), the default slide.
