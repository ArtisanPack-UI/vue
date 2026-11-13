/**
 * @module ThemeScript
 *
 * The blocking head snippet for ThemeToggle (#65): applies the stored theme
 * choice to `<html data-theme>` before first paint, so the page never
 * flashes the wrong theme. The same bytes as Livewire's `@apuiThemeScript`.
 * Render it in an SSR `<head>` (Nuxt's `useHead` takes `themeScript()`
 * directly).
 *
 * Client-rendered (a Vite SPA), Vue creates the `<script>` element and
 * inserts it, which runs it, but only once the app mounts, after the first
 * paint. For no flash in an SPA, put `<script>${themeScript()}</script>` in
 * index.html's `<head>` instead. The script records the choice it applied as
 * `<html data-theme-choice>`, so toggles with nothing stored start on
 * `defaultValue`.
 */
import { defineComponent, h, type PropType } from 'vue';
import { themeScript, type ThemeChoice } from '@artisanpack-ui/behavior';

export default defineComponent({
  name: 'ThemeScript',
  props: {
    /** The localStorage key; the same one the toggles use. */
    storageKey: { type: String, default: undefined },
    /** The choice without a stored one. */
    defaultValue: { type: String as PropType<ThemeChoice>, default: undefined },
    /** A CSP nonce for the inline script. */
    nonce: { type: String, default: undefined },
  },
  setup(props) {
    return () =>
      h('script', {
        nonce: props.nonce,
        innerHTML: themeScript({ storageKey: props.storageKey, defaultValue: props.defaultValue }),
      });
  },
});
