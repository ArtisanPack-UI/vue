<script setup lang="ts">
import ImageSlider from './ImageSlider.vue';

const svg = (fill: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="${fill}"/></svg>`,
  )}`;

const images = [
  {
    src: svg('#e4eef6'),
    alt: 'Lake view from unit 4A',
    caption: 'Lake view from 4A',
    description: 'South-facing, 11th floor · Lakeview Lofts, Chicago',
  },
  { src: svg('#f6d9a8'), alt: 'Sunrise over the ridge', caption: 'Sunrise over the ridge' },
  { src: svg('#cfe3e0'), alt: 'Courtyard garden with benches' },
  { src: svg('#1d2b44'), alt: 'The street at night', caption: 'Street at night' },
];
</script>

<template>
  <Story title="Display/ImageSlider" group="display">
    <Variant title="Default">
      <div style="padding: 16px">
        <ImageSlider :images="images" label="Lakeview Lofts photos" />
      </div>
    </Variant>
    <Variant title="Thumbnails and autoplay">
      <div style="padding: 16px">
        <ImageSlider :images="images" aspect-ratio="16 / 9" thumbnails autoplay />
      </div>
    </Variant>
  </Story>
</template>
