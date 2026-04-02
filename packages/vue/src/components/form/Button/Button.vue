/** @module Button */
<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { Size } from '@artisanpack-ui/tokens';
import type { ButtonProps } from './types';

const props = withDefaults(defineProps<ButtonProps>(), {
  loading: false,
  responsive: false,
  tooltipPosition: 'top',
  type: 'button',
});

const colorMap: Record<string, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  accent: 'btn-accent',
  success: 'btn-success',
  warning: 'btn-warning',
  error: 'btn-error',
  info: 'btn-info',
  neutral: 'btn-neutral',
  ghost: 'btn-ghost',
  outline: 'btn-outline',
};

const sizeMap: Record<Size, string> = {
  xs: 'btn-xs',
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
};

const tooltipPositionMap: Record<string, string> = {
  top: 'tooltip-top',
  bottom: 'tooltip-bottom',
  left: 'tooltip-left',
  right: 'tooltip-right',
};

const buttonClasses = computed(() =>
  cn(
    'btn',
    props.color && colorMap[props.color],
    props.size && sizeMap[props.size],
    props.loading && 'btn-disabled',
  ),
);

function handleLinkClick(e: MouseEvent) {
  if (props.disabled || props.loading) {
    e.preventDefault();
  }
}
</script>

<template>
  <div
    v-if="tooltip"
    :class="cn('tooltip', tooltipPositionMap[tooltipPosition])"
    :data-tip="tooltip"
  >
    <a
      v-if="link"
      :href="link"
      :class="buttonClasses"
      :target="external ? '_blank' : undefined"
      :rel="external ? 'noopener noreferrer' : undefined"
      role="button"
      :aria-busy="loading || undefined"
      :aria-disabled="disabled || loading || undefined"
      @click="handleLinkClick"
    >
      <span v-if="loading" class="loading loading-spinner loading-sm" aria-hidden="true" />
      <template v-else>
        <span v-if="$slots.icon" aria-hidden="true"><slot name="icon" /></span>
      </template>
      <span v-if="label" :class="cn(responsive && 'hidden sm:inline')">{{ label }}</span>
      <slot />
      <span v-if="$slots.iconRight" aria-hidden="true"><slot name="iconRight" /></span>
      <span v-if="badge" :class="cn('badge', badgeClasses)">{{ badge }}</span>
    </a>
    <button
      v-else
      :type="type"
      :disabled="disabled || loading"
      :class="buttonClasses"
      :aria-busy="loading || undefined"
    >
      <span v-if="loading" class="loading loading-spinner loading-sm" aria-hidden="true" />
      <template v-else>
        <span v-if="$slots.icon" aria-hidden="true"><slot name="icon" /></span>
      </template>
      <span v-if="label" :class="cn(responsive && 'hidden sm:inline')">{{ label }}</span>
      <slot />
      <span v-if="$slots.iconRight" aria-hidden="true"><slot name="iconRight" /></span>
      <span v-if="badge" :class="cn('badge', badgeClasses)">{{ badge }}</span>
    </button>
  </div>
  <a
    v-else-if="link"
    :href="link"
    :class="buttonClasses"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    role="button"
    :aria-busy="loading || undefined"
    :aria-disabled="disabled || loading || undefined"
    @click="handleLinkClick"
  >
    <span v-if="loading" class="loading loading-spinner loading-sm" aria-hidden="true" />
    <template v-else>
      <span v-if="$slots.icon" aria-hidden="true"><slot name="icon" /></span>
    </template>
    <span v-if="label" :class="cn(responsive && 'hidden sm:inline')">{{ label }}</span>
    <slot />
    <span v-if="$slots.iconRight" aria-hidden="true"><slot name="iconRight" /></span>
    <span v-if="badge" :class="cn('badge', badgeClasses)">{{ badge }}</span>
  </a>
  <button
    v-else
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    :aria-busy="loading || undefined"
  >
    <span v-if="loading" class="loading loading-spinner loading-sm" aria-hidden="true" />
    <template v-else>
      <span v-if="$slots.icon" aria-hidden="true"><slot name="icon" /></span>
    </template>
    <span v-if="label" :class="cn(responsive && 'hidden sm:inline')">{{ label }}</span>
    <slot />
    <span v-if="$slots.iconRight" aria-hidden="true"><slot name="iconRight" /></span>
    <span v-if="badge" :class="cn('badge', badgeClasses)">{{ badge }}</span>
  </button>
</template>
