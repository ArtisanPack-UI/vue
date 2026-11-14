/**
 * Renders a DropdownMenu's `items` as the same children composition uses:
 * DropdownMenuItem, DropdownMenuGroup and DropdownMenuSeparator.
 *
 * @internal
 */
import { defineComponent, h, type PropType, type VNode } from 'vue';
import DropdownMenuGroup from './DropdownMenuGroup.vue';
import DropdownMenuItem from './DropdownMenuItem.vue';
import DropdownMenuSeparator from './DropdownMenuSeparator.vue';
import type { DropdownMenuEntry } from './types';

function renderEntries(entries: DropdownMenuEntry[], path: string): VNode[] {
  return entries.map((entry, index) => {
    const key = `${path}${index}`;
    if (entry.type === 'separator') return h(DropdownMenuSeparator, { key });
    if (entry.type === 'group') {
      return h(DropdownMenuGroup, { key, label: entry.label }, () =>
        renderEntries(entry.items, `${key}-`),
      );
    }
    const { label, ...item } = entry;
    return h(DropdownMenuItem, { key: `item-${entry.value}`, ...item }, () => label);
  });
}

export default defineComponent({
  name: 'DropdownMenuEntries',
  props: {
    entries: { type: Array as PropType<DropdownMenuEntry[]>, required: true },
  },
  setup(props) {
    return () => renderEntries(props.entries, '');
  },
});
