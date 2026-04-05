# Form Components

```ts
import { Button, Input, Select, Checkbox, Toggle, Radio, Textarea, Password, Pin, Range, DatePicker, ColorPicker, Editor, RichTextEditor, FileUpload } from '@artisanpack-ui/vue/form';
```

---

## Button

A versatile button that can render as a `<button>` or `<a>` element with badge, tooltip, loading, and responsive support.

```vue
<Button color="primary" @click="save">Save</Button>
<Button link="/about" external>Learn More</Button>
<Button :loading="submitting" color="success">Submit</Button>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Text label. Hidden on small screens when `responsive` is true |
| `color` | `DaisyColor \| 'ghost' \| 'outline'` | -- | DaisyUI color variant |
| `size` | `Size` | -- | Button size (`xs`, `sm`, `md`, `lg`) |
| `loading` | `boolean` | `false` | Shows a loading spinner in place of the left icon |
| `link` | `string` | -- | Renders as `<a>` element with this URL |
| `external` | `boolean` | `false` | Opens link in new tab with `rel="noopener noreferrer"` |
| `badge` | `string` | -- | Badge text after the label |
| `badgeColor` | `DaisyColor \| 'ghost' \| 'outline'` | -- | Badge color variant |
| `badgeClasses` | `string` | -- | Additional badge CSS classes |
| `responsive` | `boolean` | `false` | Hides label on small screens |
| `tooltip` | `string` | -- | Tooltip text on hover |
| `tooltipPosition` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Tooltip position |
| `disabled` | `boolean` | `false` | Disabled state |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML type attribute |

---

## Input

A text input with label, icons, prefix/suffix adornments, clearable action, and inline label mode.

```vue
<Input label="Email" type="email" v-model="email" />
<Input label="Search" v-model="search" clearable inline />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Label text |
| `hint` | `string` | -- | Helper text below the input |
| `error` | `string` | -- | Error message (replaces hint, adds `aria-invalid`) |
| `clearable` | `boolean` | `false` | Shows a clear (X) button |
| `inline` | `boolean` | `false` | Floating/inline label mode |
| `id` | `string` | auto | Custom element ID |
| `required` | `boolean` | `false` | Required field |
| `type` | `'text' \| 'email' \| 'number' \| 'password' \| 'search' \| 'tel' \| 'url' \| 'hidden'` | `'text'` | Input type |
| `placeholder` | `string` | -- | Placeholder text |
| `disabled` | `boolean` | `false` | Disabled state |
| `readonly` | `boolean` | `false` | Read-only state |

---

## Select

A dropdown select with option mapping, placeholder, icons, and inline label.

```vue
<Select label="Country" v-model="country" :options="countries" option-value="id" option-label="name" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Label text |
| `hint` | `string` | -- | Helper text |
| `error` | `string` | -- | Error message |
| `placeholder` | `string` | -- | Disabled placeholder option text |
| `placeholderValue` | `string` | `''` | Value for the placeholder option |
| `inline` | `boolean` | `false` | Inline label mode |
| `optionValue` | `string` | `'id'` | Property key for option values |
| `optionLabel` | `string` | `'name'` | Property key for option labels |
| `options` | `SelectOption[]` | -- | Array of option objects |
| `id` | `string` | -- | Custom element ID |
| `required` | `boolean` | `false` | Required field |
| `disabled` | `boolean` | `false` | Disabled state |

---

## Checkbox

Checkbox with label, card layout variant, and color support.

```vue
<Checkbox label="I agree to the terms" v-model="agreed" color="primary" />
<Checkbox label="Premium" v-model="isPremium" card />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Label text |
| `right` | `boolean` | `false` | Position label to the right |
| `hint` | `string` | -- | Helper text |
| `error` | `string` | -- | Error message |
| `color` | `DaisyColor` | -- | Color variant |
| `card` | `boolean` | `false` | Card layout mode |
| `cardClass` | `string` | -- | Additional card CSS classes |
| `id` | `string` | -- | Custom element ID |
| `required` | `boolean` | `false` | Required field |
| `disabled` | `boolean` | `false` | Disabled state |

