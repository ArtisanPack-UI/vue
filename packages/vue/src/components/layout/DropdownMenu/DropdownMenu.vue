<script setup lang="ts">
/**
 * @module DropdownMenu
 *
 * A list of actions or options anchored to a trigger button. Renders the
 * design-system DropdownMenu markup contract (`.apui-dropdown-menu`, #50)
 * on the shared Zag menu machine (`useDropdownMenu`): arrow keys,
 * typeahead, Escape and outside-click dismissal, and a positioned panel.
 * Replaces Dropdown.
 */
import { computed, getCurrentInstance, mergeProps, provide, ref, useAttrs } from 'vue';
import { useDropdownMenu } from '@artisanpack-ui/behavior/vue';
import Button from '../../form/Button/Button.vue';
import DropdownMenuEntries from './DropdownMenuEntries';
import { DROPDOWN_MENU_KEY, type DropdownMenuItemRegistration } from './keys';
import type { DropdownMenuCheckedChange, DropdownMenuPart, DropdownMenuProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DropdownMenuProps>(), {
  open: false,
  label: undefined,
  items: undefined,
  align: 'start',
  surface: 'overlay',
  portal: true,
  classes: undefined,
});

const emit = defineEmits<{
  'update:open': [open: boolean];
  select: [value: string];
  'checked-change': [details: DropdownMenuCheckedChange];
}>();

const attrs = useAttrs();
const instance = getCurrentInstance();

/**
 * Whether the parent passes `open`. Then the menu is controlled: it reports
 * changes through `update:open` and shows only what the prop says, so a
 * parent that ignores or vetoes a change (or passes a static `:open="true"`)
 * keeps it where it is. Otherwise it keeps its own state. (`defineModel`
 * would fall back to local state when `open` is passed without a listener,
 * letting the shown state drift from the prop.)
 */
function isBound(): boolean {
  const raw = instance?.vnode.props;
  return !!raw && 'open' in raw;
}

/** The state when unbound. */
const localOpen = ref(props.open);

/** What the widget shows. */
function shownOpen(): boolean {
  return isBound() ? props.open : localOpen.value;
}

/** The items rendered in this menu, by value. */
const registry = new Map<string, DropdownMenuItemRegistration>();

const machine = useDropdownMenu(() => ({
  open: shownOpen(),
  align: props.align,
  onOpenChange: ({ open }) => {
    if (!isBound()) localOpen.value = open;
    emit('update:open', open);
  },
  // Zag reports every chosen item here, checkbox and radio items too;
  // `select` is for action items only.
  onSelect: ({ value }) => {
    const item = registry.get(value);
    if (item && item.type !== 'item') return;
    item?.onSelect();
    emit('select', value);
  },
}));

/**
 * The machine's API, re-wrapped in this package's `computed`: the
 * composable's ref is typed by the design system's copy of Vue, which the
 * template type-check wouldn't unwrap.
 */
const menu = computed(() => machine.value);

function classOf(name: DropdownMenuPart): string | undefined {
  return props.classes?.[name];
}

provide(DROPDOWN_MENU_KEY, {
  api: () => menu.value,
  classOf,
  register(value, registration) {
    registry.set(value, registration);
    return () => {
      if (registry.get(value) === registration) registry.delete(value);
    };
  },
  checkedChange(value, checked) {
    emit('checked-change', { value, checked });
  },
});

/** Zag's props for a part, plus its extra class. */
function withClass(zagProps: unknown, className: string | undefined): Record<string, unknown> {
  const own = zagProps as Record<string, unknown>;
  return className ? mergeProps(own, { class: className }) : own;
}

/** The panel: Zag's content part, carrying the root class and every attribute (D-019). */
function contentAttrs(): Record<string, unknown> {
  return mergeProps(attrs, menu.value.getContentProps() as Record<string, unknown>, {
    class: ['apui-dropdown-menu', props.classes?.root, props.classes?.content],
    'data-align': props.align,
    'data-surface': props.surface,
  });
}
</script>

<template>
  <Button
    variant="outline"
    color="neutral"
    trailing-icon="chevron-down"
    v-bind="withClass(menu.getTriggerProps(), classOf('trigger'))"
  >
    <slot name="label">{{ label }}</slot>
  </Button>
  <Teleport to="body" :disabled="!portal">
    <div v-bind="withClass(menu.getPositionerProps(), classOf('positioner'))">
      <div v-bind="contentAttrs()">
        <DropdownMenuEntries v-if="items" :entries="items" />
        <slot />
      </div>
    </div>
  </Teleport>
</template>
