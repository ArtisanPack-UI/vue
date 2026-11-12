<script setup lang="ts">
/**
 * @module ImageSlider
 *
 * One large image per view, rendering the design-system ImageSlider markup
 * contract (`.apui-image-slider`, #61) on the shared carousel machine
 * (`useCarousel`, scoped `image-slider`): a glass caption, a counter,
 * previous and next buttons, dots whose arrow keys follow the text
 * direction, optional autoplay with a pause button and thumbnails.
 */
import { computed, getCurrentInstance, mergeProps, ref, useAttrs } from 'vue';
import { useCarousel } from '@artisanpack-ui/behavior/vue';
import Button from '../../form/Button/Button.vue';
import { DsIcon, part, safeMediaUrl } from '../../_shared/design-system';
import type { ImageSliderPart, ImageSliderProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ImageSliderProps>(), {
  aspectRatio: '21 / 9',
  index: 0,
  loop: true,
  autoplay: false,
  interval: 5000,
  thumbnails: false,
  label: 'Photos',
  previousLabel: 'Previous photo',
  nextLabel: 'Next photo',
  indicatorLabel: 'Photo {index}',
  slideLabel: '{index} of {count}',
  counterLabel: '{index} / {count}',
  playLabel: 'Start slide rotation',
  pauseLabel: 'Stop slide rotation',
  classes: undefined,
});

const emit = defineEmits<{
  'index-change': [index: number];
}>();

const attrs = useAttrs();
const instance = getCurrentInstance();

/** Whether the parent passes `index`, so the slider shows only what it says. */
function isBound(): boolean {
  const raw = instance?.vnode.props;
  return !!raw && 'index' in raw;
}

const localIndex = ref(props.index);

const machine = useCarousel(() => ({
  slideCount: props.images.length,
  scope: 'image-slider',
  index: isBound() ? props.index : localIndex.value,
  loop: props.loop,
  autoplay: props.autoplay,
  interval: props.interval,
  labels: {
    previous: props.previousLabel,
    next: props.nextLabel,
    indicator: props.indicatorLabel,
    slide: props.slideLabel,
    progress: props.counterLabel,
    play: props.playLabel,
    pause: props.pauseLabel,
  },
  onIndexChange: ({ index }) => {
    if (!isBound()) localIndex.value = index;
    emit('index-change', index);
  },
}));

/** The machine's API, re-wrapped in this package's `computed` for the template type-check. */
const carousel = computed(() => machine.value);

function classOf(name: ImageSliderPart): string | undefined {
  return props.classes?.[name];
}

/** Behavior props for a part, plus its extra class. */
function withClass(own: unknown, name: ImageSliderPart): Record<string, unknown> {
  const attributes = own as Record<string, unknown>;
  const className = classOf(name);
  return className ? mergeProps(attributes, { class: className }) : attributes;
}

function rootAttrs(): Record<string, unknown> {
  const own = carousel.value.getRootProps() as Record<string, unknown>;
  return mergeProps(attrs, own, {
    class: ['apui-image-slider', props.classes?.root],
    'aria-label': props.label,
    style: { '--apui-_image-slider-ratio': props.aspectRatio },
  });
}
</script>

<template>
  <div v-bind="rootAttrs()">
    <div v-bind="part('image-slider', 'viewport', classOf('viewport'))">
      <div v-bind="withClass(carousel.getItemGroupProps(), 'itemGroup')">
        <div
          v-for="(image, i) in images"
          :key="i"
          v-bind="withClass(carousel.getItemProps({ index: i }), 'item')"
        >
          <img
            v-bind="part('image-slider', 'image', classOf('image'))"
            :src="safeMediaUrl(image.src)"
            :alt="image.alt ?? ''"
            :loading="i > 0 ? 'lazy' : undefined"
            decoding="async"
          />
          <div
            v-if="image.caption || image.description"
            v-bind="part('image-slider', 'caption', classOf('caption'))"
          >
            <p v-if="image.caption" v-bind="part('image-slider', 'title', classOf('title'))">
              {{ image.caption }}
            </p>
            <p
              v-if="image.description"
              v-bind="part('image-slider', 'description', classOf('description'))"
            >
              {{ image.description }}
            </p>
          </div>
        </div>
      </div>
      <span v-bind="withClass(carousel.getProgressTextProps(), 'progressText')">{{
        carousel.progressText
      }}</span>
      <Button
        variant="soft"
        color="neutral"
        icon-only
        leading-icon="chevron-left"
        v-bind="withClass(carousel.getPrevTriggerProps(), 'prevTrigger')"
      />
      <Button
        variant="soft"
        color="neutral"
        icon-only
        leading-icon="chevron-right"
        v-bind="withClass(carousel.getNextTriggerProps(), 'nextTrigger')"
      />
      <div v-bind="withClass(carousel.getIndicatorGroupProps(), 'indicatorGroup')">
        <button
          v-for="(_, i) in images"
          :key="i"
          v-bind="withClass(carousel.getIndicatorProps({ index: i }), 'indicator')"
        />
      </div>
      <button
        v-if="autoplay"
        v-bind="withClass(carousel.getAutoplayTriggerProps(), 'autoplayTrigger')"
      >
        <DsIcon :name="carousel.isPlaying ? 'pause' : 'play'" />
      </button>
    </div>
    <div v-if="thumbnails" v-bind="part('image-slider', 'thumbs', classOf('thumbs'))">
      <button
        v-for="(image, i) in images"
        :key="i"
        v-bind="withClass(carousel.getThumbProps({ index: i }), 'thumb')"
      >
        <img
          :src="safeMediaUrl(image.src)"
          :alt="image.alt ?? ''"
          loading="lazy"
          decoding="async"
        />
      </button>
    </div>
  </div>
</template>