---

## Toggle

Switch/toggle rendered as a styled checkbox with `role="switch"`.

```vue
<Toggle label="Notifications" v-model="notificationsEnabled" color="success" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Label text |
| `right` | `boolean` | `false` | Position label to the right |
| `hint` | `string` | -- | Helper text |
| `error` | `string` | -- | Error message |
| `color` | `DaisyColor` | -- | Color variant |
| `id` | `string` | -- | Custom element ID |
| `required` | `boolean` | `false` | Required field |
| `disabled` | `boolean` | `false` | Disabled state |

---

## Radio

Radio button group from an options array with card layout and orientation support.

```vue
<Radio label="Plan" v-model="plan" :options="plans" option-value="id" option-label="name" />
<Radio v-model="size" :options="sizes" card />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Group label (rendered as `<legend>`) |
| `hint` | `string` | -- | Helper text |
| `error` | `string` | -- | Error message |
| `color` | `DaisyColor` | -- | Color variant |
| `optionValue` | `string` | `'id'` | Property key for option values |
| `optionLabel` | `string` | `'name'` | Property key for option labels |
| `optionHint` | `string` | `'hint'` | Property key for option hint text |
| `options` | `RadioOption[]` | -- | Array of option objects |
| `inline` | `boolean` | `false` | Horizontal layout (when `card` is false) |
| `card` | `boolean` | `false` | Card layout mode |
| `cardClass` | `string` | -- | Additional card CSS classes |
| `id` | `string` | -- | Custom fieldset ID |
| `name` | `string` | -- | Radio group name |
| `required` | `boolean` | `false` | Required field |

---

## Textarea

Multi-line text input with label, inline mode, and read-only styling.

```vue
<Textarea label="Description" v-model="description" rows="5" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Label text |
| `hint` | `string` | -- | Helper text |
| `error` | `string` | -- | Error message |
| `inline` | `boolean` | `false` | Inline label mode |
| `id` | `string` | -- | Custom element ID |
| `required` | `boolean` | `false` | Required field |
| `readonly` | `boolean` | `false` | Read-only state |
| `placeholder` | `string` | -- | Placeholder text |
| `rows` | `number` | -- | Visible text rows |
| `disabled` | `boolean` | `false` | Disabled state |

---

## Password

Password input with built-in visibility toggle and clearable action.

```vue
<Password label="Password" v-model="password" />
<Password label="Confirm" v-model="confirm" hide-toggle />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Label text |
| `hint` | `string` | -- | Helper text |
| `error` | `string` | -- | Error message |
| `inline` | `boolean` | `false` | Inline label mode |
| `clearable` | `boolean` | `false` | Shows a clear button |
| `hideToggle` | `boolean` | `false` | Hides the visibility toggle |
| `id` | `string` | -- | Custom element ID |
| `required` | `boolean` | `false` | Required field |
| `placeholder` | `string` | -- | Placeholder text |
| `disabled` | `boolean` | `false` | Disabled state |

---

## Pin

Row of single-character inputs for PIN/OTP entry with auto-focus and paste support.

```vue
<Pin :length="6" v-model="code" numeric />
<Pin :length="4" v-model="pin" hide />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `length` | `number` | **required** | Number of input fields |
| `numeric` | `boolean` | `false` | Digits only (0-9) |
| `hide` | `boolean` | `false` | Mask input characters |
| `error` | `string` | -- | Error message |
| `color` | `DaisyColor` | -- | Color variant |
| `id` | `string` | -- | ID prefix for inputs |
| `disabled` | `boolean` | `false` | Disabled state |

---

## Range

Styled range slider with DaisyUI color variants.

```vue
<Range label="Volume" v-model="volume" :min="0" :max="100" color="primary" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Label text |
| `hint` | `string` | -- | Helper text |
| `error` | `string` | -- | Error message |
| `color` | `DaisyColor` | -- | Color variant |
| `id` | `string` | -- | Custom element ID |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `step` | `number` | -- | Step increment |
| `required` | `boolean` | `false` | Required field |
| `disabled` | `boolean` | `false` | Disabled state |

