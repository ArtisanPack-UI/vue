# Data Display Components

```ts
import { Avatar, Badge, Carousel, Code, Diff, Progress, Sparkline, Stat, Timeline } from '@artisanpack-ui/vue/display';
import { Calendar, Chart, Table } from '@artisanpack-ui/vue/data';
```

---

## Table

Data table with headers, rows, sorting, and custom cell rendering via scoped slots.

```vue
<Table
  :columns="[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', align: 'center' },
  ]"
  :rows="users"
  striped
  hoverable
  :sort="currentSort"
  @update:sort="currentSort = $event"
>
  <template #cell-name="{ row }">
    <strong>{{ row.name }}</strong>
  </template>
</Table>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `TableColumn[]` | **required** | Column definitions |
| `rows` | `Record<string, unknown>[]` | **required** | Row data |
| `striped` | `boolean` | `false` | Zebra striping |
| `compact` | `boolean` | `false` | Compact mode |
| `hoverable` | `boolean` | `false` | Hover highlighting |
| `pinRows` | `boolean` | `false` | Pin header row |
| `pinCols` | `boolean` | `false` | Pin first column |
| `sort` | `SortState` | -- | Current sort state |
| `loading` | `boolean` | `false` | Loading state |
| `emptyMessage` | `string` | `'No data available'` | Empty state message |
| `className` | `string` | -- | Additional CSS classes |

Dynamic scoped slots named `#cell-{key}` for custom cell rendering. Each receives `{ row, column, value }`.

---

## Chart

Chart component powered by ApexCharts with 8 chart types and DaisyUI color integration. Requires optional peer dependencies:

```bash
npm install apexcharts vue3-apexcharts
```

```vue
<Chart type="bar" :labels="['Jan', 'Feb', 'Mar']" :series="[
  { name: 'Sales', data: [30, 40, 35] },
]" title="Monthly Sales" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `ChartType` | `'bar'` | Chart type: `'bar' \| 'line' \| 'area' \| 'donut' \| 'pie' \| 'radialBar' \| 'radar' \| 'polarArea'` |
| `labels` | `string[]` | -- | X-axis / slice labels |
| `series` | `ChartSeries[]` | -- | Multi-series data (bar, line, area) |
| `data` | `ChartDataPoint[]` | -- | Simple data points (pie, donut) |
| `height` | `number \| string` | `350` | Chart height |
| `width` | `number \| string` | -- | Chart width |
| `color` | `DaisyColor` | -- | Default color |
| `options` | `Record<string, unknown>` | -- | ApexCharts options (deep-merged) |
| `showLegend` | `boolean` | `true` | Show legend |
| `animated` | `boolean` | `true` | Enable animations |
| `title` | `string` | -- | Chart title |
| `className` | `string` | -- | Additional CSS classes |

---

## Calendar

Date calendar with navigation and event markers.

```vue
<Calendar v-model="selectedDate" :events="events" :week-start="1" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `month` | `number` | current | Displayed month (1-12) |
| `year` | `number` | current | Displayed year |
| `modelValue` | `string` | -- | Selected date (`YYYY-MM-DD`, `v-model`) |
| `events` | `CalendarEvent[]` | -- | Events to display |
| `weekStart` | `0 \| 1` | `0` | First day of week (0 = Sunday, 1 = Monday) |
| `minDate` | `string` | -- | Minimum selectable date (`YYYY-MM-DD`) |
| `maxDate` | `string` | -- | Maximum selectable date (`YYYY-MM-DD`) |
| `className` | `string` | -- | Additional CSS classes |

---

## Avatar

User avatar with image, initials, or placeholder fallback.

