<script setup lang="ts">
/**
 * @module InertiaBreadcrumbs
 *
 * The design-system Breadcrumbs (`.apui-breadcrumbs`) with its links
 * rendered as Inertia `Link`s. Takes `items` (`{ label, href? }`): the last
 * item is the current page, never a link. The scoped `item` slot
 * (`{ item, index, isLast }`) replaces an item's text. `className` and every
 * other attribute, including Breadcrumbs' own props (`label`, `maxItems`,
 * `overflowLabel`, `classes`), go to the Breadcrumbs.
 */
import type { FunctionalComponent, VNode } from 'vue';
import { Link } from '@inertiajs/vue3';
import { Breadcrumbs, BreadcrumbsItem } from '@artisanpack-ui/vue';

/** One level of the trail. */
interface InertiaBreadcrumbItem {
  /** The level's name. */
  label: string;
  /** The Inertia URL it visits. Ignored on the last item, the current page. */
  href?: string;
}

const props = defineProps<{
  /** The trail, from the section down to the current page. */
  items: InertiaBreadcrumbItem[];
  /** Additional CSS classes for the Breadcrumbs root. */
  className?: string;
}>();

defineSlots<{
  /** Replaces an item's text. */
  item?: (props: { item: InertiaBreadcrumbItem; index: number; isLast: boolean }) => unknown;
}>();

/**
 * A level's content inside the Inertia link: the composed item's slot (where
 * the `item` slot renders), else its label.
 */
const LinkLabel: FunctionalComponent<{ level: { label: string; labelSlot?: () => unknown } }> = ({
  level,
}) => (level.labelSlot?.() as VNode[] | undefined) ?? level.label;
LinkLabel.props = ['level'];
</script>

<template>
  <Breadcrumbs :class="props.className">
    <BreadcrumbsItem
      v-for="(item, index) in props.items"
      :key="`${index}-${item.label}`"
      :label="item.label"
      :href="item.href"
    >
      <slot name="item" :item="item" :index="index" :is-last="index === props.items.length - 1">
        {{ item.label }}
      </slot>
    </BreadcrumbsItem>
    <template #link="{ item, href, attrs }">
      <Link :href="href" v-bind="attrs"><LinkLabel :level="item" /></Link>
    </template>
  </Breadcrumbs>
</template>
