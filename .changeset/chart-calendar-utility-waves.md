---
'@artisanpack-ui/vue': minor
---

Add Chart, Calendar and the Utility wave on the design system (ArtisanPack-UI/design-system#63 to #65). They render the shared markup contract styled by `@artisanpack-ui/css`, with logic from `@artisanpack-ui/behavior`, so markup, keyboard and ARIA match Livewire and React.

- New: `Kbd`, `Swap` and `ThemeScript` (applies the stored theme before first paint).
- Rebuilt in place on the design system, with breaking prop changes: `Chart` (its own SVG; `series` plus `labels`, `title` required, `tabular`; ApexCharts is no longer a peer dependency), `Calendar` (month, week, day and agenda; `date`, `weekStartsOn`), `Markdown` (GitHub-flavored, raw HTML escaped; `mode` write and split), `Code` (`numbered`, `highlight`, `fileName`, copy), `Clipboard` (`value`, `copiedLabel`, `timeout`), `Icon` (sizes, `tile`, `label`), `Carousel` (`perView`, `loop`, `autoplay` with a pause control) and `ThemeToggle` (light, dark, high contrast and system; `choices`).
- Built-in strings are `*Label` props with English defaults, so apps can translate them.

Upgrade notes:

- `ThemeToggle` persists under a new default storage key, `apui-theme` (was `artisanpack-color-scheme`); pass `storage-key="artisanpack-color-scheme"` to keep reading choices people already stored. It no longer requires `provideTheme()`; under one it still drives the provider (it starts from `colorScheme`, calls `setColorScheme` on every pick and follows outside changes), and high contrast reaches the provider as `light`.
- `Calendar`: the deprecated 2.x `month` prop is 1–12, as in 2.x (clamped), with `year`. The 2.x `month-change` event still fires, deprecated, as `{ month (1–12), year }` whenever the shown month or year changes; use `date-change` / `v-model:date` instead. **Breaking:** the 2.x `date-click` event is removed; days are no longer selectable. Use `date-change` for navigation, `event-click` for events, or `create` (with `creatable`) to add an event on the shown date.
- `Clipboard`'s `text` still works as a deprecated alias of `value`/`modelValue`. Renamed with no alias: `Carousel`'s `v-model` (`modelValue` / `update:modelValue`) is now the `index` prop with the `index-change` event; `Code` no longer emits `copy-failed` (a failed copy is announced in the copy button's live region, and `error-message` sets the text); the `ChartDataPoint` type is no longer exported (use `ChartSeries`, with `data` lined up with `labels`; a donut is one series).

Fixes from the PR review:

- `ThemeToggle`: a controlled (`value` / `v-model`) pick only reports the choice; the toggle applies, stores and passes it to a 2.x provider when the parent changes the value to it (not on mount). An uncontrolled toggle with nothing stored starts on `ThemeScript`'s default and applies its own default only to a page with no `data-theme`. Controlled and unpersisted toggles ignore other tabs' stored choices.
- `Clipboard`: the success event is `copied` (`onCopied` in React); `copy` / `onCopy` stay as deprecated aliases that never catch native copies. A new value clears a stale "Copied", and a failed copy shows the value selected so it can be copied by hand.
- `Code` copies the exact source. `Carousel` keeps a caller's `aria-label`, keys slides by a unique `id` and puts the autoplay control first in the Tab order. `Icon` keeps a caller's `aria-label` / `aria-labelledby`. `Swap` follows a form reset.
- `Calendar`: "+N more" moves focus to the day it opens. `Markdown`'s preview shows the edited draft after a write-to-preview switch, and a rejected controlled edit doesn't appear. `Chart`'s lines, areas and dots are keyed by position. Vue's Calendar emits `update:modelValue` even when the 2.x v-model starts empty.
