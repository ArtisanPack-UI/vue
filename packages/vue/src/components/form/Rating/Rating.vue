<script setup lang="ts">
/**
 * @module Rating
 *
 * Shows a star score (one image with a text alternative, half stars) or
 * collects one with native radios that share a name, so arrow keys change
 * the score and follow the text direction. Renders the design-system Rating
 * markup contract (`.apui-rating`, #53).
 */
import { computed, ref, useAttrs, useId, watch } from 'vue';
import { DsIcon, flag, part } from '../../_shared/design-system';
import { fillTemplate } from '../../_shared/choice';
import type { RatingProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<RatingProps>(), {
  modelValue: undefined,
  max: 5,
  readonly: false,
  disabled: false,
  size: 'md',
  count: undefined,
  label: undefined,
  valueLabel: ':value out of :max',
  countLabel: undefined,
  classes: undefined,
});

const emit = defineEmits<{
  'update:modelValue': [value: number];
}>();

const attrs = useAttrs();
const autoId = useId();

const score = ref(props.modelValue);
watch(
  () => props.modelValue,
  (value) => {
    score.value = value;
  },
);

const stars = computed(() => Array.from({ length: Math.max(0, props.max) }, (_, i) => i + 1));
const rounded = computed(() => Math.round((score.value ?? 0) * 2) / 2);

const format = (value: number) => String(Math.round(value * 10) / 10);
const valueText = (value: number) =>
  fillTemplate(props.valueLabel, { value: format(value), max: props.max });

const countText = computed(() => {
  if (props.count === undefined) return undefined;
  if (props.countLabel !== undefined) return fillTemplate(props.countLabel, { count: props.count });
  return props.count === 1 ? `(${props.count} review)` : `(${props.count} reviews)`;
});

function rootId(): string {
  return typeof attrs.id === 'string' && attrs.id !== '' ? attrs.id : autoId;
}

function rootAttrs(): Record<string, unknown> {
  const { class: className, name: _name, id: _id, ...rest } = attrs;
  const common = {
    ...rest,
    id: rootId(),
    class: ['apui-rating', className, props.classes?.root],
    'data-size': props.size,
    'data-disabled': flag(props.disabled),
  };
  return props.readonly
    ? { ...common, role: 'img', 'aria-label': valueText(score.value ?? 0), 'data-readonly': '' }
    : {
        ...common,
        role: 'radiogroup',
        'aria-label': props.label,
        'aria-disabled': props.disabled ? 'true' : undefined,
        'data-interactive': '',
      };
}

function starFill(star: number): 'filled' | 'half' | undefined {
  if (!props.readonly) return undefined;
  if (rounded.value >= star) return 'filled';
  return rounded.value >= star - 0.5 ? 'half' : undefined;
}

function onChange(event: Event): void {
  const next = Number((event.target as HTMLInputElement).value);
  score.value = next;
  emit('update:modelValue', next);
}
</script>

<template>
  <div v-bind="rootAttrs()">
    <template v-if="readonly">
      <span
        v-for="star in stars"
        :key="star"
        v-bind="
          part('rating', 'star', classes?.star, {
            'aria-hidden': 'true',
            'data-filled': flag(starFill(star) === 'filled'),
            'data-half': flag(starFill(star) === 'half'),
          })
        "
        ><DsIcon name="star" /><span v-bind="part('rating', 'half', classes?.half)"
          ><DsIcon name="star" /></span
      ></span>
    </template>
    <template v-else>
      <label v-for="star in stars" :key="star" v-bind="part('rating', 'item', classes?.item)">
        <input
          v-bind="part('rating', 'control', classes?.control)"
          :id="`${rootId()}-${star}`"
          type="radio"
          :name="typeof attrs.name === 'string' && attrs.name !== '' ? attrs.name : rootId()"
          :value="star"
          :aria-label="valueText(star)"
          :checked="score === star"
          :disabled="disabled || undefined"
          @change="onChange"
        />
        <span v-bind="part('rating', 'star', classes?.star, { 'aria-hidden': 'true' })"
          ><DsIcon name="star" /><span v-bind="part('rating', 'half', classes?.half)"
            ><DsIcon name="star" /></span
        ></span>
      </label>
    </template>
    <span
      v-if="score !== undefined && score !== null"
      v-bind="part('rating', 'value', classes?.value, { 'aria-hidden': 'true' })"
      >{{ format(score) }}</span
    >
    <span
      v-if="countText !== undefined"
      v-bind="part('rating', 'count', classes?.count, readonly ? { 'aria-hidden': 'true' } : {})"
      >{{ countText }}</span
    >
  </div>
</template>