---

## DatePicker

Native HTML date input with label, inline mode, and date type selection.

```vue
<DatePicker label="Start Date" v-model="startDate" />
<DatePicker label="Time" v-model="time" date-type="time" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Label text |
| `hint` | `string` | -- | Helper text |
| `error` | `string` | -- | Error message |
| `inline` | `boolean` | `false` | Inline label mode |
| `dateType` | `'date' \| 'datetime-local' \| 'time' \| 'month' \| 'week'` | `'date'` | Input type |
| `id` | `string` | -- | Custom element ID |
| `required` | `boolean` | `false` | Required field |
| `min` | `string` | -- | Minimum date/time |
| `max` | `string` | -- | Maximum date/time |
| `disabled` | `boolean` | `false` | Disabled state |

---

## ColorPicker

Native color input with hex display, optional clear and random buttons.

```vue
<ColorPicker label="Brand Color" v-model="brandColor" clearable random />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Label text |
| `hint` | `string` | -- | Helper text |
| `error` | `string` | -- | Error message |
| `clearable` | `boolean` | `false` | Shows a clear button |
| `random` | `boolean` | `false` | Shows a random color button |
| `id` | `string` | -- | Custom element ID |
| `required` | `boolean` | `false` | Required field |
| `defaultValue` | `string` | `'#000000'` | Color when cleared |
| `disabled` | `boolean` | `false` | Disabled state |

---

## Editor

Monospace textarea for code or structured text editing.

```vue
<Editor label="JSON Config" v-model="config" :rows="15" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Label text |
| `hint` | `string` | -- | Helper text |
| `error` | `string` | -- | Error message |
| `id` | `string` | -- | Custom element ID |
| `required` | `boolean` | `false` | Required field |
| `placeholder` | `string` | -- | Placeholder text |
| `rows` | `number` | `12` | Visible text rows |
| `disabled` | `boolean` | `false` | Disabled state |
| `readonly` | `boolean` | `false` | Read-only state |

---

## RichTextEditor

ContentEditable wrapper with toolbar support for rich text editing.

> **Security:** Always sanitize `modelValue` (e.g., with DOMPurify) before passing user-generated content.

```vue
<RichTextEditor label="Content" v-model="body" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Label text |
| `hint` | `string` | -- | Helper text |
| `error` | `string` | -- | Error message |
| `minHeight` | `string` | `'200px'` | Minimum height of the editable area |
| `id` | `string` | -- | Custom element ID |
| `required` | `boolean` | `false` | Required field |
| `disabled` | `boolean` | `false` | Disabled state |

---

## FileUpload

File input with standard and drag-and-drop rendering modes.

```vue
<FileUpload label="Avatar" accept="image/*" v-model="file" />
<FileUpload label="Documents" with-drag-drop multiple :progress="uploadProgress" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Label text |
| `hint` | `string` | -- | Helper text |
| `error` | `string` | -- | Error message |
| `withDragDrop` | `boolean` | `false` | Drag-and-drop zone mode |
| `dragDropText` | `string` | `'Drop files here or click to browse'` | Custom drop zone text |
| `dragDropClass` | `string` | -- | Additional drop zone CSS classes |
| `progress` | `number` | -- | Upload progress (0-100) |
| `hideProgress` | `boolean` | `false` | Hide progress bar |
| `id` | `string` | -- | Custom element ID |
| `required` | `boolean` | `false` | Required field |
| `accept` | `string` | -- | Accepted file types |
| `multiple` | `boolean` | `false` | Allow multiple files |
| `disabled` | `boolean` | `false` | Disabled state |
| `name` | `string` | -- | Name attribute for form submissions |
