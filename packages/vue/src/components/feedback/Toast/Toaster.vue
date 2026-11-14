<script setup lang="ts">
/**
 * @module Toaster
 *
 * The toast region: a labelled `aria-live` landmark at the bottom end of the
 * viewport that shows toasts created from data, stacked, timed and paused on
 * hover and focus (`useToaster`). Put one on the page, then call
 * `toast.create({ … })`. Teleported to the body.
 */
import { computed, mergeProps, onBeforeUnmount, onMounted, shallowRef } from 'vue';
import { createToaster, useToaster } from '@artisanpack-ui/behavior/vue';
import ToasterToast from './ToasterToast.vue';
import { activateToaster, defaultToaster, rendersStore, type ToasterRoute } from './toaster';
import type { ToasterProps } from './types';

const props = withDefaults(defineProps<ToasterProps>(), {
  placement: undefined,
  max: undefined,
  gap: undefined,
  duration: undefined,
  offsets: undefined,
  toaster: undefined,
  label: 'Notifications',
  closeLabel: undefined,
  classes: undefined,
});

/**
 * The toaster to render: the `toaster` prop, else one made from the region
 * options, else the default `toast` toaster. Read once, at setup: a region
 * keeps its store for its lifetime, so later changes to these props don't apply.
 */
function resolveToaster() {
  if (props.toaster) return { instance: props.toaster, owned: false };
  const { placement, max, gap, duration, offsets } = props;
  const options = Object.fromEntries(
    Object.entries({ placement, max, gap, duration, offsets }).filter(
      ([, value]) => value !== undefined,
    ),
  );
  const instance = Object.keys(options).length ? createToaster(options) : defaultToaster;
  return { instance, owned: true };
}

const { instance, owned } = resolveToaster();

/** This region's route for `toast`, once mounted. */
const route = shallowRef<ToasterRoute>();
let release: (() => void) | undefined;

// Without its own `toaster`, this region is where `toast.create()` goes. Only
// on the client, after mounting, so server rendering never registers it.
onMounted(() => {
  if (!owned) return;
  const activation = activateToaster(instance);
  route.value = activation.route;
  release = activation.release;
});
onBeforeUnmount(() => {
  release?.();
  release = undefined;
});

/** Whether this region renders its store: not while a newer region renders it too. */
const visible = computed(() => rendersStore(instance, route.value));

const machine = useToaster({ toaster: instance });

/**
 * The machine's API, re-wrapped in this package's `computed`: the
 * composable's ref is typed by the design system's copy of Vue, which the
 * template type-check wouldn't unwrap.
 */
const region = computed(() => machine.value);

function groupAttrs(): Record<string, unknown> {
  const own = region.value.getGroupProps({ label: props.label });
  return props.classes?.group ? mergeProps(own, { class: props.classes.group }) : own;
}
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" v-bind="groupAttrs()">
      <ToasterToast
        v-for="(entry, index) in region.toasts"
        :key="entry.id"
        :entry="entry"
        :service="region.service"
        :index="index"
        :classes="classes"
        :close-label="closeLabel"
      />
    </div>
  </Teleport>
</template>
