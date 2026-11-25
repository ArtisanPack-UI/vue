---
title: Utility
menu_order: 70
meta_description: Vue utility components from @artisanpack-ui/vue/utility. Clipboard, Icon, Kbd, Markdown, Swap, ThemeToggle and Tooltip, plus the icon registry.
---

# Utility

Utility components cover small, common needs: copying a value, drawing an icon, showing a shortcut, rendering Markdown, toggling a pair of states, choosing a theme and labeling a control. Import them from `@artisanpack-ui/vue/utility` or from the package root.

```ts
import { Icon, ThemeToggle, Tooltip } from '@artisanpack-ui/vue/utility';
// or
import { Icon, ThemeToggle, Tooltip } from '@artisanpack-ui/vue';
```

- [Clipboard](utility/clipboard.md): copies a value, with a "Copied" confirmation and a manual fallback.
- [Icon](utility/icon.md): one glyph from the icon registry, plain or on a tile. Also covers `registerIcons` and the rest of the registry API.
- [Kbd](utility/kbd.md): a keyboard key or shortcut, with the platform's modifier keys.
- [Markdown](utility/markdown.md): renders GitHub-flavored Markdown safely, with an optional editor.
- [Swap](utility/swap.md): a two-state toggle that swaps its content, such as a sun and a moon.
- [ThemeToggle](utility/theme-toggle.md): lets people choose light, dark, high contrast or system. Also covers `ThemeScript`.
- [Tooltip](utility/tooltip.md): a short label on hover and keyboard focus.

## Icons

Every component that takes an icon name, not only `Icon`, resolves it through the same registry, shared with the React and Livewire packages. Add your own icons with `registerIcons`, exported from the package root; see [Icon](utility/icon.md#the-icon-registry).

## Built-in text

Clipboard, Kbd, Markdown and ThemeToggle take their built-in text, such as "Copy" or "Theme", from the package translations. Every string is also a prop, so you can change one instance without a translation catalog.
