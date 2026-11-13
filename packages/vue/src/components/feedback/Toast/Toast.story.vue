<script setup lang="ts">
import Toast from './Toast.vue';
import Toaster from './Toaster.vue';
import { toast } from './toaster';
import Button from '../../form/Button/Button.vue';

function archive() {
  toast.create({
    title: 'Listing archived',
    description: 'Cedarwood Estates is hidden from search.',
    action: { label: 'Undo', onClick: () => toast.create({ title: 'Listing restored' }) },
  });
}

function save() {
  toast.create({ title: 'Listing saved', description: 'Live now.', color: 'success' });
}

function fail() {
  toast.create({ title: 'Upload failed', description: 'The file is over 10 MB.', color: 'error' });
}
</script>

<template>
  <Story title="Feedback/Toast" group="feedback">
    <Variant title="Colors and Variants">
      <div style="display: grid; gap: 12px; padding: 16px">
        <Toast color="success" title="Listing saved" description="Cedarwood Estates is live now." />
        <Toast color="error" title="Upload failed" description="The file is larger than 10 MB." />
        <Toast color="warning" title="Storage almost full" description="92% of 10 GB used." />
        <Toast variant="inverse" title="Listing archived">
          <template #actions>
            <Button size="sm" variant="outline" color="neutral">Undo</Button>
          </template>
        </Toast>
      </div>
    </Variant>

    <Variant title="Toaster">
      <Toaster />
      <div style="display: flex; gap: 8px">
        <Button @click="save">Save</Button>
        <Button variant="outline" color="neutral" @click="archive">Archive listing</Button>
        <Button color="error" variant="soft" @click="fail">Fail an upload</Button>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Toast

A brief, non-blocking message (`.apui-toast`). Put one `Toaster` on the page, then show toasts
from data with `toast.create()`; they stack at the bottom end of the viewport, time out after
5 seconds (paused on hover and focus), and a toast with an action stays until it's used or
closed. Rendered on its own, a `Toast` is static.

## Usage

```vue
<script setup lang="ts">
import { Button, Toaster, toast } from '@artisanpack-ui/vue';

function archive() {
  toast.create({
    title: 'Listing archived',
    description: 'Cedarwood Estates is hidden from search.',
    action: { label: 'Undo', onClick: () => restore() },
  });
}
</script>

<template>
  <Toaster />
  <Button @click="archive">Archive listing</Button>
</template>
```
</docs>
