<script setup lang="ts">
/**
 * @module Step
 *
 * One step of a Steps: the marker, title, connector and description.
 */
import { computed, inject, useSlots } from 'vue';
import { DsIcon, hasContent, part } from '../../_shared/design-system';
import { STEPS_KEY } from './keys';
import type { StepProps, StepState } from './types';

const props = withDefaults(defineProps<StepProps>(), {
  title: undefined,
  description: undefined,
  state: undefined,
  icon: undefined,
  step: 1,
});

const steps = inject(STEPS_KEY, null);
const slots = useSlots();

const STATES: readonly StepState[] = ['complete', 'current', 'upcoming', 'error'];

const resolved = computed<StepState>(() => {
  if (props.state !== undefined && STATES.includes(props.state)) return props.state;
  const value = steps?.value.value;
  if (value === undefined) return 'upcoming';
  return props.step < value ? 'complete' : props.step === value ? 'current' : 'upcoming';
});

const markerIcon = computed(
  () =>
    props.icon ??
    (resolved.value === 'complete' ? 'check' : resolved.value === 'error' ? 'x' : undefined),
);

const stateLabel = computed(() => {
  if (resolved.value === 'complete') return steps?.completeLabel.value ?? 'Completed';
  if (resolved.value === 'error') return steps?.errorLabel.value ?? 'Error';
  return null;
});

const isButton = computed(() => resolved.value === 'complete' && steps?.clickable.value === true);
const hasDescription = computed(() => props.description !== undefined && props.description !== '');
const classOf = (name: Parameters<NonNullable<typeof steps>['classOf']>[0]) => steps?.classOf(name);
const hasSlot = () => hasContent(slots.default?.());
</script>

<template>
  <li
    :class="classOf('step')"
    data-scope="steps"
    data-part="step"
    :data-state="resolved"
    :aria-current="resolved === 'current' ? 'step' : undefined"
  >
    <span v-bind="part('steps', 'marker', classOf('marker'))"
      ><DsIcon v-if="markerIcon !== undefined" :name="markerIcon" /><span
        v-else
        aria-hidden="true"
        >{{ step }}</span
      ><span v-if="stateLabel !== null" class="apui-sr-only">{{ stateLabel }}</span></span
    >
    <button
      v-if="isButton"
      type="button"
      v-bind="part('steps', 'title', classOf('title'))"
      @click="steps?.select(step)"
    >
      <slot v-if="hasSlot()" />
      <template v-else>{{ title }}</template>
    </button>
    <span v-else v-bind="part('steps', 'title', classOf('title'))">
      <slot v-if="hasSlot()" />
      <template v-else>{{ title }}</template>
    </span>
    <span v-bind="part('steps', 'connector', classOf('connector'), { 'aria-hidden': 'true' })" />
    <span v-if="hasDescription" v-bind="part('steps', 'description', classOf('description'))">{{
      description
    }}</span>
  </li>
</template>
