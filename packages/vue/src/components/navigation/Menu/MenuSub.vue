<script setup lang="ts">
/**
 * @module MenuSub
 *
 * A collapsible group of items in a Menu: its item is a button with
 * `aria-expanded` and `aria-controls` (the disclosure pattern) and its
 * items sit in a nested list. It opens on its own when it holds the current
 * page. With the Menu's `collapsible` off, the item is a heading and the
 * list always shows.
 */
import { getCurrentInstance, inject, nextTick, ref, useId, useSlots } from 'vue';
import { DsIcon, part } from '../../_shared/design-system';
import { MENU_KEY } from './keys';
import { holdsCurrent } from './current';
import type { MenuSubProps } from './types';

const props = withDefaults(defineProps<MenuSubProps>(), {
  icon: undefined,
  badge: undefined,
  disabled: false,
  open: undefined,
  defaultOpen: undefined,
});

const emit = defineEmits<{ 'update:open': [open: boolean] }>();

const menu = inject(MENU_KEY);
if (!menu) throw new Error('[@artisanpack-ui/vue] MenuSub must be inside a Menu.');

const slots = useSlots();
const instance = getCurrentInstance();
const id = useId();

/** Controlled only when `open` is a boolean: `:open="undefined"` leaves it its own state. */
function isBound(): boolean {
  const raw = instance?.vnode.props;
  return !!raw && raw.open !== undefined && raw.open !== null;
}

/** The state when unbound: `defaultOpen`, else open while it holds the current page. */
const localOpen = ref<boolean | null>(props.defaultOpen ?? null);

/** Whether it held the current page last render, to open it when that changes. */
let heldCurrent: boolean | undefined;

function isOpen(): boolean {
  if (!menu!.collapsible()) return true;
  const current = holdsCurrent(slots.default?.());
  const becameCurrent = current && heldCurrent === false;
  heldCurrent = current;
  if (becameCurrent) {
    // An item inside became current (navigating in a persistent layout): open.
    if (!isBound()) localOpen.value = true;
    void nextTick(() => emit('update:open', true));
  }
  if (isBound()) return Boolean(props.open);
  return localOpen.value ?? current;
}

function toggle(): void {
  if (props.disabled) return;
  const next = !isOpen();
  if (!isBound()) localOpen.value = next;
  emit('update:open', next);
}
</script>

<template>
  <li>
    <button
      v-if="menu!.collapsible()"
      type="button"
      v-bind="part('menu', 'item', menu!.classOf('item'))"
      :aria-expanded="isOpen() ? 'true' : 'false'"
      :aria-controls="id"
      :disabled="disabled || undefined"
      :aria-disabled="disabled ? 'true' : undefined"
      @click="toggle"
    >
      <span
        v-if="icon"
        v-bind="part('menu', 'icon', menu!.classOf('icon'), { 'aria-hidden': 'true' })"
        ><DsIcon :name="icon"
      /></span>
      <span v-bind="part('menu', 'item-text', menu!.classOf('itemText'))">{{ label }}</span>
      <span
        v-if="badge !== undefined && badge !== null && badge !== ''"
        v-bind="part('menu', 'badge', menu!.classOf('badge'))"
        >{{ badge }}</span
      >
      <span
        v-bind="
          part('menu', 'chevron', menu!.classOf('chevron'), {
            'aria-hidden': 'true',
            'data-mirror': '',
          })
        "
        ><DsIcon name="chevron-right"
      /></span>
    </button>
    <span v-else v-bind="part('menu', 'item', menu!.classOf('item'))">
      <span
        v-if="icon"
        v-bind="part('menu', 'icon', menu!.classOf('icon'), { 'aria-hidden': 'true' })"
        ><DsIcon :name="icon"
      /></span>
      <span v-bind="part('menu', 'item-text', menu!.classOf('itemText'))">{{ label }}</span>
    </span>
    <ul :id="id" v-bind="part('menu', 'sub', menu!.classOf('sub'))" :hidden="!isOpen()">
      <slot />
    </ul>
  </li>
</template>
