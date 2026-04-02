<script setup lang="ts">
/** @module Menu */
import { computed, reactive } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor, Size } from '@artisanpack-ui/tokens';
import type { MenuProps } from './types';

const props = withDefaults(defineProps<MenuProps>(), {
  horizontal: false,
});

const emit = defineEmits<{
  select: [name: string];
}>();

const sizeMap: Record<Size, string> = {
  xs: 'menu-xs',
  sm: 'menu-sm',
  md: 'menu-md',
  lg: 'menu-lg',
};

const colorMap: Record<DaisyColor, string> = {
  primary:
    'active:bg-primary active:text-primary-content focus:bg-primary focus:text-primary-content',
  secondary:
    'active:bg-secondary active:text-secondary-content focus:bg-secondary focus:text-secondary-content',
  accent: 'active:bg-accent active:text-accent-content focus:bg-accent focus:text-accent-content',
  success:
    'active:bg-success active:text-success-content focus:bg-success focus:text-success-content',
  warning:
    'active:bg-warning active:text-warning-content focus:bg-warning focus:text-warning-content',
  error: 'active:bg-error active:text-error-content focus:bg-error focus:text-error-content',
  info: 'active:bg-info active:text-info-content focus:bg-info focus:text-info-content',
  neutral:
    'active:bg-neutral active:text-neutral-content focus:bg-neutral focus:text-neutral-content',
};

const menuClasses = computed(() =>
  cn(
    'menu',
    props.horizontal && 'menu-horizontal',
    props.size && sizeMap[props.size],
    props.className,
  ),
);

function getItemClasses(item: { active?: boolean; disabled?: boolean }) {
  return cn(item.active && 'active', item.disabled && 'disabled');
}

function getLinkClasses(item: { active?: boolean }) {
  return cn(item.active && props.color && colorMap[props.color]);
}

function handleClick(item: { name: string; disabled?: boolean }, e: Event) {
  if (item.disabled) {
    e.preventDefault();
    return;
  }
  emit('select', item.name);
}

const detailsOpen = reactive(new Map<string, boolean>());

function handleSummaryClick(item: { name: string; disabled?: boolean }, e: Event) {
  if (item.disabled) {
    e.preventDefault();
  }
}

function handleDetailsToggle(item: { name: string }, e: Event) {
  const details = e.target as HTMLDetailsElement;
  detailsOpen.set(item.name, details.open);
}
</script>

<template>
  <ul
    role="menubar"
    :aria-orientation="horizontal ? 'horizontal' : 'vertical'"
    :class="menuClasses"
  >
    <li v-for="item in items" :key="item.name" role="none" :class="getItemClasses(item)">
      <template v-if="item.children && item.children.length > 0">
        <details @toggle="handleDetailsToggle(item, $event)">
          <summary
            role="menuitem"
            :class="getLinkClasses(item)"
            :aria-disabled="item.disabled || undefined"
            :aria-haspopup="'menu'"
            :aria-expanded="detailsOpen.get(item.name) ?? false"
            :tabindex="item.disabled ? -1 : 0"
            @click="handleSummaryClick(item, $event)"
          >
            <slot name="item" :item="item">
              {{ item.label }}
            </slot>
          </summary>
          <ul role="menu">
            <li
              v-for="child in item.children"
              :key="child.name"
              role="none"
              :class="getItemClasses(child)"
            >
              <a
                v-if="child.href"
                :href="child.href"
                role="menuitem"
                :class="getLinkClasses(child)"
                :aria-disabled="child.disabled || undefined"
                :aria-current="child.active ? 'page' : undefined"
                :tabindex="child.disabled ? -1 : 0"
                @click="handleClick(child, $event)"
              >
                <slot name="item" :item="child">{{ child.label }}</slot>
              </a>
              <button
                v-else
                type="button"
                role="menuitem"
                :class="getLinkClasses(child)"
                :disabled="child.disabled"
                :aria-disabled="child.disabled || undefined"
                :aria-current="child.active ? 'page' : undefined"
                @click="handleClick(child, $event)"
              >
                <slot name="item" :item="child">
                  {{ child.label }}
                </slot>
              </button>
            </li>
          </ul>
        </details>
      </template>
      <template v-else>
        <a
          v-if="item.href"
          :href="item.href"
          role="menuitem"
          :class="getLinkClasses(item)"
          :aria-disabled="item.disabled || undefined"
          :aria-current="item.active ? 'page' : undefined"
          :tabindex="item.disabled ? -1 : 0"
          @click="handleClick(item, $event)"
        >
          <slot name="item" :item="item">{{ item.label }}</slot>
        </a>
        <button
          v-else
          type="button"
          role="menuitem"
          :class="getLinkClasses(item)"
          :disabled="item.disabled"
          :aria-disabled="item.disabled || undefined"
          :aria-current="item.active ? 'page' : undefined"
          @click="handleClick(item, $event)"
        >
          <slot name="item" :item="item">
            {{ item.label }}
          </slot>
        </button>
      </template>
    </li>
  </ul>
</template>
