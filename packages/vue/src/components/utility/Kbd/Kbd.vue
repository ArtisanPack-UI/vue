<script setup lang="ts">
/**
 * @module Kbd
 *
 * A keyboard key or shortcut as `kbd` elements. Renders the design-system
 * Kbd markup contract (`.apui-kbd`, #65) with the keys from the behavior
 * package's `kbdKeys`, the same ones Blade and React show: `mod` is ⌘ on
 * Apple platforms and Ctrl elsewhere, and symbol keys carry their name as
 * hidden text.
 */
import { kbdKeys, type KbdLabels } from '@artisanpack-ui/behavior';
import { useApplePlatform } from '@artisanpack-ui/behavior/vue';
import { computed } from 'vue';
import { useTranslator } from '../../../i18n/translator';
import type { KbdProps } from './types';

const props = withDefaults(defineProps<KbdProps>(), {
  keys: undefined,
  size: 'md',
  platform: 'auto',
  labels: undefined,
  classes: undefined,
});

const apple = useApplePlatform(() => props.platform);
const { t } = useTranslator();
const names = computed<KbdLabels>(() => ({
  command: t('Command'),
  control: t('Control'),
  option: t('Option'),
  shift: t('Shift'),
  enter: t('Enter'),
  tab: t('Tab'),
  escape: t('Escape'),
  backspace: t('Backspace'),
  up: t('Up arrow'),
  down: t('Down arrow'),
  left: t('Left arrow'),
  right: t('Right arrow'),
  ...props.labels,
}));
const shown = computed(() => kbdKeys(props.keys, apple.value, names.value));
</script>

<template>
  <kbd
    v-if="shown.length === 0"
    :class="['apui-kbd', classes?.root, classes?.key]"
    data-scope="kbd"
    data-part="key"
    :data-size="size"
    ><slot
  /></kbd>
  <kbd
    v-else
    :class="['apui-kbd-combo', classes?.root, classes?.combo]"
    data-scope="kbd"
    data-part="combo"
    ><kbd
      v-for="(key, index) in shown"
      :key="index"
      :class="['apui-kbd', classes?.key]"
      data-scope="kbd"
      data-part="key"
      :data-size="size"
      ><template v-if="key.label === undefined">{{ key.text }}</template
      ><template v-else
        ><span aria-hidden="true">{{ key.text }}</span
        ><span class="apui-sr-only">{{ key.label }}</span></template
      ></kbd
    ></kbd
  >
</template>
