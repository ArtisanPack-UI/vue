---
'@artisanpack-ui/vue': minor
'@artisanpack-ui/vue-laravel': minor
---

Add the Form and Navigation waves, Combobox, DatePicker and Spotlight on the design system (ArtisanPack-UI/design-system#53 to #57). They render the shared markup contract styled by `@artisanpack-ui/css`, and the widgets run on the behavior engine (`@artisanpack-ui/behavior/vue`), so markup, keyboard and ARIA match Livewire and React.

- New: `Combobox` (local filtering or `remote`, `multiple` with chips, `allowCreate` for tags), `RadioGroup`, `CheckboxGroup`, `Rating`, `Fieldset`, `Form`, `ValidationSummary`, `Signature`, `CodeEditor`, `Link`, `Spotlight`, `NavbarItem`, `BreadcrumbsItem`, and `MenuItem`, `MenuSub`, `MenuTitle` and `MenuSeparator` for composed menus.
- Rebuilt in place on the design system, with breaking prop changes listed in each component's docs: `Textarea`, `Password`, `Pin`, `Range`, `Toggle`, `ColorPicker` (spec popover on the color-picker machine), `File`, `DatePicker` (with a `time` mode, ISO values), `RichTextEditor`, `Breadcrumbs`, `Pagination` (`page`, `pageCount`, `v-model:page`), `Steps` (1-based `v-model`), `Tabs`, `Menu` and `Navbar`. `Select` takes option groups.
- `MENU_LINK_KEY` lets a wrapper provide a router's link component (Inertia's `Link`, `RouterLink`) for Menu items. `InertiaMenu` in `vue-laravel` uses it and keeps its 2.x item shape (`name`, `href`, `active`, `children`) and `select` event.
- Built-in strings are `*Label` props with English defaults, so apps can translate them.

Deprecated, still exported: `Radio` (use `RadioGroup`), `FileUpload` (use `File`), `Editor` (use `CodeEditor`) and `SpotlightSearch` (use `Spotlight`). They'll be removed in a later major release.