```vue
<Avatar src="/photo.jpg" alt="Jane" size="lg" ring="primary" />
<Avatar initials="JD" color="secondary" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | -- | Image URL |
| `alt` | `string` | -- | Alt text for image |
| `initials` | `string` | -- | Initials when no image |
| `size` | `Size` | `'md'` | Avatar size |
| `shape` | `'circle' \| 'squircle' \| 'hexagon' \| 'triangle'` | `'circle'` | Avatar shape |
| `online` | `boolean` | `false` | Online indicator |
| `offline` | `boolean` | `false` | Offline indicator |
| `ring` | `DaisyColor` | -- | Ring color |
| `color` | `DaisyColor` | -- | Placeholder background color |
| `className` | `string` | -- | Additional CSS classes |

---

## Badge

Small status indicator with color variants and outline style.

```vue
<Badge value="New" color="primary" />
<Badge :value="42" color="error" outline />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string \| number` | -- | Badge text/number |
| `color` | `DaisyColor` | -- | Color variant |
| `size` | `Size` | `'md'` | Badge size |
| `outline` | `boolean` | `false` | Outline style |
| `ghost` | `boolean` | `false` | Ghost style |
| `className` | `string` | -- | Additional CSS classes |

---

## Carousel

Image/content slideshow with navigation controls.

```vue
<Carousel :slides="[
  { id: 1, src: '/img1.jpg', alt: 'Slide 1', caption: 'First slide' },
  { id: 2, src: '/img2.jpg', alt: 'Slide 2' },
]" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `slides` | `CarouselSlide[]` | **required** | Slides to display |
| `showArrows` | `boolean` | `true` | Show navigation arrows |
| `showIndicators` | `boolean` | `true` | Show dot indicators |
| `modelValue` | `number` | `0` | Current slide index (`v-model`) |
| `className` | `string` | -- | Additional CSS classes |

---

## Code

Code block with optional language label and copy functionality.

```vue
<Code code="const x = 42;" language="javascript" copyable line-numbers />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `code` | `string` | **required** | Code content |
| `language` | `string` | -- | Language label |
| `copyable` | `boolean` | `false` | Show copy button |
| `inline` | `boolean` | `false` | Inline rendering |
| `lineNumbers` | `boolean` | `false` | Show line numbers |
| `className` | `string` | -- | Additional CSS classes |

---

## Diff

Side-by-side or inline diff viewer for comparing two pieces of content.

```vue
<Diff before="Hello" after="Hello World" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `before` | `string` | **required** | Original content |
| `after` | `string` | **required** | Modified content |
| `beforeLabel` | `string` | `'Before'` | Label for original |
| `afterLabel` | `string` | `'After'` | Label for modified |
| `mode` | `'side-by-side' \| 'inline'` | `'side-by-side'` | Display mode |
| `lineNumbers` | `boolean` | `true` | Show line numbers |
| `className` | `string` | -- | Additional CSS classes |

---

## Progress

Progress bar with percentage display and color variants.

```vue
<Progress :value="65" color="primary" show-value />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | -- | Current value |
| `max` | `number` | `100` | Maximum value |
| `color` | `DaisyColor` | -- | Color variant |
| `showValue` | `boolean` | `false` | Show percentage text |
| `className` | `string` | -- | Additional CSS classes |

---

## Sparkline

Compact inline chart rendered as SVG with line, area, or bar variants.

```vue
<Sparkline :data="[5, 10, 5, 20, 8, 15]" color="success" type="area" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `number[]` | **required** | Numeric data points |
| `type` | `'line' \| 'area' \| 'bar'` | `'line'` | Chart type |
| `height` | `number` | `40` | Height in pixels |
| `width` | `number` | `data.length * 8` | Width in pixels |
| `color` | `DaisyColor \| string` | `'primary'` | Chart color |
| `strokeWidth` | `number` | `2` | Stroke width (line/area) |
| `curve` | `boolean` | `true` | Smooth Catmull-Rom curves |
| `fillOpacity` | `number` | `0.3` | Area fill opacity (0-1) |
| `showTooltip` | `boolean` | `true` | Show tooltip on hover |
| `className` | `string` | -- | Additional CSS classes |

---

## Stat

Statistic display with label, value, description, and change indicator.

```vue
<Stat title="Revenue" value="$12,400" change="+12%" change-direction="up" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | **required** | Label text |
| `value` | `string \| number` | **required** | Main statistic |
| `description` | `string` | -- | Description below value |
| `change` | `string` | -- | Change indicator text |
| `changeDirection` | `'up' \| 'down' \| 'neutral'` | -- | Change direction for color coding |
| `className` | `string` | -- | Additional CSS classes |

---

## Timeline

Vertical or horizontal timeline for displaying events or activity.

```vue
<Timeline :items="[
  { id: 1, title: 'Order placed', time: '2024-01-15', color: 'primary', start: true },
  { id: 2, title: 'Shipped', time: '2024-01-17', color: 'success' },
  { id: 3, title: 'Delivered', time: '2024-01-19', color: 'success', end: true },
]" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `TimelineItem[]` | **required** | Timeline items |
| `vertical` | `boolean` | `true` | Vertical layout |
| `snap` | `boolean` | `false` | Alternate items left/right |
| `compact` | `boolean` | `false` | Compact rendering |
| `className` | `string` | -- | Additional CSS classes |
