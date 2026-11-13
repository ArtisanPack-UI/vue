<script setup lang="ts">
/**
 * @module ThemeToggle
 *
 * Lets people choose light, dark, high contrast or system (#65). A choice
 * sets `data-theme` on the document (the attribute the tokens switch on),
 * persists in localStorage and follows the OS live while it's `system`,
 * through the theme helpers in `@artisanpack-ui/behavior`. Render
 * `ThemeScript` (or `themeScript()`) in `<head>` so the stored choice applies
 * before first paint.
 *
 * Segmented is a radio group on the segmented Tabs track; icon is one ghost
 * button that switches light and dark; menu is a DropdownMenu of radio items.
 * Bind the choice with `v-model`: a pick only emits `update:modelValue`, and
 * the toggle applies, stores and passes on a value when the parent changes
 * `modelValue` to it, never the one it mounts with. Unbound, it starts on the
 * stored choice, else the one ThemeScript applied, else `system`, which it
 * applies only while `<html>` has no `data-theme`.
 *
 * Under a 2.x `provideTheme()` the toggle keeps driving it: it starts from the
 * provider's `colorScheme`, calls `setColorScheme` on every pick and follows
 * the provider when something else sets it. The provider only knows light,
 * dark and system, so high contrast reaches it as `light` (the theme high
 * contrast is built on), and the provider's `light` leaves a high contrast
 * choice in place.
 */
import {
  computed,
  getCurrentInstance,
  inject,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  watch,
} from 'vue';
import {
  applyTheme,
  directionOf,
  isThemeChoice,
  nextIconTheme,
  readThemeChoice,
  resolveTheme,
  startThemeChoice,
  THEME_ICONS,
  THEME_STORAGE_KEY,
  themeChoiceLabel,
  themeChoices,
  themeToggleKey,
  themeToggleLabels,
  watchTheme,
  type Theme,
  type ThemeChoice,
} from '@artisanpack-ui/behavior';
import { ThemeKey } from '../../../composables/use-theme';
import type { ColorScheme } from '../../../types/theme';
import { DsIcon, flag, part } from '../../_shared/design-system';
import Button from '../../form/Button/Button.vue';
import ThemeToggleMenu from './ThemeToggleMenu.vue';
import type { ThemeToggleProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ThemeToggleProps>(), {
  modelValue: undefined,
  variant: 'segmented',
  size: 'md',
  choices: undefined,
  iconOnly: false,
  label: undefined,
  lightLabel: undefined,
  darkLabel: undefined,
  highContrastLabel: undefined,
  systemLabel: undefined,
  matchSystemLabel: undefined,
  switchToLightLabel: undefined,
  switchToDarkLabel: undefined,
  persist: true,
  storageKey: THEME_STORAGE_KEY,
  classes: undefined,
});

const emit = defineEmits<{ 'update:modelValue': [value: ThemeChoice] }>();

const attrs = useAttrs();
const instance = getCurrentInstance();

/** Whether the parent passes `modelValue`; then the toggle shows only what it says. */
function isBound(): boolean {
  const raw = instance?.vnode.props;
  return !!raw && ('modelValue' in raw || 'model-value' in raw);
}

/** A 2.x `provideTheme()` above the toggle, if any. */
const provider = inject(ThemeKey, null);

/** What a 2.x provider hears for a choice: high contrast is a light theme. */
function toColorScheme(choice: ThemeChoice): ColorScheme {
  return choice === 'high-contrast' ? 'light' : choice;
}

const own = ref<ThemeChoice>(
  provider && isThemeChoice(provider.colorScheme.value) ? provider.colorScheme.value : 'system',
);
// The OS scheme is unknown on the server, so the first render reads it as light.
const systemDark = ref(false);

const current = computed<ThemeChoice>(() => {
  if (isBound()) return isThemeChoice(props.modelValue) ? props.modelValue : 'system';
  return own.value;
});
const resolved = computed<Theme>(() =>
  current.value === 'system' ? (systemDark.value ? 'dark' : 'light') : (current.value as Theme),
);
const offered = computed(() => themeChoices(props.choices));
const labels = computed(() =>
  themeToggleLabels({
    label: props.label,
    lightLabel: props.lightLabel,
    darkLabel: props.darkLabel,
    highContrastLabel: props.highContrastLabel,
    systemLabel: props.systemLabel,
    matchSystemLabel: props.matchSystemLabel,
    switchToLightLabel: props.switchToLightLabel,
    switchToDarkLabel: props.switchToDarkLabel,
  }),
);
const stop = computed(() =>
  offered.value.includes(current.value) ? current.value : offered.value[0],
);
const next = computed(() => nextIconTheme(resolved.value));

let unwatch: (() => void) | undefined;

