<script setup lang="ts">
/**
 * @module AccordionItem
 *
 * One section of an Accordion: a heading (at the accordion's
 * `headingLevel`) holding the trigger, then the panel, which is the default
 * slot. `title` is a prop or the `title` slot. Attributes go to the item.
 */
import { inject, mergeProps, useAttrs } from 'vue';
import { DsIcon, part } from '../../_shared/design-system';
import { ACCORDION_KEY } from './keys';
import type { AccordionItemProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<AccordionItemProps>(), {
  title: undefined,
  disabled: false,
});

const attrs = useAttrs();
const accordion = inject(ACCORDION_KEY);
if (!accordion) throw new Error('[@artisanpack-ui/vue] AccordionItem must be inside an Accordion.');

function itemProps() {
  return { value: props.value, disabled: props.disabled || undefined };
}

function withClass(zagProps: unknown, className: string | undefined): Record<string, unknown> {
  const own = zagProps as Record<string, unknown>;
  return className ? mergeProps(own, { class: className }) : own;
}

function rootAttrs(): Record<string, unknown> {
  return mergeProps(
    attrs,
    accordion!.api().getItemProps(itemProps()) as Record<string, unknown>,
    accordion!.classOf('item') ? { class: accordion!.classOf('item') } : {},
  );
}
</script>

<template>
  <div v-bind="rootAttrs()">
    <component
      :is="`h${accordion!.level()}`"
      v-bind="part('accordion', 'title', accordion!.classOf('title'))"
    >
      <button
        v-bind="
          withClass(
            accordion!.api().getItemTriggerProps(itemProps()),
            accordion!.classOf('trigger'),
          )
        "
      >
        <slot name="title">{{ title }}</slot
        ><span
          v-bind="
            mergeProps(
              withClass(
                accordion!.api().getItemIndicatorProps(itemProps()),
                accordion!.classOf('chevron'),
              ),
              { 'aria-hidden': 'true' },
            )
          "
          ><DsIcon name="chevron-down"
        /></span>
      </button>
    </component>
    <div
      v-bind="
        withClass(accordion!.api().getItemContentProps(itemProps()), accordion!.classOf('content'))
      "
    >
      <slot />
    </div>
  </div>
</template>
