# Component API Reference

Complete API reference for all ArtisanPack UI Vue components, organized by category.

## Categories

- [[Form Components]] — Button, Input, Select, Checkbox, Toggle, DatePicker, ColorPicker, RichTextEditor, and more
- [[Layout Components]] — Card, Modal, Tabs, Accordion, Drawer, Dropdown, Grid, Stack, Popover
- [[Navigation Components]] — Menu, Breadcrumbs, Pagination, Steps, Navbar, Sidebar, SpotlightSearch
- [[Data Display Components]] — Table, Chart, Calendar, Avatar, Badge, Progress, Stat, Timeline, Carousel, Code, Diff, Sparkline
- [[Feedback Components]] — Alert, Toast, Loading, Skeleton, EmptyState, ErrorDisplay
- [[Utility Components]] — Icon, ThemeToggle, Tooltip, Clipboard, Markdown

## Import Patterns

```ts
// Import everything from the main entry
import { Button, Card, Alert } from '@artisanpack-ui/vue';

// Or import from category entry points for smaller bundles
import { Button, Input } from '@artisanpack-ui/vue/form';
import { Card, Modal } from '@artisanpack-ui/vue/layout';
import { Menu } from '@artisanpack-ui/vue/navigation';
import { Avatar, Badge } from '@artisanpack-ui/vue/display';
import { Calendar, Chart, Table } from '@artisanpack-ui/vue/data';
import { Alert, Toast } from '@artisanpack-ui/vue/feedback';
import { Icon, Tooltip } from '@artisanpack-ui/vue/utility';
```

## Common Props

Many components share these common prop patterns:

| Prop | Type | Description |
|------|------|-------------|
| `color` | `DaisyColor \| 'ghost' \| 'outline'` | DaisyUI semantic color (see [[Design Tokens]]) |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | Component size |
| `className` | `string` | Additional CSS classes |
| `label` | `string` | Field label (form components) |
| `error` | `string` | Validation error message (form components) |
| `hint` | `string` | Helper text (form components) |

## Slots

Components use Vue named slots for flexible content areas. Common slot names:

- `#default` — Main content
- `#header` / `#footer` — Card, Modal
- `#prefix` / `#suffix` — Input adornments
- `#actions` — Modal action buttons
- `#icon` — Custom icon content
- `#trigger` — Popover, Dropdown trigger element
