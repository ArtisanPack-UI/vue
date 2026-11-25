---
title: ImageGallery
menu_order: 60
meta_description: The Vue ImageGallery component. A grid of images that opens an accessible lightbox with a counter, captions, thumbnails and downloads.
---

# ImageGallery

A grid of images that opens a lightbox. It renders a `<div class="apui-image-gallery">` with a `<figure>` per image. Each image is a button that opens the lightbox on it: a dialog with the image, a counter and caption, previous and next buttons, and a strip of thumbnails. Use it for photo sets such as product or listing photos.

```ts
import { ImageGallery } from '@artisanpack-ui/vue/display';
// or
import { ImageGallery } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { ImageGallery, type ImageGalleryImage } from '@artisanpack-ui/vue/display';

const photos: ImageGalleryImage[] = [
  { src: '/img/cabin-front.jpg', alt: 'The cabin from the lake shore', caption: 'Front' },
  { src: '/img/cabin-kitchen.jpg', alt: 'A kitchen with wood counters', caption: 'Kitchen' },
  { src: '/img/cabin-bedroom.jpg', alt: 'A bedroom with a queen bed' },
  { src: '/img/cabin-deck.jpg', alt: 'A deck facing the water' },
];
</script>

<template>
  <ImageGallery :images="photos" />
</template>
```

Every image needs `alt`. A `caption` shows under the grid image and after the counter in the lightbox's title, but it doesn't replace `alt`. Image URLs with an unsafe scheme are dropped.

### Columns and a featured image

`columns` sets the grid's column count. `featured` makes the first image span two columns and two rows.

```vue
<template>
  <ImageGallery :images="photos" :columns="3" featured />
</template>
```

### Without a lightbox

With `lightbox` set to `false`, the images render as plain figures and nothing opens.

```vue
<template>
  <ImageGallery :images="photos" :lightbox="false" />
</template>
```

### Downloads

`downloadable` adds a download link for the image shown to the lightbox's bar.

```vue
<template>
  <ImageGallery :images="photos" downloadable />
</template>
```

### Controlling the lightbox

The lightbox works on its own. To control it, bind `v-model:open` and pass `index` with `index-change`. A bound prop is controlled: the gallery shows only what it says and reports changes for you to write back.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@artisanpack-ui/vue/form';
import { ImageGallery } from '@artisanpack-ui/vue/display';

const open = ref(false);
const shown = ref(0);

function openAt(index: number): void {
  shown.value = index;
  open.value = true;
}
</script>

<template>
  <Button @click="openAt(2)">View the bedroom</Button>
  <ImageGallery
    v-model:open="open"
    :index="shown"
    :images="photos"
    @index-change="shown = $event"
  />
