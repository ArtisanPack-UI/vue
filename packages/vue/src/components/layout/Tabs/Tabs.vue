<script setup lang="ts">
/** @module Tabs */
import { computed, ref, useId } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor, Size } from '@artisanpack-ui/tokens';
import type { TabsProps } from './types';

const props = withDefaults(defineProps<TabsProps>(), {
  variant: 'bordered',
  vertical: false,
  verticalRight: false,
});

const emit = defineEmits<{
  'update:activeTab': [value: string];
}>();

const autoId = useId();

const isControlled = computed(() => props.activeTab !== undefined);

const firstSelectableTab = computed(() => props.tabs.find((t) => !t.disabled)?.name ?? '');

const internalTab = ref(props.defaultTab ?? firstSelectableTab.value);

const currentTab = computed(() =>
  isControlled.value ? (props.activeTab ?? firstSelectableTab.value) : internalTab.value,
);

function selectTab(name: string) {
  const tab = props.tabs.find((t) => t.name === name);
  if (tab?.disabled) return;
  if (isControlled.value) {
    emit('update:activeTab', name);
  } else {
    internalTab.value = name;
  }
}

const colorMap: Record<DaisyColor, string> = {
  primary: 'text-primary [--tab-border-color:var(--color-primary)]',
  secondary: 'text-secondary [--tab-border-color:var(--color-secondary)]',
  accent: 'text-accent [--tab-border-color:var(--color-accent)]',
  success: 'text-success [--tab-border-color:var(--color-success)]',
  warning: 'text-warning [--tab-border-color:var(--color-warning)]',
  error: 'text-error [--tab-border-color:var(--color-error)]',
  info: 'text-info [--tab-border-color:var(--color-info)]',
  neutral: 'text-neutral [--tab-border-color:var(--color-neutral)]',
};

const sizeMap: Record<Size, string> = {
  xs: 'tabs-xs',
  sm: 'tabs-sm',
  md: 'tabs-md',
  lg: 'tabs-lg',
};

const variantMap: Record<'bordered' | 'lifted' | 'boxed', string> = {
  bordered: 'tabs-bordered',
  lifted: 'tabs-lifted',
  boxed: 'tabs-boxed',
};

const tabListClasses = computed(() =>
  cn(
    'tabs',
    variantMap[props.variant],
    props.size && sizeMap[props.size],
    isVertical.value && 'tabs-vertical min-w-48',
    props.tabListClassName,
  ),
);

const isVertical = computed(() => props.vertical || props.verticalRight);

function getTabClasses(tabName: string, disabled?: boolean) {
  const isActive = currentTab.value === tabName;
  return cn(
    'tab',
    isActive && 'tab-active',
    isActive && props.color && colorMap[props.color],
    isActive && props.activeTabClassName,
    disabled && 'tab-disabled',
    isVertical.value && 'w-full justify-start',
  );
}

function getSelectableTabs() {
  return props.tabs.filter((t) => !t.disabled);
}

function handleKeydown(e: KeyboardEvent) {
  const selectable = getSelectableTabs();
  const currentIndex = selectable.findIndex((t) => t.name === currentTab.value);
  if (currentIndex === -1) return;

  const isVert = isVertical.value;
  const prevKey = isVert ? 'ArrowUp' : 'ArrowLeft';
  const nextKey = isVert ? 'ArrowDown' : 'ArrowRight';

  let targetIndex = -1;

  if (e.key === prevKey) {
    e.preventDefault();
    targetIndex = currentIndex > 0 ? currentIndex - 1 : selectable.length - 1;
  } else if (e.key === nextKey) {
    e.preventDefault();
    targetIndex = currentIndex < selectable.length - 1 ? currentIndex + 1 : 0;
  } else if (e.key === 'Home') {
    e.preventDefault();
    targetIndex = 0;
  } else if (e.key === 'End') {
    e.preventDefault();
    targetIndex = selectable.length - 1;
  }

  if (targetIndex >= 0) {
    selectTab(selectable[targetIndex].name);
    const tabEl = document.getElementById(`tab-${autoId}-${selectable[targetIndex].name}`);
    tabEl?.focus();
  }
}

function tabPanelId(name: string) {
  return `tabpanel-${autoId}-${name}`;
}

function tabId(name: string) {
  return `tab-${autoId}-${name}`;
}
</script>

<template>
  <div :class="cn(isVertical && 'flex', verticalRight && 'flex-row-reverse')">
    <div
      role="tablist"
      :aria-orientation="isVertical ? 'vertical' : 'horizontal'"
      :class="tabListClasses"
      @keydown="handleKeydown"
    >
      <button
        v-for="tab in tabs"
        :id="tabId(tab.name)"
        :key="tab.name"
        role="tab"
        type="button"
        :class="getTabClasses(tab.name, tab.disabled)"
        :aria-selected="currentTab === tab.name"
        :aria-controls="tabPanelId(tab.name)"
        :aria-disabled="tab.disabled || undefined"
        :tabindex="currentTab === tab.name ? 0 : -1"
        :disabled="tab.disabled"
        @click="selectTab(tab.name)"
      >
        {{ tab.label }}
      </button>
    </div>
    <div
      v-for="tab in tabs"
      :id="tabPanelId(tab.name)"
      :key="tab.name"
      role="tabpanel"
      :aria-labelledby="tabId(tab.name)"
      :hidden="currentTab !== tab.name"
      :class="cn(isVertical ? 'flex-1 pl-4' : 'p-4', panelClassName)"
      :tabindex="currentTab === tab.name ? 0 : -1"
    >
      <slot v-if="currentTab === tab.name" :name="tab.name" />
    </div>
  </div>
</template>
