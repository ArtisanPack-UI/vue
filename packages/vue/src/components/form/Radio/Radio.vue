<script setup lang="ts">
/**
 * @module Radio
 *
 * @deprecated Use RadioGroup, the design-system replacement (#53). Radio is
 * a thin alias that renders a RadioGroup and maps its 2.x props: each
 * option's `optionValue` / `optionLabel` / `optionHint` keys (default `id`,
 * `name`, `hint`; the value falls back to the option's index) become
 * RadioGroup's `{ value, label, description, disabled }`, `inline` →
 * `orientation="horizontal"`, `card` → `variant="cards"` and `cardClass` →
 * `classes.item`. `color` has no equivalent (radios use the primary color)
 * and is ignored. `id`, `name` and every other attribute, including
 * RadioGroup's own props, pass through.
 */
import { computed } from 'vue';
import RadioGroup from '../RadioGroup/RadioGroup.vue';
import { warnOnce } from '../../_shared/design-system';
import type { ChoiceOptionObject, ChoiceValue } from '../../_shared/choice';
import type { RadioProps } from './types';

const props = withDefaults(defineProps<RadioProps>(), {
  label: undefined,
  hint: undefined,
  error: undefined,
  color: undefined,
  optionValue: 'id',
  optionLabel: 'name',
  optionHint: 'hint',
  options: () => [],
  inline: false,
  card: false,
  cardClass: undefined,
  id: undefined,
  name: undefined,
  required: false,
});

const model = defineModel<string | number>();

warnOnce('Radio', 'Radio is deprecated; use RadioGroup.');

/** The 2.x options in RadioGroup's shape. */
const choices = computed<ChoiceOptionObject[]>(() =>
  props.options.map((option, index) => {
    const raw = option[props.optionValue];
    const hint = option[props.optionHint];
    return {
      value: raw !== undefined && raw !== null ? (raw as ChoiceValue) : index,
      label: String(option[props.optionLabel] ?? ''),
      description: hint ? String(hint) : undefined,
      disabled: option.disabled === true,
    };
  }),
);

const classes = computed(() => (props.cardClass ? { item: props.cardClass } : undefined));
</script>

<template>
  <RadioGroup
    v-model="model"
    :id="id"
    :name="name"
    :options="choices"
    :label="label"
    :hint="hint"
    :error="error"
    :required="required"
    :orientation="inline ? 'horizontal' : undefined"
    :variant="card ? 'cards' : undefined"
    :classes="classes"
  />
</template>