</template>
```

## Props

| Prop            | Type                                        | Default                           | Description                                                                                       |
| --------------- | ------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------- |
| `images`        | `ImageGalleryImage[]`                       | —                                 | Required. The images, in order.                                                                   |
| `columns`       | `number`                                    | `4`                               | How many columns the grid has. Set as the `--apui-_image-gallery-columns` custom property.        |
| `featured`      | `boolean`                                   | `false`                           | The first image spans two columns and two rows. Emitted as `data-featured`.                       |
| `lightbox`      | `boolean`                                   | `true`                            | Each image is a button that opens the lightbox. Off renders plain figures.                        |
| `open`          | `boolean`                                   | `false`                           | Whether the lightbox is open. When passed, it's controlled. Use `v-model:open`.                   |
| `index`         | `number`                                    | `0`                               | The image the lightbox shows, 0-based. When passed, it's controlled: pair it with `index-change`. |
| `downloadable`  | `boolean`                                   | `false`                           | Adds a download link for the image shown to the lightbox's bar.                                   |
| `modal`         | `boolean`                                   | `true`                            | Traps focus, locks scroll and hides the rest of the page while the lightbox is open.              |
| `portal`        | `boolean`                                   | `true`                            | Renders the lightbox at the end of `<body>` with `Teleport`.                                      |
| `closeLabel`    | `string`                                    | `'Close'`, translated             | The close button's accessible name.                                                               |
| `previousLabel` | `string`                                    | `'Previous photo'`, translated    | The previous button's accessible name.                                                            |
| `nextLabel`     | `string`                                    | `'Next photo'`, translated        | The next button's accessible name.                                                                |
| `downloadLabel` | `string`                                    | `'Download'`, translated          | The download link's accessible name.                                                              |
| `counterLabel`  | `string`                                    | `'{index} / {count}'`, translated | The counter in the lightbox's title. `{index}` and `{count}` are replaced.                        |
| `thumbsLabel`   | `string`                                    | `'Photos'`, translated            | Names the thumbnail strip.                                                                        |
| `classes`       | `Partial<Record<ImageGalleryPart, string>>` | —                                 | Extra classes per [part](#parts).                                                                 |

ImageGallery sets `inheritAttrs: false` and merges `class`, `style` and every other attribute onto the root `<div>`. They don't reach the teleported lightbox.

### Image shape

| Key       | Type     | Description                                               |
| --------- | -------- | --------------------------------------------------------- |
| `src`     | `string` | Required. The image's URL.                                |
| `alt`     | `string` | Describes the image. Every image needs it.                |
| `caption` | `string` | Visible text under the image and in the lightbox's title. |

## v-model

| Binding        | Type      | Description                                                               |
| -------------- | --------- | ------------------------------------------------------------------------- |
| `v-model:open` | `boolean` | Whether the lightbox is open. Without it, the gallery tracks this itself. |

The shown image isn't a `v-model`: pass `:index` and listen to `@index-change`.

## Slots

ImageGallery has no slots.

## Events

| Event           | Payload         | Description                                   |
| --------------- | --------------- | --------------------------------------------- |
| `@update:open`  | `open: boolean` | The lightbox opened or closed.                |
| `@index-change` | `index: number` | The lightbox moved to another image, 0-based. |

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part           | Element      | Description                                                       |
| -------------- | ------------ | ----------------------------------------------------------------- |
| `root`         | `div`        | The gallery, `.apui-image-gallery`.                               |
| `grid`         | `div`        | The grid of images.                                               |
| `item`         | `figure`     | One image and its caption.                                        |
| `trigger`      | `button`     | Opens the lightbox on its image. Only rendered with `lightbox`.   |
| `image`        | `img`        | A grid image, and the image on the lightbox's stage.              |
| `caption`      | `figcaption` | A grid image's caption.                                           |
| `backdrop`     | `div`        | The lightbox's backdrop.                                          |
| `positioner`   | `div`        | Positions the lightbox.                                           |
| `content`      | `div`        | The lightbox dialog, `.apui-lightbox`.                            |
| `bar`          | `div`        | The lightbox's top bar.                                           |
| `title`        | `h2`         | The counter and caption, a polite live region.                    |
| `download`     | `a`          | The download link, a `Button`. Only rendered with `downloadable`. |
| `closeTrigger` | `button`     | The close button, a `Button`.                                     |
| `stage`        | `div`        | The image shown, with the previous and next buttons.              |
| `prevTrigger`  | `button`     | The previous button, a `Button`.                                  |
| `nextTrigger`  | `button`     | The next button, a `Button`.                                      |
| `thumbs`       | `div`        | The thumbnail strip, a group named by `thumbsLabel`.              |
| `thumb`        | `button`     | One thumbnail. The shown one has `aria-current`.                  |

## Types

```ts
import type {
  ImageGalleryImage,
  ImageGalleryPart,
  ImageGalleryProps,
} from '@artisanpack-ui/vue/display';
```

| Type                | Description                                  |
| ------------------- | -------------------------------------------- |
| `ImageGalleryProps` | The component's props.                       |
| `ImageGalleryImage` | One image. See [Image shape](#image-shape).  |
| `ImageGalleryPart`  | The 18 part names listed in [Parts](#parts). |

## Accessibility

| Keys                      | Action                                                                                                                                  |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `Enter`, `Space`          | On an image, opens the lightbox on it.                                                                                                  |
| `ArrowRight`, `ArrowLeft` | In the lightbox: show the next or previous image, wrapping. They follow the text direction, so in RTL `ArrowLeft` shows the next image. |
| `Home`, `End`             | In the lightbox: show the first or last image.                                                                                          |
| `Escape`                  | Closes the lightbox and returns focus to the image that opened it.                                                                      |
| `Tab`, `Shift+Tab`        | Move between the lightbox's buttons. Focus stays in it while it's modal.                                                                |

- Every image needs `alt` text. A grid image's button is named by it, and the lightbox shows the same alt.
- The lightbox is a dialog named by its title: the counter and caption, announced as they change.
- Focus moves into the lightbox on open, is trapped there while `modal`, and returns to the image that opened it.
- The previous, next, close and download buttons have translatable accessible names.
- The thumbnail shown carries `aria-current` and a ring, not opacity alone.
- Keep captions as text, never baked into images. The previous and next icons mirror in RTL.

## Related

- [ImageGallery in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/image-gallery): anatomy, tokens and live examples.
- [ImageSlider](image-slider.md) for a full-width slideshow.
- [Carousel](carousel.md) for a row of cards.
- [Dialog](../layout/dialog.md) for other modal content.
