# @artisanpack-ui/vue-laravel

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

- [#53](https://github.com/ArtisanPack-UI/vue/pull/53) [`aee21b6`](https://github.com/ArtisanPack-UI/vue/commit/aee21b6f2d48e07de40461aae0ccda8b01086be7) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - Add the Form and Navigation waves, Combobox, DatePicker and Spotlight on the design system (ArtisanPack-UI/design-system#53 to [#57](https://github.com/ArtisanPack-UI/vue/issues/57)). They render the shared markup contract styled by `@artisanpack-ui/css`, and the widgets run on the behavior engine (`@artisanpack-ui/behavior/vue`), so markup, keyboard and ARIA match Livewire and React.
  - New: `Combobox` (local filtering or `remote`, `multiple` with chips, `allowCreate` for tags), `RadioGroup`, `CheckboxGroup`, `Rating`, `Fieldset`, `Form`, `ValidationSummary`, `Signature`, `CodeEditor`, `Link`, `Spotlight`, `NavbarItem`, `BreadcrumbsItem`, and `MenuItem`, `MenuSub`, `MenuTitle` and `MenuSeparator` for composed menus.
  - Rebuilt in place on the design system, with breaking prop changes listed in each component's docs: `Textarea`, `Password`, `Pin`, `Range`, `Toggle`, `ColorPicker` (spec popover on the color-picker machine), `File`, `DatePicker` (with a `time` mode, ISO values), `RichTextEditor`, `Breadcrumbs`, `Pagination` (`page`, `pageCount`, `v-model:page`), `Steps` (1-based `v-model`), `Tabs`, `Menu` and `Navbar`. `Select` takes option groups.
  - `MENU_LINK_KEY` lets a wrapper provide a router's link component (Inertia's `Link`, `RouterLink`) for Menu items. `InertiaMenu` in `vue-laravel` uses it and keeps its 2.x item shape (`name`, `href`, `active`, `children`) and `select` event.
  - Built-in strings are `*Label` props with English defaults, so apps can translate them.

  Deprecated, still exported: `Radio` (use `RadioGroup`), `FileUpload` (use `File`), `Editor` (use `CodeEditor`) and `SpotlightSearch` (use `Spotlight`). They'll be removed in a later major release.

### Patch Changes

- [#64](https://github.com/ArtisanPack-UI/vue/pull/64) [`bdef7a7`](https://github.com/ArtisanPack-UI/vue/commit/bdef7a745879a54fffb5c56733420adefd9348d8) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - Depend on the published design-system packages: `@artisanpack-ui/behavior` `^1.0.0` instead of a local path. The unused `@artisanpack-ui/tokens` 1.x dependency is gone from both packages, since the design tokens now ship with `@artisanpack-ui/css`.

- Updated dependencies [[`7c83017`](https://github.com/ArtisanPack-UI/vue/commit/7c83017270fd6ff875cb73506672c125383fe421), [`d03e06b`](https://github.com/ArtisanPack-UI/vue/commit/d03e06b30ad960a62a71e1d9872c06024bdf765d), [`aee21b6`](https://github.com/ArtisanPack-UI/vue/commit/aee21b6f2d48e07de40461aae0ccda8b01086be7), [`4d6bdfb`](https://github.com/ArtisanPack-UI/vue/commit/4d6bdfb170eca5f175bc0851540ebab081373c8e), [`4b95a1e`](https://github.com/ArtisanPack-UI/vue/commit/4b95a1e24cc3fbe0e1ab59dd3d657c0ce1c26f69), [`bdef7a7`](https://github.com/ArtisanPack-UI/vue/commit/bdef7a745879a54fffb5c56733420adefd9348d8), [`41bc218`](https://github.com/ArtisanPack-UI/vue/commit/41bc2188c11c07ee4892e021bf17e809a407d0e6), [`2d2ccf1`](https://github.com/ArtisanPack-UI/vue/commit/2d2ccf1714dcef4be426cd54ad1efaee60bc036a)]:
  - @artisanpack-ui/vue@2.0.0

## 1.0.1

### Patch Changes

- [#50](https://github.com/ArtisanPack-UI/vue/pull/50) [`f8fd82a`](https://github.com/ArtisanPack-UI/vue/commit/f8fd82ad6e2e78f0ddc6e7f3f5ece0adfb18f91e) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - Depend on `@artisanpack-ui/tokens` `^1.0.1` instead of `*`. The tokens package moved to the design-system repo, and its next release is a breaking 2.0.0, so this keeps installs on 1.x.

- Updated dependencies [[`f8fd82a`](https://github.com/ArtisanPack-UI/vue/commit/f8fd82ad6e2e78f0ddc6e7f3f5ece0adfb18f91e)]:
  - @artisanpack-ui/vue@1.0.1

## 1.0.0

### Major Changes

- [#30](https://github.com/ArtisanPack-UI/vue/pull/30) [`1fe6722`](https://github.com/ArtisanPack-UI/vue/commit/1fe67223ba9820c8b6c54d0f3bab18ce0abd5b1c) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - Initial v1.0.0 release — 56+ Vue 3 UI components with DaisyUI/Tailwind CSS styling, tree-shakeable category exports, composables, and Inertia.js Laravel adapter

### Patch Changes

- Updated dependencies [[`1fe6722`](https://github.com/ArtisanPack-UI/vue/commit/1fe67223ba9820c8b6c54d0f3bab18ce0abd5b1c)]:
  - @artisanpack-ui/vue@1.0.0
