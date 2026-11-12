<script setup lang="ts">
/**
 * @module Tab
 *
 * One tab of a Tabs: its `value`, `label`, `icon`, `count` and `disabled`
 * describe the trigger Tabs renders in the tablist, and the default slot is
 * its panel (`role=tabpanel`, hidden while another tab is selected).
 * Attributes go to the panel.
 */
import { inject, mergeProps, useAttrs } from 'vue';
import { TABS_KEY } from './keys';
import type { TabProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TabProps>(), {
  label: undefined,
  icon: undefined,
  count: undefined,
  disabled: false,
});

const attrs = useAttrs();
const tabs = inject(TABS_KEY);
if (!tabs) throw new Error('[@artisanpack-ui/vue] Tab must be inside a Tabs.');

function panelAttrs(): Record<string, unknown> {
  return mergeProps(
    attrs,
    tabs!.api().getContentProps({ value: props.value }) as Record<string, unknown>,
    { class: tabs!.classOf('content') },
  );
}
</script>

<template>
  <div v-bind="panelAttrs()"><slot /></div>
</template>
