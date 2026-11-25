---
title: ImageSlider
menu_order: 70
meta_description: The Vue ImageSlider component. One large image per view with glass captions, a counter, dots, thumbnails, loop and autoplay.
---

# ImageSlider

Shows one large image per view, such as a hero slideshow or a product's photos. It renders a `<div class="apui-image-slider">` region with a fixed-ratio frame, a glass caption over each image, a counter, previous and next buttons, position dots, and optional autoplay and thumbnails. For a row of cards, use [Carousel](carousel.md).

```ts
import { ImageSlider } from '@artisanpack-ui/vue/display';
// or
import { ImageSlider } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { ImageSlider, type ImageSliderImage } from '@artisanpack-ui/vue/display';

const slides: ImageSliderImage[] = [
  {
    src: '/img/lake.jpg',
    alt: 'A lake at sunrise',
    caption: 'Lakeside',
    description: 'Quiet cabins on the water.',
  },
  { src: '/img/city.jpg', alt: 'A city skyline at night', caption: 'Downtown' },
  { src: '/img/forest.jpg', alt: 'A trail through tall pines' },
];
</script>

<template>
  <ImageSlider :images="slides" label="Featured destinations" />
</template>
```

Every image needs `alt`. `caption` and `description` show on a glass card over the image's foot. Image URLs with an unsafe scheme are dropped. Images after the first load lazily.

### Aspect ratio

`aspectRatio` sets the frame's ratio, in any form CSS takes.

```vue
<template>
  <ImageSlider :images="slides" aspect-ratio="4 / 3" />
</template>
```

### Thumbnails

`thumbnails` adds a strip of thumbnail buttons under the frame.

```vue
<template>
  <ImageSlider :images="slides" thumbnails aspect-ratio="16 / 9" />
</template>
```

### Loop and autoplay

ImageSlider loops by default: next on the last slide shows the first. Set `loop` to `false` to stop at the ends. `autoplay` advances every `interval` milliseconds and adds a pause button. Autoplay pauses while the pointer or focus is on the slider.

```vue
<template>
  <ImageSlider :images="slides" autoplay :interval="6000" />
  <ImageSlider :images="slides" :loop="false" />
</template>
```

### Controlling the slide

ImageSlider has no `v-model`. `index` sets the starting slide. When you pass `index`, the slider shows only what it says: listen to `index-change` and write the new slide back.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { ImageSlider } from '@artisanpack-ui/vue/display';

const shown = ref(0);
</script>

<template>
  <ImageSlider :images="slides" :index="shown" @index-change="shown = $event" />
