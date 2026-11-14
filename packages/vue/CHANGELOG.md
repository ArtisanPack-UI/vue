# @artisanpack-ui/vue

## 2.0.0

### Major Changes

- [#63](https://github.com/ArtisanPack-UI/vue/pull/63) [`41bc218`](https://github.com/ArtisanPack-UI/vue/commit/41bc2188c11c07ee4892e021bf17e809a407d0e6) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - 2.0: the packages run on the ArtisanPack UI design system, with no DaisyUI and no Tailwind requirement. Load `@artisanpack-ui/css`; see the upgrade guide at https://docs.artisanpackui.dev/documentation/vue/upgrading.

  `@artisanpack-ui/vue`:
  - The deprecated 2.x components are thin aliases of their replacements, so they render design-system markup and keep working until the next major: `Modal` (Dialog), `Dropdown` and `DropdownItem` (DropdownMenu), `SpotlightSearch` (Spotlight), `Sidebar` (AppShell), `Radio` (RadioGroup), `Editor` (CodeEditor), and `ToastProvider` and `ToastMessage` (Toaster and Toast). Each maps its 2.x props, passes its replacement's props through and warns once in development. 2.x props with no equivalent are ignored: Modal `bottom`, Dropdown `top` and `hover`, Sidebar `open`, `side` and `responsive`, Radio `color`.
  - The AI components (`/ai`) take a `labels` prop for their built-in text, with English defaults (`SettingsPageLabels`, `UsageDashboardLabels`, `FeatureTogglesLabels`).
  - `useBreakpoint()` reads the viewport again on mount, so a server-rendered page no longer stays on `'md'`.
  - The AI `SettingsPage` ignores a save that answers after its `client` changed.
  - The declarations resolve under `moduleResolution: node16` and `nodenext`.
  - Both packages are marked `"sideEffects": false`.
  - **Breaking:** the 1.x `DaisyColor`, `Size`, `GlassProps`, `ColorProps` and `FormFieldProps` types are no longer exported, and `daisyui` is no longer a dev dependency.

  `@artisanpack-ui/vue-laravel`:
  - **Breaking:** `useFlashMessages()` and `FlashToasts` show flash messages with `toast.create()` instead of the deprecated `ToastProvider`. `FlashToasts` renders a `Toaster` (pass `:region="false"` when the page has one) and takes Toaster props; both take a `toaster`. Colors are the design-system toast colors (`FlashToastColor`), and a `colorMap` now merges over the defaults.
  - The plugin's `flashColorMap` option now applies to `useFlashMessages()` and `FlashToasts`, under a component's own `colorMap`.
  - `createArtisanPackUILaravel()` registers `InertiaRadioGroup`.
  - `InertiaBreadcrumbs` renders the design-system Breadcrumbs with Inertia links, and takes its props (`label`, `maxItems`).
  - `AppLayout`, `AuthLayout` and `GuestLayout` lay out on design-system Stacks and no longer need Tailwind.
  - `InertiaForm`'s slot props are typed as the booleans they are (`processing`, `recentlySuccessful`, `isDirty`).

### Minor Changes

- [#57](https://github.com/ArtisanPack-UI/vue/pull/57) [`7c83017`](https://github.com/ArtisanPack-UI/vue/commit/7c83017270fd6ff875cb73506672c125383fe421) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - Add the `@artisanpack-ui/vue/ai` subpath: `SettingsPage`, `UsageDashboard` and `FeatureToggles` components that consume the `artisanpack-ui/ai` JSON API, plus `createAiApiClient` and the `useStreamingText` composable. `@artisanpack-ui/vue-laravel` has no source changes and bumps alongside.

- [#55](https://github.com/ArtisanPack-UI/vue/pull/55) [`d03e06b`](https://github.com/ArtisanPack-UI/vue/commit/d03e06b30ad960a62a71e1d9872c06024bdf765d) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - Add Chart, Calendar and the Utility wave on the design system (ArtisanPack-UI/design-system#63 to [#65](https://github.com/ArtisanPack-UI/vue/issues/65)). They render the shared markup contract styled by `@artisanpack-ui/css`, with logic from `@artisanpack-ui/behavior`, so markup, keyboard and ARIA match Livewire and React.
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

- [#53](https://github.com/ArtisanPack-UI/vue/pull/53) [`aee21b6`](https://github.com/ArtisanPack-UI/vue/commit/aee21b6f2d48e07de40461aae0ccda8b01086be7) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - Add the Form and Navigation waves, Combobox, DatePicker and Spotlight on the design system (ArtisanPack-UI/design-system#53 to [#57](https://github.com/ArtisanPack-UI/vue/issues/57)). They render the shared markup contract styled by `@artisanpack-ui/css`, and the widgets run on the behavior engine (`@artisanpack-ui/behavior/vue`), so markup, keyboard and ARIA match Livewire and React.
  - New: `Combobox` (local filtering or `remote`, `multiple` with chips, `allowCreate` for tags), `RadioGroup`, `CheckboxGroup`, `Rating`, `Fieldset`, `Form`, `ValidationSummary`, `Signature`, `CodeEditor`, `Link`, `Spotlight`, `NavbarItem`, `BreadcrumbsItem`, and `MenuItem`, `MenuSub`, `MenuTitle` and `MenuSeparator` for composed menus.
  - Rebuilt in place on the design system, with breaking prop changes listed in each component's docs: `Textarea`, `Password`, `Pin`, `Range`, `Toggle`, `ColorPicker` (spec popover on the color-picker machine), `File`, `DatePicker` (with a `time` mode, ISO values), `RichTextEditor`, `Breadcrumbs`, `Pagination` (`page`, `pageCount`, `v-model:page`), `Steps` (1-based `v-model`), `Tabs`, `Menu` and `Navbar`. `Select` takes option groups.
  - `MENU_LINK_KEY` lets a wrapper provide a router's link component (Inertia's `Link`, `RouterLink`) for Menu items. `InertiaMenu` in `vue-laravel` uses it and keeps its 2.x item shape (`name`, `href`, `active`, `children`) and `select` event.
  - Built-in strings are `*Label` props with English defaults, so apps can translate them.

  Deprecated, still exported: `Radio` (use `RadioGroup`), `FileUpload` (use `File`), `Editor` (use `CodeEditor`) and `SpotlightSearch` (use `Spotlight`). They'll be removed in a later major release.

- [#54](https://github.com/ArtisanPack-UI/vue/pull/54) [`4d6bdfb`](https://github.com/ArtisanPack-UI/vue/commit/4d6bdfb170eca5f175bc0851540ebab081373c8e) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - Add the Layout, Feedback and Data Display waves, Tooltip and Table on the design system (ArtisanPack-UI/design-system#58 to [#62](https://github.com/ArtisanPack-UI/vue/issues/62)). They render the shared markup contract styled by `@artisanpack-ui/css`, and the widgets run on the behavior engine (`@artisanpack-ui/behavior/vue`), so markup, keyboard and ARIA match Livewire and React.
  - New: `AppShell`, `PageHeader`, `AccordionItem`, `Heading`, `Text`, `List` and `ListItem`, `UserMenu`, `AvatarGroup`, `ProgressRadial`, `ErrorState`, `KpiCard`, `TimelineItem`, `ImageGallery` and `ImageSlider`.
  - Rebuilt in place on the design system, with breaking prop changes listed in each component's docs: `Accordion` (value-based), `Collapse`, `Divider`, `Grid` (`columns`, `minItemWidth`, `gap`), `Stack` (`orientation`), `Drawer` (opens at the end edge by default), `Popover`, `Tooltip` (`content`, logical `placement`; it takes your own control as the trigger), `Avatar`, `Badge`, `Alert` (dismisses itself), `Loading`, `Progress`, `Skeleton`, `EmptyState`, `Stat`, `Sparkline`, `Timeline`, `Diff` and `Table` (sorting, selection, expandable rows, `#cell-<key>` and other scoped slots, pagination).
  - Built-in strings are `*Label` props with English defaults, so apps can translate them.

  Removed exports: `ACCORDION_KEY` and the `AccordionContext` type (Accordion now runs on the behavior engine), and the `ColCount` and `GapSize` Grid types (use `GridGap`).

  Deprecated, still exported: `Sidebar` (use `AppShell`) and `ErrorDisplay` (use `ErrorState`).

- [#52](https://github.com/ArtisanPack-UI/vue/pull/52) [`4b95a1e`](https://github.com/ArtisanPack-UI/vue/commit/4b95a1e24cc3fbe0e1ab59dd3d657c0ce1c26f69) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - Add Dialog, DropdownMenu and Toast on the design system (ArtisanPack-UI/design-system#49 to [#51](https://github.com/ArtisanPack-UI/vue/issues/51)), built on the shared Zag behavior engine through `@artisanpack-ui/behavior/vue`.
  - `Dialog`: `v-model:open`, focus trap, Escape and backdrop dismissal, scroll lock, focus return, `role="alertdialog"` for confirmations, and a `trigger` prop or slot.
  - `DropdownMenu` with `DropdownMenuItem`, `DropdownMenuGroup` and `DropdownMenuSeparator`, or the same children from `items`: arrow keys, typeahead, `select` and `checked-change`.
  - `Toast` (static), `Toaster` (the region) and the `toast` toaster: `toast.create({ title, description, color, action })`. `createToaster()` makes a separate stack.
  - Overlays take `portal` (default true) and teleport to the body. Dialog, Toast and Toaster take `closeLabel` to name (and translate) the close button.
  - `@zag-js/vue` is now a dependency.

  Modal, Dropdown/DropdownItem and ToastProvider/ToastMessage/useToast are deprecated in favor of these and stay exported for now.

### Patch Changes

- [#64](https://github.com/ArtisanPack-UI/vue/pull/64) [`bdef7a7`](https://github.com/ArtisanPack-UI/vue/commit/bdef7a745879a54fffb5c56733420adefd9348d8) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - Depend on the published design-system packages: `@artisanpack-ui/behavior` `^1.0.0` instead of a local path. The unused `@artisanpack-ui/tokens` 1.x dependency is gone from both packages, since the design tokens now ship with `@artisanpack-ui/css`.

- [#57](https://github.com/ArtisanPack-UI/vue/pull/57) [`2d2ccf1`](https://github.com/ArtisanPack-UI/vue/commit/2d2ccf1714dcef4be426cd54ad1efaee60bc036a) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - Ship a declaration file for every subpath export (`/form`, `/layout`, `/navigation`, `/display`, `/data`, `/feedback`, `/utility`, `/composables`, `/ai`). They were declared in `package.json` but never written, so subpath imports resolved untyped (TS7016).

## 1.0.1

### Patch Changes

- [#50](https://github.com/ArtisanPack-UI/vue/pull/50) [`f8fd82a`](https://github.com/ArtisanPack-UI/vue/commit/f8fd82ad6e2e78f0ddc6e7f3f5ece0adfb18f91e) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - Depend on `@artisanpack-ui/tokens` `^1.0.1` instead of `*`. The tokens package moved to the design-system repo, and its next release is a breaking 2.0.0, so this keeps installs on 1.x.

## 1.0.0

### Major Changes

- [#30](https://github.com/ArtisanPack-UI/vue/pull/30) [`1fe6722`](https://github.com/ArtisanPack-UI/vue/commit/1fe67223ba9820c8b6c54d0f3bab18ce0abd5b1c) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - Initial v1.0.0 release — 56+ Vue 3 UI components with DaisyUI/Tailwind CSS styling, tree-shakeable category exports, composables, and Inertia.js Laravel adapter
