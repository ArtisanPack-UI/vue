<script setup lang="ts">
/**
 * @module Signature
 *
 * Captures a signature by drawing, typing or uploading. Every mode gives the
 * same value, a PNG data URL. Renders the design-system Signature markup
 * contract (`.apui-signature`, #53) and drives the pad with the behavior
 * engine's `SignaturePad`.
 */
import {
  initialSignatureMode,
  readSignatureImage,
  renderTypedSignature,
  signatureModes,
  SignaturePad,
  signatureTranslations,
  type SignatureMode,
} from '@artisanpack-ui/behavior';
import {
  computed,
  mergeProps,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  useId,
  watch,
} from 'vue';
import { DsIcon, flag, part } from '../../_shared/design-system';
import type { SignatureEmits, SignatureProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SignatureProps>(), {
  mode: 'draw',
  modes: undefined,
  penColor: 'default',
  label: undefined,
  hint: undefined,
  error: undefined,
  invalid: false,
  disabled: false,
  required: false,
  placeholder: undefined,
  modelValue: undefined,
  modesLabel: undefined,
  drawLabel: undefined,
  typeLabel: undefined,
  uploadLabel: undefined,
  padLabel: undefined,
  typedLabel: undefined,
  uploadTriggerLabel: undefined,
  undoLabel: undefined,
  clearLabel: undefined,
  clearedLabel: undefined,
  classes: undefined,
});

const emit = defineEmits<SignatureEmits>();

const attrs = useAttrs();
const autoId = useId();

const offered = computed(() => signatureModes(props.modes));
const strings = computed(() =>
  signatureTranslations({
    modes: props.modesLabel,
    draw: props.drawLabel,
    type: props.typeLabel,
    upload: props.uploadLabel,
    pad: props.padLabel,
    typed: props.typedLabel,
    uploadTrigger: props.uploadTriggerLabel,
    undo: props.undoLabel,
    clear: props.clearLabel,
    cleared: props.clearedLabel,
  }),
);
const current = ref<SignatureMode>(initialSignatureMode(props.mode, offered.value));
const value = ref(props.modelValue ?? '');
const typed = ref('');
const canUndo = ref(false);
const announcement = ref('');
const ink = ref<HTMLCanvasElement | null>(null);
const typedInput = ref<HTMLInputElement | null>(null);
let pad: SignaturePad | undefined;
let emitted: string | null = null;

const isEmpty = computed(() => value.value === '');

function baseId(): string {
  const explicit = attrs.id;
  return typeof explicit === 'string' && explicit !== '' ? explicit : autoId;
}

function hasText(text: string | undefined): boolean {
  return text !== undefined && text !== '';
}

function isInvalid(): boolean {
  return props.invalid || hasText(props.error);
}

function describedBy(): string | undefined {
  const own = attrs['aria-describedby'];
  const ids = [
    hasText(props.hint) ? `${baseId()}-hint` : undefined,
    hasText(props.error) ? `${baseId()}-error` : undefined,
    typeof own === 'string' && own !== '' ? own : undefined,
  ].filter(Boolean);
  return ids.length ? ids.join(' ') : undefined;
}

function rootAttrs(): Record<string, unknown> {
  const { class: _class, id: _id, name: _name, 'aria-describedby': _describedBy, ...rest } = attrs;
  return mergeProps(rest, {
    class: ['apui-signature', attrs.class, props.classes?.root],
    id: baseId(),
    role: 'group',
    'aria-labelledby': hasText(props.label) ? `${baseId()}-label` : undefined,
    'aria-label': hasText(props.label) ? undefined : strings.value.pad,
    'aria-describedby': describedBy(),
    'data-mode': current.value,
    'data-pen-color': props.penColor,
    'data-invalid': flag(isInvalid()),
    'data-disabled': flag(props.disabled),
  });
}

function commit(next: string): void {
  emitted = next;
  value.value = next;
  canUndo.value = pad?.canUndo() ?? false;
  emit('update:modelValue', next);
}

function setMode(mode: SignatureMode): void {
  if (mode === current.value || props.disabled) return;
  current.value = mode;
  typed.value = '';
  pad?.clear(true);
  canUndo.value = false;
  if (value.value !== '') commit('');
  void nextTick(() => {
    pad?.resize();
    if (mode === 'type') typedInput.value?.focus();
  });
}

function onTyped(event: Event): void {
  typed.value = (event.target as HTMLInputElement).value;
  const style = typedInput.value ? getComputedStyle(typedInput.value) : null;
  commit(
    renderTypedSignature(typed.value, {
      font: style?.font || '40px cursive',
      color: style?.color || '#000',
    }),
  );
}

async function onUpload(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = '';
  if (!file || !pad) return;
  try {
    pad.setImage(await readSignatureImage(file));
  } catch {
    // Not an image: nothing changes.
  }
}

function undo(): void {
  pad?.undo();
}

function clear(): void {
  typed.value = '';
  pad?.clear(true);
  canUndo.value = false;
  if (value.value !== '') commit('');
  announcement.value = '';
  void nextTick(() => {
    announcement.value = strings.value.cleared;
  });
}

