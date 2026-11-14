<script setup lang="ts">
import Card from '../../layout/Card/Card.vue';
import Carousel from './Carousel.vue';

const image = (fill: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="${fill}"/></svg>`,
  )}`;

const properties = [
  {
    image: image('#9db8cf'),
    alt: 'Cedarwood Estates',
    title: 'Cedarwood Estates',
    description: 'United States, New York',
  },
  {
    image: image('#5f8f7c'),
    alt: 'Lakeview Lofts',
    title: 'Lakeview Lofts',
    description: 'United States, Chicago',
  },
  {
    image: image('#c98f5e'),
    alt: 'Tranquil Oaks',
    title: 'Tranquil Oaks',
    description: 'Canada, Toronto',
  },
  {
    image: image('#e9b77a'),
    alt: 'Golden Hour',
    title: 'Golden Hour',
    description: 'United States, Denver',
  },
];

const quotes = [
  { text: 'Weekly digests replaced three spreadsheets for our team.' },
  { text: 'Tenants find what they need without calling us.' },
  { text: 'Setup took an afternoon.' },
];
</script>

<template>
  <Story title="Display/Carousel" group="display">
    <Variant title="Several per view, with a header">
      <Carousel title="Featured properties" :per-view="3" :slides="properties" />
    </Variant>
    <Variant title="Custom slides with overlay buttons">
      <Carousel label="Customer notes" :slides="quotes" loop>
        <template #slide="{ slide }">
          <Card :title="String(slide.text)" />
        </template>
      </Carousel>
    </Variant>
    <Variant title="Autoplay">
      <Carousel label="Featured" :slides="properties" autoplay loop />
    </Variant>
  </Story>
</template>
