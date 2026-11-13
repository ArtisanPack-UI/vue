<script setup lang="ts">
/**
 * @module Carousel
 *
 * Scroll-snapped slides with previous and next buttons, position dots and
 * optional autoplay with a pause button, rendering the design-system
 * Carousel markup contract (`.apui-carousel`, #65) on the shared carousel
 * machine (`useCarousel`, scoped `carousel`, the one ImageSlider runs on,
 * D-041). `perView` shows several slides at once with the next one peeking.
 * Each slide is a Card unless the `#slide="{ slide, index }"` slot draws it;
 * a slide's `id` keys it, so reordered slides keep their own state. The
 * autoplay button comes first in the Tab order.
 */
import { computed, getCurrentInstance, mergeProps, ref, useAttrs } from 'vue';
import { carouselPageCount, useCarousel } from '@artisanpack-ui/behavior/vue';
import Button from '../../form/Button/Button.vue';
import Card from '../../layout/Card/Card.vue';
import { DsIcon, part } from '../../_shared/design-system';
import type { CarouselPart, CarouselProps, CarouselSlide } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CarouselProps>(), {
  perView: 1,
  index: 0,
  loop: false,
  autoplay: false,
  interval: 5000,
  title: undefined,
  headingLevel: 3,
  label: undefined,
  previousLabel: 'Previous slide',
  nextLabel: 'Next slide',
  indicatorLabel: 'Go to slide {index}',
  slideLabel: '{index} of {count}',
  playLabel: 'Start slide rotation',
  pauseLabel: 'Stop slide rotation',
  classes: undefined,
});

const emit = defineEmits<{
  'index-change': [index: number];
}>();

defineSlots<{
  slide?: (scope: { slide: CarouselSlide; index: number }) => unknown;
}>();

const attrs = useAttrs();
const instance = getCurrentInstance();

/** Whether the parent passes `index`, so the carousel shows only what it says. */
function isBound(): boolean {
  const raw = instance?.vnode.props;
  return !!raw && 'index' in raw;
}

const localIndex = ref(props.index);
const view = computed(() => Math.max(1, Math.floor(props.perView)));
const pages = computed(() => carouselPageCount(props.slides.length, view.value));
const hasTitle = computed(() => typeof props.title === 'string' && props.title !== '');
const headingTag = computed(() => `h${Math.min(6, Math.max(2, Math.floor(props.headingLevel)))}`);
const navVariant = computed(() => (hasTitle.value ? 'outline' : 'soft'));

const machine = useCarousel(() => ({
  slideCount: props.slides.length,
  perView: view.value,
  spacing: '12px',
  scope: 'carousel',
  index: isBound() ? props.index : localIndex.value,
  loop: props.loop,
  autoplay: props.autoplay,
  interval: props.interval,
  labels: {
    previous: props.previousLabel,
    next: props.nextLabel,
    indicator: props.indicatorLabel,
    slide: props.slideLabel,
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

function classOf(name: CarouselPart): string | undefined {
  return props.classes?.[name];
}

/** Behavior props for a part, plus its extra class. */
function withClass(own: unknown, name: CarouselPart): Record<string, unknown> {
  const attributes = own as Record<string, unknown>;
  const className = classOf(name);
  return className ? mergeProps(attributes, { class: className }) : attributes;
}

const text = (value: unknown): string | undefined =>
  typeof value === 'string' && value !== '' ? value : undefined;

/**
 * Each slide's key: its `id` when every slide has a distinct string or number
 * one, so reordered slides keep their own `#slide` state; else its position.
 * Ids and positions are prefixed apart, so a position never matches an id
 * when slides gain or lose their ids.
 */
const slideKeys = computed<string[]>(() => {
  const ids = props.slides.map((slide) => slide?.id);
  const usable =
    ids.every((id) => (typeof id === 'string' && id !== '') || typeof id === 'number') &&
    new Set(ids).size === ids.length;
  return usable
    ? ids.map((id) => `${typeof id === 'number' ? 'number' : 'string'}:${id}`)
    : props.slides.map((_, i) => `position:${i}`);
});

function rootAttrs(): Record<string, unknown> {
  const own = carousel.value.getRootProps() as Record<string, unknown>;
  return mergeProps(attrs, own, {
    class: ['apui-carousel', props.classes?.root],
    // A caller's own aria-label wins over the title and the generic name.
    'aria-label': props.label || text(attrs['aria-label']) || props.title || 'Carousel',
  });
}

/** The default Card's props for a slide; the 2.x `src` and `caption` still work. */
function card(slide: CarouselSlide): Record<string, unknown> {
  return {
    media: text(slide.image) ?? text(slide.src),
    mediaAlt: text(slide.alt) ?? '',
    title: text(slide.title) ?? text(slide.caption),
    description: text(slide.description),
    href: text(slide.href),
  };
}
</script>

<template>
  <div v-bind="rootAttrs()">
    <!-- First in the Tab order, before the rotating slides; CSS places it over the viewport. -->
    <button
      v-if="autoplay"
      v-bind="withClass(carousel.getAutoplayTriggerProps(), 'autoplayTrigger')"
    >
      <DsIcon :name="carousel.isPlaying ? 'pause' : 'play'" />
    </button>
    <div v-if="hasTitle" v-bind="part('carousel', 'header', classOf('header'))">
      <component :is="headingTag" v-bind="part('carousel', 'title', classOf('title'))">
        {{ title }}
      </component>
      <Button
        :variant="navVariant"
        color="neutral"
        size="sm"
        icon-only
        leading-icon="chevron-left"
        v-bind="withClass(carousel.getPrevTriggerProps(), 'prevTrigger')"
      />
      <Button
        :variant="navVariant"
        color="neutral"
        size="sm"
        icon-only
        leading-icon="chevron-right"
        v-bind="withClass(carousel.getNextTriggerProps(), 'nextTrigger')"
      />
    </div>
    <div v-bind="part('carousel', 'viewport', classOf('viewport'))">
      <div v-bind="withClass(carousel.getItemGroupProps(), 'itemGroup')" tabindex="0">
        <div
          v-for="(slide, i) in slides"
          :key="slideKeys[i]"
          v-bind="withClass(carousel.getItemProps({ index: i }), 'item')"
        >
          <slot name="slide" :slide="slide" :index="i">
            <Card v-bind="card(slide)" />
          </slot>
        </div>
      </div>
      <template v-if="!hasTitle">
        <Button
          :variant="navVariant"
          color="neutral"
          size="sm"
          icon-only
          leading-icon="chevron-left"
          v-bind="withClass(carousel.getPrevTriggerProps(), 'prevTrigger')"
        />
        <Button
          :variant="navVariant"
          color="neutral"
          size="sm"
          icon-only
          leading-icon="chevron-right"
          v-bind="withClass(carousel.getNextTriggerProps(), 'nextTrigger')"
        />
      </template>
    </div>
    <div v-if="pages > 1" v-bind="withClass(carousel.getIndicatorGroupProps(), 'indicatorGroup')">
      <button
        v-for="i in pages"
        :key="i"
        v-bind="withClass(carousel.getIndicatorProps({ index: i - 1 }), 'indicator')"
      />
    </div>
  </div>
</template>
