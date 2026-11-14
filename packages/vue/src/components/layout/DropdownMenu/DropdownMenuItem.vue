<script setup lang="ts">
/**
 * @module DropdownMenuItem
 *
 * An action, checkbox or radio item in a DropdownMenu: `role` menuitem,
 * menuitemcheckbox or menuitemradio. The default slot is the label.
 * Attributes and listeners go to the item, so a `@click` runs from the
 * keyboard too: choosing an item clicks it.
 */
import { inject, mergeProps, onBeforeUnmount, useAttrs, watch } from 'vue';
import { DsIcon, part } from '../../_shared/design-system';
import { DROPDOWN_MENU_KEY } from './keys';
import type { DropdownMenuCheckedChange, DropdownMenuItemProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DropdownMenuItemProps>(), {
  icon: undefined,
  shortcut: undefined,
  color: undefined,
  disabled: false,
  type: 'item',
  checked: false,
});

const emit = defineEmits<{
  select: [value: string];
  'checked-change': [details: DropdownMenuCheckedChange];
}>();

const attrs = useAttrs();
const menu = inject(DROPDOWN_MENU_KEY);
if (!menu) throw new Error('[@artisanpack-ui/vue] DropdownMenuItem must be inside a DropdownMenu.');

const registration = {
  get type() {
    return props.type;
  },
  onSelect: () => emit('select', props.value),
};

/** Registered under the current value, so the menu routes its callbacks here. */
let unregister = menu.register(props.value, registration);
watch(
  () => props.value,
  (value) => {
    unregister();
    unregister = menu!.register(value, registration);
  },
);
onBeforeUnmount(() => unregister());

function isOption(): boolean {
  return props.type === 'checkbox' || props.type === 'radio';
}

function onCheckedChange(checked: boolean): void {
  emit('checked-change', { value: props.value, checked });
  menu!.checkedChange(props.value, checked);
}

function optionProps() {
  return {
    type: props.type as 'checkbox' | 'radio',
    value: props.value,
    checked: props.checked,
    disabled: props.disabled,
    onCheckedChange,
  };
}

function itemAttrs(): Record<string, unknown> {
  const api = menu!.api();
  const zagProps = isOption()
    ? api.getOptionItemProps(optionProps())
    : api.getItemProps({ value: props.value, disabled: props.disabled });
  return mergeProps(attrs, zagProps as Record<string, unknown>, {
    class: menu!.classOf('item'),
    'data-color': props.color,
  });
}

function withClass(zagProps: unknown, className: string | undefined): Record<string, unknown> {
  const own = zagProps as Record<string, unknown>;
  return className ? mergeProps(own, { class: className }) : own;
}
</script>

<template>
  <div v-bind="itemAttrs()">
    <span
      v-if="isOption()"
      v-bind="
        withClass(menu!.api().getItemIndicatorProps(optionProps()), menu!.classOf('itemIndicator'))
      "
    >
      <DsIcon name="check" />
    </span>
    <span
      v-if="$slots.icon || icon"
      v-bind="part('dropdown-menu', 'icon', menu!.classOf('icon'), { 'aria-hidden': 'true' })"
    >
      <slot name="icon"><DsIcon :name="icon" /></slot>
    </span>
    <span
      v-bind="
        withClass(
          isOption()
            ? menu!.api().getItemTextProps(optionProps())
            : menu!.api().getItemTextProps({ value }),
          menu!.classOf('itemText'),
        )
      "
      ><slot
    /></span>
    <kbd v-if="shortcut" v-bind="part('dropdown-menu', 'shortcut', menu!.classOf('shortcut'))">{{
      shortcut
    }}</kbd>
  </div>
</template>
