<script setup lang="ts">
/**
 * @module Password
 *
 * Password entry in Input's field anatomy, with a reveal toggle, an optional
 * strength meter and live requirements. Renders the design-system Password
 * markup contract (`.apui-password`, #53).
 */
import { computed, mergeProps, ref, useAttrs, useId, watch } from 'vue';
import { DsIcon, flag, part } from '../../_shared/design-system';
import { passwordStrength, requirementMet } from '../../_shared/form-text';
import type { PasswordEmits, PasswordLabels, PasswordProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<PasswordProps>(), {
  size: 'md',
  autocomplete: 'current-password',
  label: undefined,
  hint: undefined,
  error: undefined,
  invalid: false,
  disabled: false,
  readonly: false,
  required: false,
  placeholder: undefined,
  modelValue: undefined,
  leadingIcon: undefined,
  strengthMeter: false,
  requirements: undefined,
  revealLabel: 'Show password',
  labels: undefined,
  classes: undefined,
});

const emit = defineEmits<PasswordEmits>();

const DEFAULT_LABELS: PasswordLabels = {
  strength: 'Strength',
  weak: 'Weak',
  fair: 'Fair',
  good: 'Good',
  strong: 'Strong',
  met: 'Met',
  unmet: 'Not met',
};

const attrs = useAttrs();
const autoId = useId();
const revealed = ref(false);

const current = ref(props.modelValue ?? '');
watch(
  () => props.modelValue,
  (value) => {
    current.value = value ?? '';
  },
);

const text = computed<PasswordLabels>(() => ({ ...DEFAULT_LABELS, ...props.labels }));
const level = computed(() => passwordStrength(current.value));
const levelName = computed(() => {
  const names = ['', text.value.weak, text.value.fair, text.value.good, text.value.strong];
  return names[level.value] ?? '';
});
const hasRequirements = computed(() => (props.requirements?.length ?? 0) > 0);

function fieldId(): string {
  const explicit = attrs.id;
  return typeof explicit === 'string' && explicit !== '' ? explicit : autoId;
}

function isInvalid(): boolean {
  return props.invalid || (props.error !== undefined && props.error !== '');
}

function hasHint(): boolean {
  return props.hint !== undefined && props.hint !== '';
}

function hasError(): boolean {
  return props.error !== undefined && props.error !== '';
}

function rootAttrs(): Record<string, unknown> {
  return {
    class: ['apui-password', attrs.class, props.classes?.root],
    'data-size': props.size,
    'data-invalid': flag(isInvalid()),
    'data-disabled': flag(props.disabled),
    'data-readonly': flag(props.readonly),
  };
}

function onInput(event: Event): void {
  const value = (event.target as HTMLInputElement).value;
  current.value = value;
  emit('update:modelValue', value);
}

function controlAttrs(): Record<string, unknown> {
  const { class: _className, id: _id, 'aria-describedby': describedBy, ...rest } = attrs;
  const id = fieldId();
  const describedByIds = [
    hasHint() ? `${id}-hint` : undefined,
    hasRequirements.value ? `${id}-requirements` : undefined,
    hasError() ? `${id}-error` : undefined,
    typeof describedBy === 'string' && describedBy !== '' ? describedBy : undefined,
  ].filter(Boolean);
  const own: Record<string, unknown> = {
    ...part('password', 'control', props.classes?.control),
    id,
    type: revealed.value ? 'text' : 'password',
    autocomplete: props.autocomplete,
    placeholder: props.placeholder,
    disabled: props.disabled || undefined,
    readonly: props.readonly || undefined,
    required: props.required || undefined,
    'aria-describedby': describedByIds.length ? describedByIds.join(' ') : undefined,
    onInput,
  };
  if (isInvalid()) own['aria-invalid'] = 'true';
  if (props.modelValue !== undefined && props.modelValue !== null) own.value = props.modelValue;
  return mergeProps(rest, own);
}

function revealAttrs(): Record<string, unknown> {
  return part('password', 'reveal', props.classes?.reveal, {
    type: 'button',
    'aria-label': props.revealLabel,
    'aria-pressed': revealed.value ? 'true' : 'false',
    'aria-controls': fieldId(),
    disabled: props.disabled || undefined,
  });
}

function toggleReveal(): void {
  revealed.value = !revealed.value;
}
</script>

<template>
  <div v-bind="rootAttrs()">
    <label v-if="label" v-bind="part('password', 'label', classes?.label)" :for="fieldId()"
      >{{ label
      }}<span
        v-if="required"
        v-bind="part('password', 'required', classes?.required, { 'aria-hidden': 'true' })"
        >*</span
      ></label
    >
    <div v-bind="part('password', 'box', classes?.box)">
      <span
        v-if="$slots.icon || leadingIcon"
        v-bind="part('password', 'icon', classes?.icon, { 'aria-hidden': 'true' })"
      >
        <slot name="icon"><DsIcon :name="leadingIcon" /></slot>
      </span>
      <input v-bind="controlAttrs()" />
      <button v-bind="revealAttrs()" @click="toggleReveal">
        <DsIcon name="eye" data-icon="eye" /><DsIcon name="eye-off" data-icon="eye-off" />
      </button>
    </div>
    <template v-if="strengthMeter">
      <div
        v-bind="
          part('password', 'strength', classes?.strength, {
            'data-level': String(level),
            'aria-hidden': 'true',
          })
        "
      >
        <span v-for="n in 4" :key="n" v-bind="part('password', 'segment', classes?.segment)" />
      </div>
      <div v-bind="part('password', 'strengthLabel', classes?.strengthLabel)">
        <span>{{ text.strength }}</span
        ><span aria-live="polite">{{ levelName }}</span>
      </div>
    </template>
    <ul
      v-if="hasRequirements"
      v-bind="part('password', 'requirements', classes?.requirements)"
      :id="`${fieldId()}-requirements`"
    >
      <li
        v-for="(requirement, index) in requirements"
        :key="index"
        v-bind="
          part('password', 'requirement', classes?.requirement, {
            'data-met': flag(requirementMet(requirement.pattern, current)),
          })
        "
      >
        <DsIcon name="check" data-icon="check" /><DsIcon name="x" data-icon="x" />{{
          requirement.label
        }}<span class="apui-sr-only">
          ({{ requirementMet(requirement.pattern, current) ? text.met : text.unmet }})</span
        >
      </li>
    </ul>
    <p v-if="hasHint()" v-bind="part('password', 'hint', classes?.hint)" :id="`${fieldId()}-hint`">
      {{ hint }}
    </p>
    <p
      v-if="hasError()"
      v-bind="part('password', 'error', classes?.error)"
      :id="`${fieldId()}-error`"
    >
      <DsIcon name="circle-alert" />{{ error }}
    </p>
  </div>
</template>
