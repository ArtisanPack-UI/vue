<script setup lang="ts">
/**
 * @module Breadcrumbs
 *
 * Shows where the current page sits in the hierarchy. Renders the
 * design-system Breadcrumbs markup contract (`.apui-breadcrumbs`, #56): a nav
 * landmark with an ordered list, from `items` and then BreadcrumbsItem
 * children, the current page last (never a link), and an overflow button
 * that reveals collapsed middle levels.
 */
import {
  camelize,
  Fragment,
  isVNode,
  mergeProps,
  nextTick,
  ref,
  useSlots,
  type FunctionalComponent,
  type VNode,
  type VNodeArrayChildren,
} from 'vue';
import { DsIcon, part, safeHref } from '../../_shared/design-system';
import BreadcrumbsItem from './BreadcrumbsItem.vue';
import type { BreadcrumbItem, BreadcrumbsProps } from './types';

const props = withDefaults(defineProps<BreadcrumbsProps>(), {
  items: () => [],
  maxItems: 4,
  label: 'Breadcrumb',
  overflowLabel: 'Show {count} more levels',
  classes: undefined,
});

defineSlots<{
  /** BreadcrumbsItem children, after `items`. */
  default?: () => unknown;
  /** Renders a router link instead of the anchor; bind `attrs` on it. */
  link?: (props: { item: BreadcrumbItem; href: string; attrs: Record<string, unknown> }) => unknown;
}>();

/** A level: an item, or a composed child with its label slot and link attributes. */
interface Level extends BreadcrumbItem {
  labelSlot?: () => unknown;
  attributes?: Record<string, unknown>;
}

const slots = useSlots();
const expanded = ref(false);
const list = ref<HTMLOListElement | null>(null);

function flatten(children: VNodeArrayChildren): VNode[] {
  return children.flatMap((child) => {
    if (!isVNode(child)) return Array.isArray(child) ? flatten(child) : [];
    if (child.type === Fragment) return flatten((child.children as VNodeArrayChildren) ?? []);
    return [child];
  });
}

/** `items`, then the BreadcrumbsItem children. Read on every render. */
function levels(): Level[] {
  const composed = flatten((slots.default?.() as VNodeArrayChildren) ?? [])
    .filter((vnode) => vnode.type === BreadcrumbsItem)
    .map((vnode) => {
      const raw = Object.fromEntries(
        Object.entries(vnode.props ?? {}).map(([key, value]) => [camelize(key), value]),
      );
      const { label, href, icon, hideLabel, ...attributes } = raw;
      const children = vnode.children as { default?: () => unknown } | null;
      return {
        label: String(label ?? ''),
        href: href as string | undefined,
        icon: icon as string | undefined,
        hideLabel: hideLabel === true || hideLabel === '',
        labelSlot: children?.default,
        attributes,
      } satisfies Level;
    });
  return [...props.items, ...composed];
}

/** Renders a level's label: its slot, else its text. */
const LevelLabel: FunctionalComponent<{ level: Level }> = ({ level }) =>
  (level.labelSlot?.() as VNode[] | undefined) ?? level.label;
LevelLabel.props = ['level'];

/** The first and last index that start collapsed, or null when the trail fits. */
function range(count: number): [number, number] | null {
  if (props.maxItems <= 0 || count <= props.maxItems) return null;
  const last = count - Math.max(1, props.maxItems - 2) - 1;
  return last >= 1 ? [1, last] : null;
}

function isCollapsed(index: number, count: number): boolean {
  const collapsed = range(count);
  return collapsed !== null && index >= collapsed[0] && index <= collapsed[1];
}

function hiddenCount(count: number): number {
  const collapsed = range(count);
  return collapsed ? collapsed[1] - collapsed[0] + 1 : 0;
}

const hrefOf = (level: Level, index: number, count: number) =>
  index === count - 1 ? undefined : safeHref(level.href);

async function reveal() {
  expanded.value = true;
  await nextTick();
  list.value?.querySelector<HTMLElement>('[data-collapsed] a')?.focus();
}
</script>

<template>
  <nav :class="['apui-breadcrumbs', classes?.root]" :aria-label="label">
    <ol ref="list" v-bind="part('breadcrumbs', 'list', classes?.list)">
      <template v-for="all in [levels()]" :key="all.length">
        <template v-for="(item, index) in all" :key="index">
          <li
            v-if="range(all.length) !== null && index === 1"
            v-bind="part('breadcrumbs', 'item', classes?.item)"
            :hidden="expanded || undefined"
          >
            <span
              v-bind="
                part('breadcrumbs', 'separator', classes?.separator, {
                  'aria-hidden': 'true',
                  'data-mirror': '',
                })
              "
              ><DsIcon name="chevron-right"
            /></span>
            <button
              type="button"
              v-bind="part('breadcrumbs', 'overflow', classes?.overflow)"
              :aria-label="overflowLabel.replace('{count}', String(hiddenCount(all.length)))"
              :aria-expanded="expanded ? 'true' : 'false'"
              @click="reveal"
            >
              <DsIcon name="ellipsis" />
            </button>
          </li>
          <li
            v-bind="part('breadcrumbs', 'item', classes?.item)"
            :hidden="(isCollapsed(index, all.length) && !expanded) || undefined"
            :data-collapsed="isCollapsed(index, all.length) ? '' : undefined"
          >
            <span
              v-if="index > 0"
              v-bind="
                part('breadcrumbs', 'separator', classes?.separator, {
                  'aria-hidden': 'true',
                  'data-mirror': '',
                })
              "
              ><DsIcon name="chevron-right"
            /></span>
            <span
              v-if="index === all.length - 1"
              v-bind="part('breadcrumbs', 'current', classes?.current, { 'aria-current': 'page' })"
              ><DsIcon v-if="item.icon" :name="item.icon" /><span
                v-if="item.hideLabel"
                class="apui-sr-only"
                ><LevelLabel :level="item" /></span
              ><LevelLabel v-else :level="item"
            /></span>
            <template v-else-if="hrefOf(item, index, all.length) !== undefined">
              <slot
                name="link"
                :item="item"
                :href="hrefOf(item, index, all.length)!"
                :attrs="part('breadcrumbs', 'link', classes?.link)"
              >
                <a
                  v-bind="
                    mergeProps(item.attributes ?? {}, part('breadcrumbs', 'link', classes?.link))
                  "
                  :href="hrefOf(item, index, all.length)"
                  ><DsIcon v-if="item.icon" :name="item.icon" /><span
                    v-if="item.hideLabel"
                    class="apui-sr-only"
                    ><LevelLabel :level="item" /></span
                  ><LevelLabel v-else :level="item"
                /></a>
              </slot>
            </template>
            <span v-else
              ><DsIcon v-if="item.icon" :name="item.icon" /><span
                v-if="item.hideLabel"
                class="apui-sr-only"
                ><LevelLabel :level="item" /></span
              ><LevelLabel v-else :level="item"
            /></span>
          </li>
        </template>
      </template>
    </ol>
  </nav>
</template>
