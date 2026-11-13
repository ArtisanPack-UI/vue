# Component API Reference

Complete API reference for all ArtisanPack UI Vue components, organized by category.

## Categories

- [[Form Components]] — Button, Input, Select, Combobox (and tags), Checkbox, CheckboxGroup, RadioGroup (Radio is deprecated), Rating, File (FileUpload is deprecated), Toggle, Textarea, Password, Pin, Range, Fieldset, Form, ValidationSummary, DatePicker, ColorPicker, RichTextEditor, CodeEditor (Editor is deprecated), Signature, and more
- [[Layout Components]] — Card, Dialog, DropdownMenu, Tabs, Accordion, Drawer, Grid, Stack, Popover (plus the deprecated Modal and Dropdown)
- [[Navigation Components]] — Menu, Breadcrumbs, Link, Pagination, Steps, Navbar, Sidebar, Spotlight (SpotlightSearch is deprecated)
- [[Data Display Components]] — Table, Chart, Calendar, Avatar, Badge, Progress, Stat, Timeline, Carousel, Code, Diff, Sparkline
- [[Feedback Components]] — Alert, Toast and Toaster, Loading, Skeleton, EmptyState, ErrorDisplay
- [[Utility Components]] — Icon, ThemeToggle, Tooltip, Clipboard, Markdown

## Import Patterns

```ts
// Import everything from the main entry
import { Button, Card, Alert } from '@artisanpack-ui/vue';

// Or import from category entry points for smaller bundles
import { Button, Input } from '@artisanpack-ui/vue/form';
import { Card, Dialog } from '@artisanpack-ui/vue/layout';
import { Menu } from '@artisanpack-ui/vue/navigation';
import { Avatar, Badge } from '@artisanpack-ui/vue/display';
import { Calendar, Chart, Table } from '@artisanpack-ui/vue/data';
import { Alert, Toaster, toast } from '@artisanpack-ui/vue/feedback';
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
- `#header` / `#footer` — Card, Modal; `#footer` — Dialog
- `#prefix` / `#suffix` — Input adornments
- `#actions` — Modal action buttons, Toast actions
- `#icon` — Custom icon content
- `#trigger` — Popover, Dropdown: the whole trigger element
- `#trigger` — Dialog: the content of the trigger button (Dialog renders the button itself)
- `#label` — DropdownMenu: the content of the trigger button (DropdownMenu renders the button itself)
- `#brand` / `#search` / `#actions` — Navbar regions; its default slot holds `NavbarItem` links
- Composition children: `Tab` in Tabs (each a trigger and its panel), `MenuItem`, `MenuSub`, `MenuTitle` and `MenuSeparator` in Menu; `tabs` and `items` render the same children from data
