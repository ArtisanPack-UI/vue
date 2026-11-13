<script setup lang="ts">
import ImageGallery from './ImageGallery.vue';

const svg = (fill: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="${fill}"/></svg>`,
  )}`;

const images = [
  { src: svg('#f6d9a8'), alt: 'Sunrise over the ridge', caption: 'Sunrise over the ridge' },
  { src: svg('#cfe3e0'), alt: 'Courtyard garden with benches', caption: 'Courtyard garden' },
  { src: svg('#e8b49a'), alt: 'The west facade at dusk', caption: 'Evening, west façade' },
  { src: svg('#e4eef6'), alt: 'Lake view from unit 4A', caption: 'Lake view from 4A' },
  { src: svg('#f4e2c4'), alt: 'Rooftop terrace', caption: 'Rooftop terrace' },
  { src: svg('#1d2b44'), alt: 'The street at night', caption: 'Street at night' },
];
</script>

<template>
  <Story title="Display/ImageGallery" group="display">
    <Variant title="Grid">
      <div style="padding: 16px">
        <ImageGallery :images="images" />
      </div>
    </Variant>
    <Variant title="Featured, lightbox open">
      <div style="padding: 16px">
        <ImageGallery
          :images="images"
          featured
          downloadable
          :open="true"
          :index="2"
          :portal="false"
          :modal="false"
        />
      </div>
    </Variant>
  </Story>
</template>
