---
'@artisanpack-ui/vue': major
'@artisanpack-ui/vue-laravel': major
---

2.0: the packages run on the ArtisanPack UI design system, with no DaisyUI and no Tailwind requirement. Load `@artisanpack-ui/css`; see the upgrade guide at https://docs.artisanpackui.dev/documentation/vue/upgrading.

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
