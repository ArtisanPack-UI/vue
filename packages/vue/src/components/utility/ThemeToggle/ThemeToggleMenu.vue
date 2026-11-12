<script setup lang="ts">
/**
 * @module ThemeToggleMenu
 *
 * ThemeToggle's menu variant: an outline Button trigger showing the current
 * choice's icon, and a DropdownMenu of radio items on the menu machine
 * (`useDropdownMenu`), scoped dropdown-menu (D-019). System comes last,
 * after a separator. @internal
 */
import { computed, mergeProps, provide } from 'vue';
import { THEME_ICONS, type ThemeChoice } from '@artisanpack-ui/behavior';
import { useDropdownMenu } from '@artisanpack-ui/behavior/vue';
import { DsIcon } from '../../_shared/design-system';
import Button from '../../form/Button/Button.vue';
import DropdownMenuItem from '../../layout/DropdownMenu/DropdownMenuItem.vue';
import DropdownMenuSeparator from '../../layout/DropdownMenu/DropdownMenuSeparator.vue';
import { DROPDOWN_MENU_KEY } from '../../layout/DropdownMenu/keys';
import type { ThemeTogglePart, ThemeToggleSize } from './types';

const props = defineProps<{
  current: ThemeChoice;
  offered: ThemeChoice[];
  size: ThemeToggleSize;
  label: string;
  itemLabel: (choice: ThemeChoice) => string;
  classes?: Partial<Record<ThemeTogglePart, string>>;
}>();

const emit = defineEmits<{ choose: [choice: ThemeChoice] }>();

const machine = useDropdownMenu(() => ({ align: 'start' }));
const menu = computed(() => machine.value);

provide(DROPDOWN_MENU_KEY, {
  api: () => menu.value,
  classOf: (name) => (name === 'item' ? props.classes?.item : undefined),
  register: () => () => {},
  checkedChange(value) {
    emit('choose', value as ThemeChoice);
  },
});

function triggerAttrs(): Record<string, unknown> {
  return mergeProps(menu.value.getTriggerProps() as Record<string, unknown>, {
    class: props.classes?.trigger,
  });
}

function positionerAttrs(): Record<string, unknown> {
  return menu.value.getPositionerProps() as Record<string, unknown>;
}

function contentAttrs(): Record<string, unknown> {
  return mergeProps(menu.value.getContentProps() as Record<string, unknown>, {
    class: ['apui-dropdown-menu', props.classes?.menu],
    'data-surface': 'overlay',
    'data-align': 'start',
  });
}
</script>

<template>
  <Button
    v-bind="triggerAttrs()"
    variant="outline"
    color="neutral"
    :size="size"
    trailing-icon="chevron-down"
    ><template #icon><DsIcon :name="THEME_ICONS[current]" /></template>{{ label }}</Button
  >
  <Teleport to="body">
    <div v-bind="positionerAttrs()">
      <div v-bind="contentAttrs()">
        <template v-for="(choice, index) in offered" :key="choice">
          <DropdownMenuSeparator v-if="choice === 'system' && index > 0" />
          <DropdownMenuItem
            type="radio"
            :value="choice"
            :icon="THEME_ICONS[choice]"
            :checked="current === choice"
            >{{ itemLabel(choice) }}</DropdownMenuItem
          >
        </template>
      </div>
    </div>
  </Teleport>
</template>
