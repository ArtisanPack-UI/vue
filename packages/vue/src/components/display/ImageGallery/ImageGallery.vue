<script setup lang="ts">
/**
 * @module ImageGallery
 *
 * A grid of images that opens a lightbox, rendering the design-system
 * ImageGallery markup contract (`.apui-image-gallery`, #61). The lightbox is
 * the shared dialog machine (`useLightbox`): focus trap, Escape, scroll lock
 * and focus return, plus arrow keys that follow the text direction, Home,
 * End, a counter and thumbnails. The panel carries `.apui-lightbox` (D-019).
 */
import { computed, getCurrentInstance, mergeProps, ref, useAttrs } from 'vue';
import { lightboxCounter, useLightbox } from '@artisanpack-ui/behavior/vue';
import Button from '../../form/Button/Button.vue';
import { flag, part, safeMediaUrl } from '../../_shared/design-system';
import type { ImageGalleryImage, ImageGalleryPart, ImageGalleryProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ImageGalleryProps>(), {
  columns: 4,
  featured: false,
  lightbox: true,
  open: false,
  index: 0,
  downloadable: false,
  modal: true,
  portal: true,
  closeLabel: 'Close',
  previousLabel: 'Previous photo',
  nextLabel: 'Next photo',
  downloadLabel: 'Download',
  counterLabel: '{index} / {count}',
  thumbsLabel: 'Photos',
  classes: undefined,
});

const emit = defineEmits<{
  'update:open': [open: boolean];
  'index-change': [index: number];
}>();

const attrs = useAttrs();
const instance = getCurrentInstance();

/** Whether the parent passes a prop, so the gallery shows only what it says. */
function isBound(name: string): boolean {
  const raw = instance?.vnode.props;
  return !!raw && name in raw;
}

const localOpen = ref(props.open);
const localIndex = ref(props.index);

const machine = useLightbox(() => ({
  count: props.images.length,
  open: isBound('open') ? props.open : localOpen.value,
  index: isBound('index') ? props.index : localIndex.value,
  modal: props.modal,
  onOpenChange: ({ open }) => {
    if (!isBound('open')) localOpen.value = open;
    emit('update:open', open);
  },
  onIndexChange: ({ index }) => {
    if (!isBound('index')) localIndex.value = index;
    emit('index-change', index);
  },
}));

/** The machine's API, re-wrapped in this package's `computed` for the template type-check. */
const viewer = computed(() => machine.value);

const current = computed<ImageGalleryImage | undefined>(() => props.images[viewer.value.index]);

const title = computed(() => {
  const counter = lightboxCounter(props.counterLabel, viewer.value.index, props.images.length);
  const caption = current.value?.caption;
  return caption ? `${counter} · ${caption}` : counter;
});

function classOf(name: ImageGalleryPart): string | undefined {
  return props.classes?.[name];
}

/** Behavior props for a part, plus its extra class. */
function withClass(own: unknown, name: ImageGalleryPart): Record<string, unknown> {
  const attributes = own as Record<string, unknown>;
  const className = classOf(name);
  return className ? mergeProps(attributes, { class: className }) : attributes;
}

function rootAttrs(): Record<string, unknown> {
  return mergeProps(attrs, {
    class: ['apui-image-gallery', props.classes?.root],
    'data-scope': 'image-gallery',
    'data-part': 'root',
    'data-featured': flag(props.featured),
    style: { '--apui-_image-gallery-columns': String(props.columns) },
  });
}

function contentAttrs(): Record<string, unknown> {
  return mergeProps(viewer.value.getContentProps() as Record<string, unknown>, {
    class: ['apui-lightbox', props.classes?.content],
  });
}
</script>

<template>
  <div v-bind="rootAttrs()">
    <div v-bind="part('image-gallery', 'grid', classOf('grid'))">
      <figure
        v-for="(image, i) in images"
        :key="i"
        v-bind="part('image-gallery', 'item', classOf('item'))"
      >
        <button v-if="lightbox" v-bind="withClass(viewer.getTriggerProps({ index: i }), 'trigger')">
          <img
            v-bind="part('image-gallery', 'image', classOf('image'))"
            :src="safeMediaUrl(image.src)"
            :alt="image.alt ?? ''"
            loading="lazy"
            decoding="async"
          />
        </button>
        <img
          v-else
          v-bind="part('image-gallery', 'image', classOf('image'))"
          :src="safeMediaUrl(image.src)"
          :alt="image.alt ?? ''"
          loading="lazy"
          decoding="async"
        />
        <figcaption
          v-if="image.caption"
          v-bind="part('image-gallery', 'caption', classOf('caption'))"
        >
          {{ image.caption }}
        </figcaption>
      </figure>
    </div>
    <Teleport v-if="lightbox" to="body" :disabled="!portal">
      <div v-bind="withClass(viewer.getBackdropProps(), 'backdrop')" />
      <div v-bind="withClass(viewer.getPositionerProps(), 'positioner')">
        <div v-bind="contentAttrs()">
          <div v-bind="part('image-gallery', 'bar', classOf('bar'))">
            <h2 v-bind="withClass(viewer.getTitleProps(), 'title')" aria-live="polite">
              {{ title }}
            </h2>
            <Button
              v-if="downloadable"
              variant="ghost"
              color="neutral"
              size="sm"
              icon-only
              leading-icon="download"
              :href="current?.src"
              :aria-label="downloadLabel"
              v-bind="withClass(viewer.getDownloadProps(), 'download')"
            />
            <Button
              variant="ghost"
              color="neutral"
              size="sm"
              icon-only
              leading-icon="x"
              :aria-label="closeLabel"
              v-bind="withClass(viewer.getCloseTriggerProps(), 'closeTrigger')"
            />
          </div>
          <div v-bind="part('image-gallery', 'stage', classOf('stage'))">
            <img
              v-bind="withClass(viewer.getImageProps(), 'image')"
              :src="safeMediaUrl(current?.src)"
              :alt="current?.alt ?? ''"
            />
            <Button
              variant="soft"
              color="neutral"
              icon-only
              leading-icon="chevron-left"
              :aria-label="previousLabel"
              v-bind="withClass(viewer.getPrevTriggerProps(), 'prevTrigger')"
            />
            <Button
              variant="soft"
              color="neutral"
              icon-only
              leading-icon="chevron-right"
              :aria-label="nextLabel"
              v-bind="withClass(viewer.getNextTriggerProps(), 'nextTrigger')"
            />
          </div>
          <div
            v-bind="
              part('image-gallery', 'thumbs', classOf('thumbs'), {
                role: 'group',
                'aria-label': thumbsLabel,
              })
            "
          >
            <button
              v-for="(image, i) in images"
              :key="i"
              v-bind="withClass(viewer.getThumbProps({ index: i }), 'thumb')"
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
      </div>
    </Teleport>
  </div>
</template>
