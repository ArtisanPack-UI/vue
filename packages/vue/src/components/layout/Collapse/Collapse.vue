<script setup lang="ts">
/** @module Collapse */
import { computed, getCurrentInstance, useId } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { CollapseProps } from './types';

const props = withDefaults(defineProps<Omit<CollapseProps, 'open'>>(), {
  icon: 'arrow',
  defaultOpen: false,
  bordered: false,
  disabled: false,
});

const openModel = defineModel<boolean>('open', { default: false });

// Only seed from defaultOpen when the parent has not bound v-model:open
const vnodeProps = getCurrentInstance()?.vnode.props ?? {};
const isParentControlled = 'open' in vnodeProps || 'onUpdate:open' in vnodeProps;
if (!isParentControlled && !openModel.value && props.defaultOpen) {
  openModel.value = true;
}

const autoId = useId();
const contentId = computed(() => `collapse-content-${autoId}`);
const headerId = computed(() => `collapse-header-${autoId}`);

const isOpen = computed(() => !!openModel.value);

function toggle() {
  if (props.disabled) return;
  openModel.value = !isOpen.value;
}

const iconClass = computed(() => {
  if (props.icon === 'arrow') return 'collapse-arrow';
  if (props.icon === 'plus') return 'collapse-plus';
  return '';
});

const collapseClasses = computed(() =>
  cn(
    'collapse',
    iconClass.value,
    props.bordered && 'collapse-border',
    props.disabled && 'opacity-50 pointer-events-none',
  ),
);
</script>

<template>
  <div :class="collapseClasses">
    <input
      :type="name ? 'radio' : 'checkbox'"
      :name="name || undefined"
      :checked="isOpen"
      :disabled="disabled"
      class="peer"
      :aria-hidden="true"
      tabindex="-1"
    />
    <div
      :id="headerId"
      class="collapse-title cursor-pointer"
      role="button"
      :tabindex="disabled ? -1 : 0"
      :aria-expanded="isOpen"
      :aria-controls="contentId"
      :aria-disabled="disabled || undefined"
      @click="toggle"
      @keydown.enter.prevent="toggle"
      @keydown.space.prevent="toggle"
    >
      {{ title }}
    </div>
    <div :id="contentId" class="collapse-content" role="region" :aria-labelledby="headerId">
      <slot />
    </div>
  </div>
</template>
