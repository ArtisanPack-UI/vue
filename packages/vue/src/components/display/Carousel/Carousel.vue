<script setup lang="ts">
/** @module Carousel */
import { computed, ref, watch } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { CarouselProps } from './types';

const props = withDefaults(defineProps<CarouselProps>(), {
  showArrows: true,
  showIndicators: true,
  modelValue: 0,
});

const emit = defineEmits<{
  'update:modelValue': [index: number];
}>();

const activeIndex = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => {
    activeIndex.value = val;
  },
);

function goTo(index: number) {
  const total = props.slides.length;
  if (total === 0) return;
  activeIndex.value = ((index % total) + total) % total;
  emit('update:modelValue', activeIndex.value);
}

function prev() {
  goTo(activeIndex.value - 1);
}

function next() {
  goTo(activeIndex.value + 1);
}

const wrapperClasses = computed(() => cn('relative w-full overflow-hidden', props.className));
</script>

<template>
  <div
    :class="wrapperClasses"
    role="region"
    aria-roledescription="carousel"
    :aria-label="($attrs['aria-label'] as string) || 'Carousel'"
  >
    <div class="relative">
      <div
        v-for="(slide, index) in slides"
        :key="slide.id"
        :class="cn('w-full', index === activeIndex ? 'block' : 'hidden')"
        role="group"
        aria-roledescription="slide"
        :aria-label="`Slide ${index + 1} of ${slides.length}`"
        :aria-hidden="index !== activeIndex"
      >
        <slot name="slide" :slide="slide" :index="index" :is-active="index === activeIndex">
          <img
            v-if="slide.src"
            :src="slide.src"
            :alt="slide.alt || `Slide ${index + 1}`"
            class="w-full object-cover"
          />
          <p v-if="slide.caption" class="text-center py-2 text-sm text-base-content/70">
            {{ slide.caption }}
          </p>
        </slot>
      </div>
    </div>

    <!-- Navigation arrows -->
    <template v-if="showArrows && slides.length > 1">
      <button
        class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-base-100/80 hover:bg-base-100 text-base-content flex items-center justify-center text-lg shadow-sm backdrop-blur-sm transition-colors cursor-pointer"
        aria-label="Previous slide"
        @click="prev"
      >
        ‹
      </button>
      <button
        class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-base-100/80 hover:bg-base-100 text-base-content flex items-center justify-center text-lg shadow-sm backdrop-blur-sm transition-colors cursor-pointer"
        aria-label="Next slide"
        @click="next"
      >
        ›
      </button>
    </template>

    <!-- Dot indicators -->
    <div v-if="showIndicators && slides.length > 1" class="flex justify-center gap-2 py-2">
      <button
        v-for="(slide, index) in slides"
        :key="slide.id"
        :class="cn('w-2 h-2 rounded-full transition-colors', index === activeIndex ? 'bg-primary' : 'bg-base-300')"
        :aria-label="`Go to slide ${index + 1}`"
        :aria-current="index === activeIndex ? 'true' : undefined"
        @click="goTo(index)"
      />
    </div>
  </div>
</template>