onMounted(() => {
  systemDark.value = resolveTheme('system') === 'dark';
  if (!isBound()) {
    const stored = props.persist ? readThemeChoice(props.storageKey) : null;
    if (stored) {
      own.value = stored;
      provider?.setColorScheme(toColorScheme(stored));
    } else if (provider) {
      // Nothing stored: the provider's scheme is the choice, so show it.
      applyTheme(own.value, { persist: false, broadcast: false });
    } else {
      // Nothing stored: what ThemeScript applied, else the default.
      own.value = startThemeChoice(own.value);
    }
  }
  unwatch = watchTheme(
    ({ value, source }) => {
      // A bound toggle shows its parent's value and an unpersisted one ignores
      // storage, so neither follows (or applies) another tab's choice.
      if (source === 'storage' && (!props.persist || isBound())) return;
      if (value) {
        if (!isBound()) {
          own.value = value;
          provider?.setColorScheme(toColorScheme(value));
        }
        if (source === 'storage') applyTheme(value, { persist: false, broadcast: false });
      } else {
        systemDark.value = resolveTheme('system') === 'dark';
        if (current.value === 'system') applyTheme('system', { persist: false, broadcast: false });
      }
    },
    { storageKey: props.storageKey },
  );
});

onBeforeUnmount(() => unwatch?.());

// Something else set the provider's scheme: an unbound toggle follows it,
// unless it already means the same (high contrast under `light`).
if (provider) {
  watch(provider.colorScheme, (scheme) => {
    if (isBound() || !isThemeChoice(scheme) || toColorScheme(current.value) === scheme) return;
    own.value = scheme;
    applyTheme(scheme, { persist: props.persist, storageKey: props.storageKey });
  });
}

// The parent changed a bound value: apply, store and pass it on. The value it
// mounts with isn't applied (ThemeScript did, or docs pages show fixed values).
watch(
  () => props.modelValue,
  (value) => {
    if (!isBound() || !isThemeChoice(value)) return;
    applyTheme(value, { persist: props.persist, storageKey: props.storageKey });
    provider?.setColorScheme(toColorScheme(value));
  },
);

/**
 * Applies a choice, stores it and reports it when it changed. Bound, it only
 * reports it; the parent accepting it applies it.
 */
function choose(choice: unknown): void {
  if (!isThemeChoice(choice)) return;
  const changed = choice !== current.value;
  if (isBound()) {
    if (changed) emit('update:modelValue', choice);
    return;
  }
  own.value = choice;
  applyTheme(choice, { persist: props.persist, storageKey: props.storageKey });
  provider?.setColorScheme(toColorScheme(choice));
  if (changed) emit('update:modelValue', choice);
}

function onKeydown(event: KeyboardEvent): void {
  const group = event.currentTarget as HTMLElement;
  const focused = (event.target as Element | null)
    ?.closest('[role="radio"]')
    ?.getAttribute('data-value');
  const from = isThemeChoice(focused) ? focused : current.value;
  const target = themeToggleKey(event.key, from, offered.value, directionOf(group));
  if (!target) return;
  event.preventDefault();
  choose(target);
  group.querySelector<HTMLElement>(`[role="radio"][data-value="${target}"]`)?.focus();
}

function rootAttrs(): Record<string, unknown> {
  return {
    ...attrs,
    class: [
      'apui-theme-toggle',
      props.variant === 'segmented' ? 'apui-tabs' : undefined,
      props.classes?.root,
      attrs.class,
    ],
    'data-scope': 'theme-toggle',
    'data-part': 'root',
    'data-variant': props.variant,
    'data-size': props.size,
    'data-icon-only': flag(props.variant === 'segmented' && props.iconOnly),
    'data-value': current.value,
  };
}

const nameOf = (choice: ThemeChoice) => themeChoiceLabel(choice, labels.value);
const menuNameOf = (choice: ThemeChoice) => themeChoiceLabel(choice, labels.value, true);
</script>

<template>
  <div v-bind="rootAttrs()">
    <Button
      v-if="variant === 'icon'"
      variant="ghost"
      color="neutral"
      :size="size"
      icon-only
      :class="classes?.button"
      :aria-label="next === 'light' ? labels.switchToLightLabel : labels.switchToDarkLabel"
      @click="choose(next)"
      ><template #icon><DsIcon :name="next === 'light' ? 'sun' : 'moon'" /></template
    ></Button>
    <ThemeToggleMenu
      v-else-if="variant === 'menu'"
      :current="current"
      :offered="offered"
      :size="size"
      :label="labels.label"
      :item-label="menuNameOf"
      :classes="classes"
      @choose="choose"
    />
    <div
      v-else
      v-bind="
        part('tabs', 'list', classes?.list, { role: 'radiogroup', 'aria-label': labels.label })
      "
      @keydown="onKeydown"
    >
      <button
        v-for="choice in offered"
        :key="choice"
        type="button"
        v-bind="
          part('tabs', 'trigger', classes?.option, {
            role: 'radio',
            'data-value': choice,
            'aria-checked': current === choice ? 'true' : 'false',
            tabindex: stop === choice ? 0 : -1,
          })
        "
        @click="choose(choice)"
      >
        <span v-bind="part('tabs', 'icon', undefined, { 'aria-hidden': 'true' })"
          ><DsIcon :name="THEME_ICONS[choice]" /></span
        ><span v-if="iconOnly" class="apui-sr-only">{{ nameOf(choice) }}</span
        ><template v-else>{{ nameOf(choice) }}</template>
      </button>
    </div>
  </div>
</template>