onMounted(() => {
  if (!ink.value) return;
  pad = new SignaturePad(ink.value, { onChange: commit });
  pad.setDisabled(props.disabled);
  if (value.value) void pad.load(value.value);
});

onBeforeUnmount(() => {
  pad?.destroy();
  pad = undefined;
});

watch(
  () => props.modelValue,
  (next) => {
    const incoming = next ?? '';
    if (incoming === emitted) return;
    emitted = null;
    value.value = incoming;
    typed.value = '';
    canUndo.value = false;
    void pad?.load(incoming);
  },
);

watch(
  () => props.disabled,
  (disabled) => pad?.setDisabled(disabled),
);

function hiddenAttrs(): Record<string, unknown> {
  return { type: 'hidden', name: attrs.name, value: value.value };
}
</script>

<template>
  <div v-bind="rootAttrs()">
    <span v-if="label" v-bind="part('signature', 'label', classes?.label)" :id="`${baseId()}-label`"
      >{{ label
      }}<span
        v-if="required"
        v-bind="part('signature', 'required', classes?.required, { 'aria-hidden': 'true' })"
        >*</span
      ></span
    >
    <div
      v-bind="part('signature', 'modes', classes?.modes)"
      :id="`${baseId()}-modes`"
      role="group"
      :aria-label="strings.modes"
    >
      <button
        v-for="item in offered"
        :key="item"
        v-bind="part('signature', 'mode', classes?.mode)"
        :id="`${baseId()}-mode-${item}`"
        type="button"
        :data-value="item"
        :aria-pressed="item === current ? 'true' : 'false'"
        :disabled="disabled || undefined"
        @click="setMode(item)"
      >
        {{ strings[item] }}
      </button>
    </div>
    <div v-bind="part('signature', 'pad', classes?.pad)" :id="`${baseId()}-pad`">
      <span v-bind="part('signature', 'line', classes?.line, { 'aria-hidden': 'true' })"></span>
      <span v-bind="part('signature', 'mark', classes?.mark, { 'aria-hidden': 'true' })">×</span>
      <canvas
        ref="ink"
        v-bind="part('signature', 'ink', classes?.ink)"
        :id="`${baseId()}-ink`"
        role="img"
        :aria-label="strings.pad"
        :hidden="current === 'type' || undefined"
      ></canvas>
      <input
        ref="typedInput"
        v-bind="part('signature', 'typed', classes?.typed)"
        :id="`${baseId()}-typed`"
        type="text"
        :aria-label="strings.typed"
        autocomplete="name"
        maxlength="255"
        :value="typed"
        :aria-required="required ? 'true' : undefined"
        :aria-invalid="isInvalid() ? 'true' : undefined"
        :aria-describedby="describedBy()"
        :disabled="disabled || undefined"
        :hidden="current !== 'type' || undefined"
        @input="onTyped"
      />
      <label
        v-if="offered.includes('upload')"
        v-bind="part('signature', 'upload', classes?.upload)"
        :id="`${baseId()}-upload`"
        :hidden="current !== 'upload' || !isEmpty || undefined"
      >
        <input type="file" accept="image/*" :disabled="disabled || undefined" @change="onUpload" />
        <DsIcon name="upload" /><span>{{ strings.uploadTrigger }}</span>
      </label>
      <div
        v-bind="part('signature', 'tools', classes?.tools)"
        :id="`${baseId()}-tools`"
        :hidden="current === 'type' || undefined"
      >
        <button
          v-bind="part('signature', 'undo', classes?.undo)"
          :id="`${baseId()}-undo`"
          type="button"
          :aria-label="strings.undo"
          :disabled="!canUndo || disabled || undefined"
          :hidden="current !== 'draw' || undefined"
          @click="undo"
        >
          <DsIcon name="undo-2" />
        </button>
        <button
          v-bind="part('signature', 'clear', classes?.clear)"
          :id="`${baseId()}-clear`"
          type="button"
          :disabled="isEmpty || disabled || undefined"
          @click="clear"
        >
          <DsIcon name="eraser" /><span>{{ strings.clear }}</span>
        </button>
      </div>
      <span
        v-bind="part('signature', 'placeholder', classes?.placeholder, { 'aria-hidden': 'true' })"
        >{{ placeholder || strings.placeholder }}</span
      >
    </div>
    <input v-bind="hiddenAttrs()" />
    <p v-if="hint" v-bind="part('signature', 'hint', classes?.hint)" :id="`${baseId()}-hint`">
      {{ hint }}
    </p>
    <p v-if="error" v-bind="part('signature', 'error', classes?.error)" :id="`${baseId()}-error`">
      <DsIcon name="circle-alert" />{{ error }}
    </p>
    <span
      data-scope="signature"
      data-part="status"
      :id="`${baseId()}-status`"
      class="apui-sr-only"
      role="status"
      aria-live="polite"
      >{{ announcement }}</span
    >
  </div>
</template>
