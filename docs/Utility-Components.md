# Utility Components

```ts
import { Clipboard, Icon, Markdown, ThemeToggle, Tooltip } from '@artisanpack-ui/vue/utility';
```

---

## Clipboard

Button that copies text to the clipboard with success feedback.

```vue
<Clipboard text="npm install @artisanpack-ui/vue" label="Copy" success-label="Copied!" color="primary" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | **required** | Text to copy |
| `label` | `string` | `'Copy'` | Button label |
| `successLabel` | `string` | `'Copied!'` | Label after successful copy |
| `successDuration` | `number` | `2000` | Duration of success state (ms) |
| `color` | `DaisyColor` | -- | Button color |
| `size` | `Size` | `'md'` | Button size |
| `className` | `string` | -- | Additional CSS classes |

---

## Icon

SVG icon wrapper with configurable size and color. Pass SVG content via the default slot.

```vue
<Icon size="lg" color="primary" aria-label="Settings">
  <svg><!-- SVG path --></svg>
</Icon>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `Size` | `'md'` | Icon size |
| `color` | `DaisyColor` | -- | Color variant |
| `ariaLabel` | `string` | -- | Accessible label (decorative when omitted) |
| `className` | `string` | -- | Additional CSS classes |

---

## Markdown

Renders markdown content as HTML with DaisyUI prose typography. Supports headings, bold, italic, links, lists, code blocks, blockquotes, horizontal rules, and images.

```vue
<Markdown :content="markdownString" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string` | **required** | Raw markdown string |
| `className` | `string` | -- | Additional CSS classes |

---

## ThemeToggle

Toggle control for switching between light, dark, and system color schemes. Integrates with `useTheme()` and persists to localStorage.

```vue
<ThemeToggle />
<ThemeToggle size="lg" :persist="false" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `Size` | `'md'` | Toggle size |
| `persist` | `boolean` | `true` | Persist preference to localStorage |
| `storageKey` | `string` | `'artisanpack-color-scheme'` | localStorage key |
| `className` | `string` | -- | Additional CSS classes |

---

## Tooltip

Positioned tooltip on hover and focus with ARIA `aria-describedby` accessibility.

```vue
<script setup lang="ts">
import { Tooltip } from '@artisanpack-ui/vue/utility';
import { Button } from '@artisanpack-ui/vue/form';
</script>

<template>
  <Tooltip text="More information" position="top">
    <Button>Hover me</Button>
  </Tooltip>
</template>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | **required** | Tooltip text |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Position relative to trigger |
| `color` | `DaisyColor` | -- | Color variant |
| `forceOpen` | `boolean` | `false` | Force tooltip to stay open |
| `className` | `string` | -- | Additional CSS classes |
