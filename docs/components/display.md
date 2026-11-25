---
title: Display
menu_order: 40
meta_description: The Vue display components. Avatars, badges, carousels, code, diffs, image galleries and sliders, KPI cards, progress, sparklines, stats and timelines.
---

# Display

Presentational components that show content and values: people, labels, code, images, metrics, progress and event histories. Import them from `@artisanpack-ui/vue/display` or from the package root.

```ts
import { Avatar, Badge, Stat } from '@artisanpack-ui/vue/display';
```

- [Avatar](display/avatar.md): a person or organization as an image, initials or an icon. Includes `AvatarGroup`.
- [Badge](display/badge.md): a small, non-interactive label for a status, category or count.
- [Carousel](display/carousel.md): scroll-snapped slides of cards with buttons, dots and autoplay.
- [Code](display/code.md): read-only code with a header, line numbers, highlights and a copy button.
- [Diff](display/diff.md): the changes between two versions of a text, unified or side by side.
- [ImageGallery](display/image-gallery.md): a grid of images that opens a lightbox.
- [ImageSlider](display/image-slider.md): one large image per view with captions, dots and thumbnails.
- [KpiCard](display/kpi-card.md): a headline metric in a card, with a sparkline and a target.
- [Progress](display/progress.md): a linear progress bar, determinate, indeterminate or segmented.
- [ProgressRadial](display/progress-radial.md): circular progress with the value in the center.
- [Sparkline](display/sparkline.md): a word-sized trend drawn as inline SVG.
- [Stat](display/stat.md): a headline number with its label, change and context.
- [Timeline](display/timeline.md): events in order, as data or composed. Includes `TimelineItem`.

## Shared behavior

- Every component takes `classes`, an object of extra classes per part, such as `{ label: 'tracking-wide' }`. Parts carry `data-scope` and `data-part` attributes you can target in CSS. Use `class` for the root.
- Built-in text, such as accessible names, button labels and counters, is translated. Every string has a prop to replace it, and templates such as `'{index} of {count}'` keep their placeholders.
- Image URLs (Avatar, Carousel, ImageGallery, ImageSlider) accept relative, `http`, `https` and `data:image/` URLs. Any other scheme is dropped.
- Code, Diff and Sparkline stay left-to-right in every direction. Headers, buttons and arrow keys elsewhere follow the text direction.
- Progress, ProgressRadial and Stat accept `modelValue` as an alias of `value`, but they never emit `update:modelValue`. They're displays, so `v-model` only passes the value in.
- Carousel, ImageSlider and ImageGallery are controlled when you pass `index`: they show only what it says and report moves through `@index-change`.

## Related

- [Data](data.md) for tables, charts and calendars.
- [Components](../components.md) for every category and the Vue-specific conventions.
