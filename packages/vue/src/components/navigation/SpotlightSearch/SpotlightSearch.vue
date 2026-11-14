<script setup lang="ts">
/**
 * @module SpotlightSearch
 *
 * @deprecated Use Spotlight, the design-system replacement (#57).
 * SpotlightSearch is a thin alias that renders a Spotlight and maps its 2.x
 * props: `items` are grouped by their `group` into Spotlight `groups` (each
 * item's `id` becomes its `value`), `ariaLabel` → `label`, `className` →
 * `class`, and `select` still reports the 2.x item. ⌘K / Ctrl+K toggles it,
 * as before. The 2.x `item` slot is gone: results render from the items.
 * Every other attribute, including Spotlight's own props, passes through.
 */
import { computed, getCurrentInstance } from 'vue';
import Spotlight from '../Spotlight/Spotlight.vue';
import { warnOnce } from '../../_shared/design-system';
import type { SpotlightGroup, SpotlightResult } from '../Spotlight/types';
import type { SpotlightItem, SpotlightSearchProps } from './types';

const props = withDefaults(defineProps<SpotlightSearchProps>(), {
  open: false,
  placeholder: 'Search…',
  ariaLabel: 'Search',
  className: undefined,
});

const emit = defineEmits<{
  'update:open': [value: boolean];
  select: [item: SpotlightItem];
}>();

warnOnce('SpotlightSearch', 'SpotlightSearch is deprecated; use Spotlight.');

const instance = getCurrentInstance();

/** `open` only when the parent passes it, so an unbound palette keeps its own state. */
const openBinding = computed(() => {
  const raw = instance?.vnode.props;
  return raw && 'open' in raw ? { open: props.open } : {};
});

/** The 2.x items as Spotlight groups, in first-seen group order; ungrouped items first. */
const groups = computed<SpotlightGroup[]>(() => {
  const byName = new Map<string, SpotlightGroup>();
  for (const item of props.items) {
    const name = item.group ?? '';
    let group = byName.get(name);
    if (!group) {
      group = { id: name || 'ungrouped', label: name || undefined, items: [] };
      byName.set(name, group);
    }
    group.items.push({
      value: item.id,
      label: item.label,
      description: item.description,
      disabled: item.disabled,
    });
  }
  const ungrouped = byName.get('');
  const named = [...byName.entries()].filter(([name]) => name !== '').map(([, group]) => group);
  return ungrouped ? [ungrouped, ...named] : named;
});

/** Reports the 2.x item that was chosen. */
function onSelect(result: SpotlightResult & { value: string }): void {
  const item = props.items.find((candidate) => candidate.id === result.value);
  if (item) emit('select', item);
}
</script>

<template>
  <Spotlight
    v-bind="openBinding"
    :groups="groups"
    :label="ariaLabel"
    :placeholder="placeholder"
    :class="className"
    @update:open="emit('update:open', $event)"
    @select="onSelect"
  />
</template>
