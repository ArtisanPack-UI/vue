---
title: Upgrading from 1.x
menu_order: 11
---

# Upgrading from 1.x

2.0 rebuilds the components on the ArtisanPack UI design system. DaisyUI is gone: components are styled by `@artisanpack-ui/css`, and some components, props and events were renamed to share one API with the React and Livewire packages. Most 1.x names still work in 2.0, marked `@deprecated`, so an app keeps building while you migrate.

The full guide, with every renamed component and every changed prop, slot and event, is generated from the codemod's own rules: [Upgrading @artisanpack-ui/vue 1.x to 2.0](https://docs.artisanpackui.dev/documentation/design-system/upgrade/vue). This page is the short version.

Upgrade a whole app at once, on a branch: 1.x and 2.0 can't be mixed in one app, because the new CSS replaces DaisyUI.

## 1. Update the packages

```bash
npm install @artisanpack-ui/vue@^2 @artisanpack-ui/css
npm uninstall daisyui
```

Update `@artisanpack-ui/vue-laravel` too if you use it.

## 2. Run the codemod

Preview the changes as a diff, without writing anything:

```bash
npx @artisanpack-ui/codemods vue src --dry-run
```

Then apply them:

```bash
npx @artisanpack-ui/codemods vue src
```

The codemod rewrites imports from `@artisanpack-ui/vue`, and the tags, props, events, `v-model` arguments and slots of renamed components in your templates. It only touches tags a file imports from the package. If you registered components globally, add `--global` so their tags are migrated too:

```bash
npx @artisanpack-ui/codemods vue src --global --dry-run
```

It reports what it can't change by itself, each with its file and line: props and events with no automatic replacement, values it couldn't read (such as `v-bind="props"`), and every raw DaisyUI class. See [the codemods package](https://docs.artisanpackui.dev/documentation/design-system/packages/codemods) for all options.

## 3. Replace DaisyUI with the new CSS

Remove `@plugin "daisyui";` and any `@plugin "daisyui/theme"` block from your CSS, then load `@artisanpack-ui/css` as shown in [Getting Started](Getting-Started), with or without Tailwind.

The codemod never rewrites raw DaisyUI classes in your own markup (`btn`, `card`, `bg-base-200`), because the right replacement depends on the element. The full guide maps each one to a component, a token or a utility.

## 4. Move your theme

DaisyUI themes become token-based presets. Generate one from your brand colors with the preset generator; see [Brand Presets](https://docs.artisanpackui.dev/documentation/design-system/theming/brand-presets). To apply the visitor's light or dark choice, use [ThemeToggle and ThemeScript](Theming).

## 5. Check the renamed components

The codemod renames components for you. The 1.x names that remain as deprecated aliases are listed in [Components](Components), and they'll be removed in the next major.
