<script setup lang="ts">
import Carousel from './Carousel.vue';

const slides = [
  { id: '1', src: 'https://picsum.photos/seed/1/800/400', alt: 'Slide 1', caption: 'First slide caption' },
  { id: '2', src: 'https://picsum.photos/seed/2/800/400', alt: 'Slide 2', caption: 'Second slide caption' },
  { id: '3', src: 'https://picsum.photos/seed/3/800/400', alt: 'Slide 3', caption: 'Third slide caption' },
];
</script>

<template>
  <Story title="Display/Carousel" group="display">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstCheckbox v-model="state.showArrows" title="Show Arrows" />
        <HstCheckbox v-model="state.showIndicators" title="Show Indicators" />
      </template>

      <template #default="{ state }">
        <div style="max-width: 600px">
          <Carousel
            :slides="slides"
            :show-arrows="state.showArrows !== false"
            :show-indicators="state.showIndicators !== false"
          />
        </div>
      </template>
    </Variant>

    <Variant title="Without Controls">
      <div style="max-width: 600px">
        <Carousel :slides="slides" :show-arrows="false" :show-indicators="false" />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Carousel

An image carousel with navigation arrows and slide indicators.
</docs>
