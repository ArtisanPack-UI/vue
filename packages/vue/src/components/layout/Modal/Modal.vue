<script setup lang="ts">
/** @module Modal */
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { ModalProps } from './types';
import { getFocusableElements } from '../utils/focusable';

const props = withDefaults(defineProps<ModalProps>(), {
  persistent: false,
  glass: false,
  bottom: false,
});

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const autoId = useId();
const titleId = `modal-title-${autoId}`;

const dialogRef = ref<HTMLDialogElement | null>(null);
const previousActiveElement = ref<HTMLElement | null>(null);

function close() {
  if (props.persistent) return;
  emit('update:open', false);
}

function handleKeydown(e: KeyboardEvent) {
  // Escape is handled by the native dialog cancel event via handleCancel
  if (e.key === 'Tab') {
    const focusable = getFocusableElements(dialogRef.value);
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
}

function handleCancel(e: Event) {
  if (props.persistent) {
    e.preventDefault();
  } else {
    emit('update:open', false);
  }
}

function handleBackdropClick(e: MouseEvent) {
  if (e.target === dialogRef.value) {
    close();
  }
}

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      previousActiveElement.value = document.activeElement as HTMLElement;
      await nextTick();
      if (dialogRef.value && !dialogRef.value.open) {
        dialogRef.value.showModal();
      }
      const focusable = getFocusableElements(dialogRef.value);
      if (focusable.length > 0) {
        focusable[0].focus();
      }
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

onBeforeUnmount(() => {
  if (dialogRef.value?.open) {
    dialogRef.value.close();
  }
  if (previousActiveElement.value?.isConnected) {
    previousActiveElement.value.focus();
  }
});

const modalBoxClasses = computed(() => cn('modal-box', props.glass && 'glass'));
</script>

<template>
  <Teleport to="body">
    <dialog
      ref="dialogRef"
      :class="cn('modal', bottom && 'modal-bottom')"
      :aria-labelledby="title ? titleId : undefined"
      :aria-label="!title ? ariaLabel || 'Dialog' : undefined"
      aria-modal="true"
      @keydown="handleKeydown"
      @click="handleBackdropClick"
      @cancel="handleCancel"
    >
      <div :class="modalBoxClasses">
        <button
          v-if="!persistent"
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          aria-label="Close"
          type="button"
          @click="emit('update:open', false)"
        >
          &times;
        </button>
        <h3 v-if="title" :id="titleId" class="font-bold text-lg">{{ title }}</h3>
        <p v-if="subtitle" class="text-base-content/70">{{ subtitle }}</p>
        <div class="py-4">
          <slot />
        </div>
        <div v-if="$slots.actions" class="modal-action">
          <slot name="actions" />
        </div>
      </div>
    </dialog>
  </Teleport>
</template>
