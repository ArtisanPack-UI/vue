<script setup lang="ts">
/** @module ThemeToggle */
import { computed, watch, onMounted } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { Size } from '@artisanpack-ui/tokens';
import { useTheme } from '../../../composables/use-theme';
import type { ColorScheme } from '../../../types/theme';
import type { ThemeToggleProps } from './types';

const props = withDefaults(defineProps<ThemeToggleProps>(), {
  size: 'md',
  persist: true,
  storageKey: 'artisanpack-color-scheme',
});

const { colorScheme, resolvedColorScheme, setColorScheme } = useTheme();

const sizeMap: Record<Size, string> = {
  xs: 'btn-xs',
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
};

const toggleClasses = computed(() =>
  cn('btn btn-ghost', sizeMap[props.size], props.className),
);

const modes: ColorScheme[] = ['light', 'dark', 'system'];

function cycle() {
  const currentIndex = modes.indexOf(colorScheme.value);
  const next = modes[(currentIndex + 1) % modes.length];
  setColorScheme(next);
}

onMounted(() => {
  if (props.persist && typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(props.storageKey) as ColorScheme | null;
      if (stored && modes.includes(stored)) {
        setColorScheme(stored);
      }
    } catch {
      // localStorage may be unavailable (private browsing, storage quota, etc.)
    }
  }
});

watch(colorScheme, (value) => {
  if (props.persist && typeof window !== 'undefined') {
    try {
      localStorage.setItem(props.storageKey, value);
    } catch {
      // localStorage may be unavailable
    }
  }
});

watch(
  resolvedColorScheme,
  (value) => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', value);
    }
  },
  { immediate: true },
);

const ariaLabel = computed(() => {
  const labels: Record<ColorScheme, string> = {
    light: 'Switch to dark mode',
    dark: 'Switch to system mode',
    system: 'Switch to light mode',
  };
  return labels[colorScheme.value];
});
</script>

<template>
  <button
    type="button"
    :class="toggleClasses"
    :aria-label="ariaLabel"
    @click="cycle"
  >
    <!-- Sun icon for light mode -->
    <svg
      v-if="colorScheme === 'light'"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-5 h-5"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
      />
    </svg>
    <!-- Moon icon for dark mode -->
    <svg
      v-else-if="colorScheme === 'dark'"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-5 h-5"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
      />
    </svg>
    <!-- Computer icon for system mode -->
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-5 h-5"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z"
      />
    </svg>
  </button>
</template>
