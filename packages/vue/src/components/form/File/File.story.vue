<script setup lang="ts">
import { ref } from 'vue';
import File from './File.vue';
import type { FileItem } from './types';

const photos = ref<FileItem[]>([]);
const listed = ref<FileItem[]>([
  { name: 'lakeview-lofts-exterior.jpg', size: 2400000 },
  { name: 'courtyard-garden.jpg', size: 1250000, progress: 64 },
  { name: 'floor-plan.heic', size: 830000, error: "HEIC isn't supported. Use JPG or PNG." },
]);
</script>

<template>
  <Story title="Form/File" group="form">
    <Variant title="Drop zone">
      <File
        v-model="photos"
        label="Listing photos"
        title="Drop photos here or browse"
        hint="JPG or PNG, up to 20 MB each"
        multiple
        accept="image/jpeg,image/png"
      />
    </Variant>

    <Variant title="With files">
      <File v-model="listed" label="Listing photos" multiple />
    </Variant>

    <Variant title="Compact">
      <File
        variant="compact"
        title="Upload a contract"
        hint="PDF up to 10 MB"
        accept="application/pdf"
      />
    </Variant>
  </Story>
</template>

<docs lang="md">
# File

Uploads files by dropping or browsing (`.apui-file`): the native file input is transparent over
the drop zone, and the list shows sizes, progress, errors and remove buttons. Bind it with
`v-model`. Exported as `File`; `FileUpload` is a deprecated alias.

## Usage

```vue
<File v-model="photos" label="Photos" multiple accept="image/*" />
```
</docs>
