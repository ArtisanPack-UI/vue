<script setup lang="ts">
/**
 * @module AppShell
 *
 * The application frame (#58): a sidebar and a main column as islands
 * separated by a gutter. Renders the design-system AppShell markup contract
 * (`.apui-app-shell`): a skip link to the main landmark, the sidebar (an
 * aside named by `label`) with the brand, the navigation (usually a Menu)
 * and a footer, then the main landmark with the header (usually a Navbar
 * island) and the content (the default slot).
 *
 * `collapsible` adds a button that toggles `collapsed` (icon-only sidebar)
 * and emits `collapsed-change`. Replaces the deprecated Sidebar.
 */
import { computed, mergeProps, ref, useAttrs, useId, useSlots, watch } from 'vue';
import { DsIcon, flag, hasContent, part } from '../../_shared/design-system';
import type { AppShellPart, AppShellProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<AppShellProps>(), {
  collapsed: false,
  collapsible: false,
  sidebarWidth: undefined,
  gutter: undefined,
  brand: undefined,
  sidebar: undefined,
  header: undefined,
  footer: undefined,
  label: 'Sidebar',
  skipLabel: 'Skip to main content',
  collapseLabel: 'Collapse sidebar',
  classes: undefined,
});

const emit = defineEmits<{ 'collapsed-change': [collapsed: boolean] }>();

const attrs = useAttrs();
const slots = useSlots();
const id = useId();
const sidebarId = `apui-app-shell-${id}-sidebar`;
const mainId = `apui-app-shell-${id}-main`;

const isCollapsed = ref(props.collapsed);
watch(
  () => props.collapsed,
  (value) => (isCollapsed.value = value),
);

function toggle(): void {
  isCollapsed.value = !isCollapsed.value;
  emit('collapsed-change', isCollapsed.value);
}

function classOf(name: AppShellPart): string | undefined {
  return props.classes?.[name];
}

/** Whether a region renders: its slot has content, or its prop is set. */
function has(name: 'brand' | 'sidebar' | 'header' | 'footer'): boolean {
  const slot = slots[name];
  if (slot) return hasContent(slot());
  return props[name] !== undefined && props[name] !== '';
}

const style = computed(() => {
  const vars: Record<string, string> = {};
  if (props.sidebarWidth) vars['--apui-sidebar-width'] = props.sidebarWidth;
  if (props.gutter) vars['--apui-shell-gutter'] = props.gutter;
  return Object.keys(vars).length ? vars : undefined;
});

function rootAttrs(): Record<string, unknown> {
  return mergeProps(attrs, {
    class: ['apui-app-shell', props.classes?.root],
    style: style.value,
    'data-collapsed': flag(isCollapsed.value),
    'data-collapsible': flag(props.collapsible),
  });
}
</script>

<template>
  <div v-bind="rootAttrs()">
    <a v-bind="part('app-shell', 'skip-link', classOf('skipLink'))" :href="`#${mainId}`">{{
      skipLabel
    }}</a>
    <aside
      v-bind="part('app-shell', 'sidebar', classOf('sidebar'))"
      :id="sidebarId"
      :aria-label="label"
    >
      <div v-if="has('brand')" v-bind="part('app-shell', 'brand', classOf('brand'))">
        <slot name="brand">{{ brand }}</slot>
      </div>
      <slot name="sidebar">{{ sidebar }}</slot>
      <div
        v-if="has('footer') || collapsible"
        v-bind="part('app-shell', 'footer', classOf('footer'))"
      >
        <slot name="footer">{{ footer }}</slot>
        <button
          v-if="collapsible"
          v-bind="part('app-shell', 'collapse-trigger', classOf('collapseTrigger'))"
          type="button"
          :aria-label="collapseLabel"
          :aria-pressed="isCollapsed ? 'true' : 'false'"
          :aria-controls="sidebarId"
          @click="toggle"
        >
          <DsIcon name="chevron-left" />
        </button>
      </div>
    </aside>
    <main v-bind="part('app-shell', 'main', classOf('main'))" :id="mainId" tabindex="-1">
      <slot name="header">{{ header }}</slot>
      <div v-bind="part('app-shell', 'content', classOf('content'))"><slot /></div>
    </main>
  </div>
</template>
