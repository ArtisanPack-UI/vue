<script setup lang="ts">
/** @module SpotlightSearch */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { SpotlightSearchProps, SpotlightItem } from './types';

const props = withDefaults(defineProps<Omit<SpotlightSearchProps, 'open'>>(), {
  placeholder: 'Search…',
  ariaLabel: 'Search',
});

const openModel = defineModel<boolean>('open', { default: false });

const emit = defineEmits<{
  select: [item: SpotlightItem];
}>();

const autoId = useId();
const dialogId = `spotlight-${autoId}`;
const inputId = `spotlight-input-${autoId}`;
const listboxId = `spotlight-listbox-${autoId}`;

const dialogRef = ref<HTMLDialogElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const previousActiveElement = ref<HTMLElement | null>(null);

const query = ref('');
const activeIndex = ref(0);

const filteredItems = computed(() => {
  const q = query.value.toLowerCase().trim();
  if (!q) return props.items.filter((item) => !item.disabled);
  return props.items.filter(
    (item) =>
      !item.disabled &&
      (item.label.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))),
  );
});

const groupedItems = computed(() => {
  const groups = new Map<string, SpotlightItem[]>();
  for (const item of filteredItems.value) {
    const group = item.group ?? '';
    if (!groups.has(group)) {
      groups.set(group, []);
    }
    groups.get(group)!.push(item);
  }
  return groups;
});

const itemIndexMap = computed(() => {
  const map = new Map<string, number>();
  filteredItems.value.forEach((item, i) => map.set(item.id, i));
  return map;
});

function getItemIndex(item: SpotlightItem): number {
  return itemIndexMap.value.get(item.id) ?? -1;
}

function open() {
  openModel.value = true;
}

function close() {
  openModel.value = false;
}

function selectItem(item: SpotlightItem) {
  if (item.disabled) return;
  emit('select', item);
  close();
}

function handleKeydown(e: KeyboardEvent) {
  const items = filteredItems.value;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    activeIndex.value = activeIndex.value < items.length - 1 ? activeIndex.value + 1 : 0;
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    activeIndex.value = activeIndex.value > 0 ? activeIndex.value - 1 : items.length - 1;
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const active = items[activeIndex.value];
    if (active) {
      selectItem(active);
    }
  } else if (e.key === 'Escape') {
    e.preventDefault();
    close();
  }
}

function handleGlobalKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    if (openModel.value) {
      close();
    } else {
      open();
    }
  }
}

function handleBackdropClick(e: MouseEvent) {
  if (e.target === dialogRef.value) {
    close();
  }
}

function getItemId(item: SpotlightItem) {
  return `spotlight-item-${autoId}-${item.id}`;
}

// Reset state on query change
watch(query, () => {
  activeIndex.value = 0;
});

watch(
  openModel,
  async (isOpen) => {
    if (isOpen) {
      previousActiveElement.value = document.activeElement as HTMLElement;
      query.value = '';
      activeIndex.value = 0;
      await nextTick();
      if (dialogRef.value && !dialogRef.value.open) {
        dialogRef.value.showModal();
      }
      inputRef.value?.focus();
    } else {
      dialogRef.value?.close();
      if (previousActiveElement.value?.isConnected) {
        previousActiveElement.value.focus();
      }
      previousActiveElement.value = null;
    }
  },
  { immediate: true, flush: 'post' },
);

onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleGlobalKeydown);
  if (dialogRef.value?.open) {
    dialogRef.value.close();
  }
});

function handleCancel(_e: Event) {
  close();
}
</script>

<template>
  <Teleport to="body">
    <dialog
      :id="dialogId"
      ref="dialogRef"
      class="modal"
      :aria-label="ariaLabel"
      aria-modal="true"
      @click="handleBackdropClick"
      @cancel="handleCancel"
      @keydown="handleKeydown"
    >
      <div :class="cn('modal-box max-w-lg p-0', props.className)">
        <div class="flex items-center border-b border-base-300 px-4">
          <svg
            class="h-5 w-5 shrink-0 text-base-content/50"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <input
            :id="inputId"
            ref="inputRef"
            v-model="query"
            type="text"
            :placeholder="placeholder"
            class="input input-ghost w-full border-0 focus:outline-none"
            role="combobox"
            :aria-expanded="filteredItems.length > 0"
            :aria-controls="listboxId"
            :aria-activedescendant="
              filteredItems[activeIndex] ? getItemId(filteredItems[activeIndex]) : undefined
            "
            autocomplete="off"
          />
          <kbd class="kbd kbd-sm">esc</kbd>
        </div>

        <ul
          v-if="filteredItems.length > 0"
          :id="listboxId"
          role="listbox"
          :aria-label="ariaLabel"
          class="max-h-80 overflow-y-auto p-2"
        >
          <template v-for="[group, groupItems] in groupedItems" :key="group">
            <li
              v-if="group"
              role="presentation"
              class="px-3 py-1.5 text-xs font-semibold text-base-content/50 uppercase"
            >
              {{ group }}
            </li>
            <li
              v-for="item in groupItems"
              :id="getItemId(item)"
              :key="item.id"
              role="option"
              :aria-selected="getItemIndex(item) === activeIndex"
              :class="
                cn(
                  'cursor-pointer rounded-lg px-3 py-2',
                  getItemIndex(item) === activeIndex && 'bg-base-200',
                )
              "
              @click="selectItem(item)"
              @mouseenter="activeIndex = getItemIndex(item)"
            >
              <slot name="item" :item="item" :is-active="getItemIndex(item) === activeIndex">
                <div class="font-medium">
                  {{ item.label }}
                </div>
                <div v-if="item.description" class="text-sm text-base-content/60">
                  {{ item.description }}
                </div>
              </slot>
            </li>
          </template>
        </ul>

        <div v-else class="p-8 text-center text-base-content/50">
          <slot name="empty"> No results found. </slot>
        </div>
      </div>
    </dialog>
  </Teleport>
</template>
