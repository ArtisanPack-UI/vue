---
title: File
menu_order: 90
meta_description: The Vue File component. Uploads files by dropping or browsing, and lists them with size, progress, errors and remove buttons.
---

# File

Uploads files by dropping or browsing. A native `<input type="file">` sits transparent over a drop zone, so the whole zone opens the file dialog and accepts dropped files. Under it, the chosen files are listed with their size, upload progress, errors and a remove button. Use it for photos, documents and other attachments.

```ts
import { File } from '@artisanpack-ui/vue/form';
// or
import { File } from '@artisanpack-ui/vue';
```

Importing `File` shadows the browser's global `File` class in that module. If you also need the global, import the component under another name, such as `import { File as FileField } from '@artisanpack-ui/vue/form'`, or use `globalThis.File`. `FileUpload` is a deprecated alias of the same component; see [Deprecated components](../deprecated.md).

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { File, type FileItem } from '@artisanpack-ui/vue/form';

const photos = ref<FileItem[]>([]);
</script>

<template>
  <File
    v-model="photos"
    label="Listing photos"
    title="Drop photos here or browse"
    hint="JPG or PNG, up to 20 MB each"
    accept="image/jpeg,image/png"
    multiple
    name="photos[]"
  />
</template>
```

`v-model` receives the browser `File` objects the user chose. Each new choice replaces the list, as the native input does. Removing a file updates the list and, where the browser allows it, the native input's files, so a native form submits what's listed.

### Upload progress and errors

The list also takes entries that aren't browser files: `{ name, size?, progress?, error? }`. Use them for files that are uploading or already stored. `progress` (0 to 100) shows a progress bar; `error` marks the row and replaces the size with the message.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { File, type FileItem } from '@artisanpack-ui/vue/form';

const documents = ref<FileItem[]>([
  { name: 'lease-agreement.pdf', size: 482_000 },
  { name: 'floor-plan.pdf', size: 2_400_000, progress: 64 },
  { name: 'photo-id.heic', error: 'HEIC files aren’t supported. Upload a JPG or PNG.' },
]);
</script>

<template>
  <File v-model="documents" label="Documents" multiple />
</template>
```

Sizes are shown in decimal units with one decimal place, such as `2.4 MB`.

### Validating files

`accept` and `multiple` go to the native input. `maxSize` is emitted as `data-max-size` but isn't enforced: check the files in your `update:modelValue` handler, and show problems per file with `error` rather than rejecting the whole batch.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { File, type FileItem } from '@artisanpack-ui/vue/form';

const MAX = 20_000_000;
const photos = ref<FileItem[]>([]);

function choose(files: FileItem[]): void {
  photos.value = files.map((file) =>
    file.size !== undefined && file.size > MAX
      ? { name: file.name, size: file.size, error: 'Larger than 20 MB.' }
      : file,
  );
}
</script>

<template>
  <File
    :model-value="photos"
    label="Listing photos"
    hint="Up to 20 MB each"
    multiple
    :max-size="MAX"
    @update:model-value="choose"
  />
</template>
```

### Compact

`variant="compact"` renders a single row instead of the large drop zone, for forms with little room.

```vue
<template>
  <File
    variant="compact"
    title="Upload a contract"
    hint="PDF up to 10 MB"
    accept="application/pdf"
  />
