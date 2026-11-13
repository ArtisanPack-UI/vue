<script setup lang="ts">
/**
 * @module MenuSeparator
 *
 * A rule between a Menu's items, hidden from assistive technology.
 */
import { inject } from 'vue';
import { part } from '../../_shared/design-system';
import { MENU_KEY } from './keys';

const menu = inject(MENU_KEY);
if (!menu) throw new Error('[@artisanpack-ui/vue] MenuSeparator must be inside a Menu.');
</script>

<template>
  <li v-bind="part('menu', 'separator', menu!.classOf('separator'), { 'aria-hidden': 'true' })" />
</template>
