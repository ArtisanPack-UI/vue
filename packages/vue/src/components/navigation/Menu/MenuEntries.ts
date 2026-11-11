/**
 * Renders a Menu's `items` as the same children composition uses.
 *
 * @internal
 */
import { defineComponent, h, type PropType, type VNode } from 'vue';
import MenuItem from './MenuItem.vue';
import MenuSeparator from './MenuSeparator.vue';
import MenuSub from './MenuSub.vue';
import MenuTitle from './MenuTitle.vue';
import type { MenuItemData, MenuSubData } from './types';

function renderEntries(entries: MenuItemData[], path: string): VNode[] {
  return entries.map((entry, index) => {
    const position = `${path}${index}`;
    if (entry.type === 'separator') return h(MenuSeparator, { key: position });
    if (entry.type === 'title') return h(MenuTitle, { key: position }, () => entry.label);
    if ('items' in entry) {
      const { items, type: _type, key, open, ...sub } = entry as MenuSubData;
      const subKey = key ?? position;
      // `open` from data is the initial state, so the sub-menu keeps toggling.
      return h(MenuSub, { key: subKey, ...sub, defaultOpen: open }, () =>
        renderEntries(items, `${subKey}-`),
      );
    }
    const { label, type: _type, key, ...item } = entry;
    return h(MenuItem, { key: key ?? item.href ?? position, ...item }, () => label);
  });
}

export default defineComponent({
  name: 'MenuEntries',
  props: {
    entries: { type: Array as PropType<MenuItemData[]>, required: true },
  },
  setup(props) {
    return () => renderEntries(props.entries, '');
  },
});