</template>
```

## Props

| Prop             | Type                                       | Default                              | Description                                                                                         |
| ---------------- | ------------------------------------------ | ------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `images`         | `ImageSliderImage[]`                       | —                                    | Required. The slides, in order.                                                                     |
| `aspectRatio`    | `string`                                   | `'21 / 9'`                           | The frame's aspect ratio, as CSS takes it. Set as the `--apui-_image-slider-ratio` custom property. |
| `index`          | `number`                                   | `0`                                  | The slide shown, 0-based. When passed, it's controlled: pair it with `index-change`.                |
| `loop`           | `boolean`                                  | `true`                               | Wraps from the last slide to the first and back.                                                    |
| `autoplay`       | `boolean`                                  | `false`                              | Advances every `interval` ms, with a pause button.                                                  |
| `interval`       | `number`                                   | `5000`                               | Milliseconds between slides while autoplay runs.                                                    |
| `thumbnails`     | `boolean`                                  | `false`                              | Shows a strip of thumbnails under the frame.                                                        |
| `label`          | `string`                                   | `'Photos'`, translated               | Names the slider region.                                                                            |
| `previousLabel`  | `string`                                   | `'Previous photo'`, translated       | The previous button's accessible name.                                                              |
| `nextLabel`      | `string`                                   | `'Next photo'`, translated           | The next button's accessible name.                                                                  |
| `indicatorLabel` | `string`                                   | `'Photo {index}'`, translated        | A dot's accessible name. `{index}` is replaced.                                                     |
| `slideLabel`     | `string`                                   | `'{index} of {count}'`, translated   | A slide's accessible name.                                                                          |
| `counterLabel`   | `string`                                   | `'{index} / {count}'`, translated    | The visible counter text.                                                                           |
| `playLabel`      | `string`                                   | `'Start slide rotation'`, translated | The autoplay button's name while paused.                                                            |
| `pauseLabel`     | `string`                                   | `'Stop slide rotation'`, translated  | The autoplay button's name while playing.                                                           |
| `classes`        | `Partial<Record<ImageSliderPart, string>>` | —                                    | Extra classes per [part](#parts).                                                                   |

ImageSlider sets `inheritAttrs: false` and merges `class`, `style` and every other attribute onto the root `<div>`. Name the region with `label`: a passed `aria-label` is replaced by it.

### Image shape

| Key           | Type     | Description                                |
| ------------- | -------- | ------------------------------------------ |
| `src`         | `string` | Required. The image's URL.                 |
| `alt`         | `string` | Describes the image. Every image needs it. |
| `caption`     | `string` | The glass caption's title.                 |
| `description` | `string` | The caption's supporting text.             |

## Slots

ImageSlider has no slots.

## Events

| Event           | Payload         | Description                                                                                                                      |
| --------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `@index-change` | `index: number` | The slide changed, from a button, a dot, a thumbnail, a swipe or autoplay. When `index` is bound, write this value back to move. |

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part              | Element  | Description                                                          |
| ----------------- | -------- | -------------------------------------------------------------------- |
| `root`            | `div`    | The region, `.apui-image-slider`.                                    |
| `viewport`        | `div`    | The frame. Holds the slides and the overlay controls.                |
| `itemGroup`       | `div`    | The track, a polite live region.                                     |
| `item`            | `div`    | One slide, a group named "n of N".                                   |
| `image`           | `img`    | A slide's image.                                                     |
| `caption`         | `div`    | The glass caption card. Only rendered with a caption or description. |
| `title`           | `p`      | The caption's title.                                                 |
| `description`     | `p`      | The caption's supporting text.                                       |
| `progressText`    | `span`   | The counter, such as "2 / 5".                                        |
| `prevTrigger`     | `button` | The previous button, a `Button`.                                     |
| `nextTrigger`     | `button` | The next button, a `Button`.                                         |
| `indicatorGroup`  | `div`    | The dots.                                                            |
| `indicator`       | `button` | One dot. The current one has `aria-current`.                         |
| `autoplayTrigger` | `button` | The pause and play button. Only rendered with `autoplay`.            |
| `thumbs`          | `div`    | The thumbnail strip. Only rendered with `thumbnails`.                |
| `thumb`           | `button` | One thumbnail.                                                       |

## Types

```ts
import type {
  ImageSliderImage,
  ImageSliderPart,
  ImageSliderProps,
} from '@artisanpack-ui/vue/display';
```

| Type               | Description                                  |
| ------------------ | -------------------------------------------- |
| `ImageSliderProps` | The component's props.                       |
| `ImageSliderImage` | One slide. See [Image shape](#image-shape).  |
| `ImageSliderPart`  | The 16 part names listed in [Parts](#parts). |

## Accessibility

| Keys                      | Action                                                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `Tab`, `Shift+Tab`        | Move between the previous and next buttons, the dots, the autoplay button and the thumbnails.                             |
| `Enter`, `Space`          | On a button, dot or thumbnail: shows its slide, or pauses and resumes autoplay.                                           |
| `ArrowRight`, `ArrowLeft` | On the dots: show the next or previous slide. They follow the text direction, so in RTL `ArrowLeft` shows the next slide. |
| `Home`, `End`             | On the dots: show the first or last slide.                                                                                |

- The root is a region with `aria-roledescription="carousel"`, named by `label`.
- Each slide is a group with `aria-roledescription="slide"`, named by its position. Slides out of view are hidden from assistive technology.
- The track is a polite live region, turned off while autoplay runs, so moves are announced.
- Every image needs `alt` text. Keep captions as text, never baked into the image.
- The buttons and dots have translatable accessible names. The current dot carries `aria-current`.
- Autoplay has a pause button and stops while the pointer or focus is on the slider.
- The glass caption falls back to the raised surface under reduced transparency and in high contrast. The previous and next icons mirror in RTL.

## Related

- [ImageSlider in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/image-slider): anatomy, tokens and live examples.
- [Carousel](carousel.md) for a row of cards.
- [ImageGallery](image-gallery.md) for a grid with a lightbox.