</template>
```

### Label and title

`title` is the drop zone's main line. With a `label`, the label names the input; without one, the title does (through `aria-labelledby`). `hint`, `error`, `invalid`, `disabled` and `required` work as on [Input](input.md).

## Props

| Prop          | Type                                | Default                                   | Description                                                                                           |
| ------------- | ----------------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `modelValue`  | `FileItem[]`                        | —                                         | The files to list, bound with `v-model`. Without it, the chosen files are listed.                     |
| `label`       | `string`                            | —                                         | The visible label, for the input. Without it, the title names the input.                              |
| `title`       | `string`                            | `'Drop files here or browse'`, translated | The drop zone's main line.                                                                            |
| `hint`        | `string`                            | —                                         | The limits under the title, linked with `aria-describedby`.                                           |
| `error`       | `string`                            | —                                         | Validation message. Marks the field invalid and is linked with `aria-describedby`.                    |
| `invalid`     | `boolean`                           | `false`                                   | Marks the field invalid without a message.                                                            |
| `disabled`    | `boolean`                           | `false`                                   | Disables the input and the remove buttons.                                                            |
| `required`    | `boolean`                           | `false`                                   | Sets `required` on the input and shows the required mark.                                             |
| `accept`      | `string`                            | —                                         | The accepted types, passed to the native input.                                                       |
| `multiple`    | `boolean`                           | `false`                                   | Allows several files.                                                                                 |
| `maxSize`     | `number`                            | —                                         | The largest file in bytes, emitted as `data-max-size`. Not enforced; validate on `update:modelValue`. |
| `variant`     | `'dropzone' \| 'compact'`           | `'dropzone'`                              | A large centered drop zone, or a compact row. Emitted as `data-variant`.                              |
| `removeLabel` | `string`                            | `'Remove :name'`, translated              | The remove buttons' name; `:name` is the file name.                                                   |
| `classes`     | `Partial<Record<FilePart, string>>` | —                                         | Extra classes per [part](#parts), such as `{ dropzone: 'min-h-48' }`. Use `class` for the root.       |

`class` goes to the root `<div>`. Every other attribute, including `id`, `name`, `capture`, `aria-*` and listeners, goes to the native file input. An `id` you pass becomes the input's id, and the title, hint and error ids are built from it. Your own `aria-describedby` is kept and added after them.

## v-model

| Binding   | Type         | Carries                                                                   |
| --------- | ------------ | ------------------------------------------------------------------------- |
| `v-model` | `FileItem[]` | The chosen files after each choice, or the list without the removed file. |

Without `v-model`, the component lists the files the user chose.

## Slots

File has no slots.

## Events

| Event                | Payload                           | Description                                                                                               |
| -------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `@update:modelValue` | `FileItem[]`                      | Files were chosen or one was removed.                                                                     |
| `@remove`            | `(file: FileItem, index: number)` | A remove button was pressed, before the list changes. Use it to cancel an upload or delete a stored file. |

Native listeners such as `@change` fall through to the file input.

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part       | Element    | Description                                                                                           |
| ---------- | ---------- | ----------------------------------------------------------------------------------------------------- |
| `root`     | `div`      | The field, `.apui-file`. Carries `data-variant`, `data-max-size`, `data-invalid` and `data-disabled`. |
| `label`    | `label`    | The visible label.                                                                                    |
| `required` | `span`     | The `*` mark inside the label. `aria-hidden`.                                                         |
| `dropzone` | `div`      | The drop zone. Carries `data-state="drag"` while files are dragged over it.                           |
| `control`  | `input`    | The native file input, transparent over the drop zone.                                                |
| `icon`     | `span`     | The upload icon (a file icon when compact). `aria-hidden`.                                            |
| `title`    | `p`        | The drop zone's main line.                                                                            |
| `hint`     | `p`        | The limits.                                                                                           |
| `list`     | `ul`       | The listed files.                                                                                     |
| `item`     | `li`       | One file. Carries `data-state="error"` when it has an error.                                          |
| `thumb`    | `span`     | The file icon, or an alert icon on error. `aria-hidden`.                                              |
| `name`     | `span`     | The file name.                                                                                        |
| `meta`     | `span`     | The size, or the file's error.                                                                        |
| `progress` | `progress` | The upload progress, named by the file name. Replaces `meta` while uploading.                         |
| `actions`  | `span`     | Holds the remove button.                                                                              |
| `error`    | `p`        | The field's error message, with an alert icon.                                                        |

## Types

```ts
import type { FileEntry, FileItem, FilePart, FileProps } from '@artisanpack-ui/vue/form';
```

| Type        | Description                                                                                                      |
| ----------- | ---------------------------------------------------------------------------------------------------------------- |
| `FileProps` | The component's props.                                                                                           |
| `FileItem`  | One listed file: a browser `File` or a `FileEntry`.                                                              |
| `FileEntry` | A listed file that isn't a browser `File`: `{ name: string; size?: number; progress?: number; error?: string }`. |
| `FilePart`  | The part names in the [Parts](#parts) table.                                                                     |

## Accessibility

| Keys              | Action                                            |
| ----------------- | ------------------------------------------------- |
| `Tab`             | Moves to the file input, then each remove button. |
| `Enter` / `Space` | Opens the file dialog, or removes a file.         |

- The native file input stays in the DOM, transparent over the drop zone, so it works with the keyboard and screen readers; drag and drop is an enhancement the platform supplies.
- The label, or the title without one, names the input; the hint describes it. The error is linked with `aria-describedby`, and invalid sets `aria-invalid`.
- Each remove button is named with its file's name.
- Progress is a native `<progress>` named by the file; a file's error shows as text in its row, not by color alone.
- Shows a visible focus ring on the drop zone while the input has `:focus-visible`.
- State the limits (types, size, count) in the hint before upload, and never reject a whole batch for one bad file.

## Related

- [File in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/file): anatomy, tokens and live examples.
- [Progress](../display/progress.md) for progress outside a file list.
- [Deprecated components](../deprecated.md) for the `FileUpload` alias.
- [Input](input.md) for the shared field anatomy.
