<script setup lang="ts">
/**
 * @module MenuTitle
 *
 * A section title between a Menu's items. The default slot is its text.
 */
import { inject } from 'vue';
import { part } from '../../_shared/design-system';
import { MENU_KEY } from './keys';

const menu = inject(MENU_KEY);
if (!menu) throw new Error('[@artisanpack-ui/vue] MenuTitle must be inside a Menu.');
</script>

<template>
  <li v-bind="part('menu', 'title', menu!.classOf('title'))"><slot /></li>
</template>
