/** @module Pin */
<script setup lang="ts">
import { computed, onMounted, ref, useId, watch } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { PinProps } from './types';

const props = withDefaults(defineProps<PinProps>(), {
  numeric: false,
  hide: false,
});

const emit = defineEmits<{
  complete: [value: string];
  incomplete: [value: string];
  valueChange: [value: string];
}>();

const model = defineModel<string>({ default: '' });

const colorMap: Record<string, string> = {
  primary: 'input-primary',
  secondary: 'input-secondary',
  accent: 'input-accent',
  success: 'input-success',
  warning: 'input-warning',
  error: 'input-error',
  info: 'input-info',
  neutral: 'input-neutral',
};

const autoId = useId();
const pinId = computed(() => props.id ?? autoId);
const errorId = computed(() => (props.error ? `${pinId.value}-error` : undefined));

const inputs = ref<(HTMLInputElement | null)[]>([]);

function setInputRef(el: HTMLInputElement | null, index: number) {
  inputs.value[index] = el;
}

function getValue(): string {
  return inputs.value.map((input) => input?.value ?? '').join('');
}

function notifyChange(currentValue: string) {
  model.value = currentValue;
  emit('valueChange', currentValue);
  if (currentValue.length === props.length) {
    emit('complete', currentValue);
  } else {
    emit('incomplete', currentValue);
  }
}

function handleInput(index: number, e: Event) {
  const target = e.target as HTMLInputElement;
  const inputValue = target.value;

  if (props.numeric && !/^\d*$/.test(inputValue)) {
    target.value = '';
    notifyChange(getValue());
    return;
  }

  if (inputValue.length > 0 && index < props.length - 1) {
    inputs.value[index + 1]?.focus();
  }

  notifyChange(getValue());
}

function handleKeyDown(index: number, e: KeyboardEvent) {
  if (e.key === 'Backspace') {
    const input = inputs.value[index];
    if (input && input.value === '' && index > 0) {
      inputs.value[index - 1]?.focus();
    }
  } else if (e.key === 'ArrowLeft' && index > 0) {
    inputs.value[index - 1]?.focus();
  } else if (e.key === 'ArrowRight' && index < props.length - 1) {
    inputs.value[index + 1]?.focus();
  }
}

function handlePaste(e: ClipboardEvent) {
  e.preventDefault();
  const rawData = (e.clipboardData?.getData('text') ?? '').slice(0, props.length);
  const pastedData = props.numeric ? rawData.replace(/\D/g, '') : rawData;

  for (let i = 0; i < props.length; i++) {
    const input = inputs.value[i];
    if (input) {
      input.value = pastedData[i] ?? '';
    }
  }

  const lastFilledIndex = Math.min(pastedData.length, props.length) - 1;
  if (lastFilledIndex >= 0 && lastFilledIndex < props.length - 1) {
    inputs.value[lastFilledIndex + 1]?.focus();
  } else if (lastFilledIndex === props.length - 1) {
    inputs.value[lastFilledIndex]?.focus();
  }

  notifyChange(getValue());
}

// Sync controlled value to individual inputs
watch(
  () => model.value,
  (newValue) => {
    if (newValue === undefined) return;
    inputs.value.forEach((input, i) => {
      if (input) {
        input.value = newValue[i] ?? '';
      }
    });
  },
);

onMounted(() => {
  if (model.value) {
    inputs.value.forEach((input, i) => {
      if (input) {
        input.value = model.value[i] ?? '';
      }
    });
  }
});
</script>

<template>
  <fieldset class="fieldset">
    <div class="flex gap-2" role="group" aria-label="PIN input">
      <input
        v-for="index in length"
        :key="index - 1"
        :ref="(el) => setInputRef(el as HTMLInputElement | null, index - 1)"
        :id="`${pinId}-${index - 1}`"
        :type="hide ? 'password' : 'text'"
        :inputmode="numeric ? 'numeric' : 'text'"
        :pattern="numeric ? '[0-9]*' : undefined"
        :maxlength="1"
        :class="
          cn(
            'input w-12 h-12 text-center text-lg font-mono',
            color && colorMap[color],
            error && 'input-error',
          )
        "
        :disabled="disabled"
        autocomplete="one-time-code"
        :aria-label="`PIN digit ${index} of ${length}`"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="error ? errorId : undefined"
        @input="handleInput(index - 1, $event)"
        @keydown="handleKeyDown(index - 1, $event)"
        @paste="handlePaste"
      />
    </div>
    <p v-if="error" :id="errorId" class="fieldset-label text-error" role="alert">{{ error }}</p>
  </fieldset>
</template>
