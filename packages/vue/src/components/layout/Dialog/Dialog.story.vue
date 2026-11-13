<script setup lang="ts">
import { ref } from 'vue';
import Dialog from './Dialog.vue';
import Button from '../../form/Button/Button.vue';
import Input from '../../form/Input/Input.vue';

const inviteOpen = ref(false);
const confirmOpen = ref(false);
</script>

<template>
  <Story title="Layout/Dialog" group="layout">
    <Variant title="Default">
      <template #controls="{ state }">
        <HstSelect v-model="state.size" title="Size" :options="['', 'sm', 'md', 'lg']" />
        <HstSelect v-model="state.surface" title="Surface" :options="['', 'overlay', 'glass']" />
      </template>

      <template #default="{ state }">
        <div style="padding: 16px; min-height: 320px">
          <Dialog
            :open="true"
            :portal="false"
            :modal="false"
            :size="state.size || undefined"
            :surface="state.surface || undefined"
            title="Invite member"
            description="They'll get an email with a link to join the project."
          >
            <Input type="email" label="Email" />
            <template #footer>
              <Button variant="outline" color="neutral">Cancel</Button>
              <Button>Send invite</Button>
            </template>
          </Dialog>
        </div>
      </template>
    </Variant>

    <Variant title="Confirm">
      <div style="padding: 16px; min-height: 260px">
        <Dialog
          :open="true"
          :portal="false"
          :modal="false"
          size="sm"
          color="error"
          icon="trash"
          title="Delete Cedarwood Estates?"
          description="The listing and its 3 open offers will be removed. This can't be undone."
        >
          <template #footer>
            <Button variant="outline" color="neutral">Cancel</Button>
            <Button color="error">Delete listing</Button>
          </template>
        </Dialog>
      </div>
    </Variant>

    <Variant title="Interactive">
      <div style="display: flex; gap: 8px">
        <Dialog
          v-model:open="inviteOpen"
          trigger="Invite member"
          title="Invite member"
          description="They'll get an email with a link to join the project."
        >
          <Input type="email" label="Email" />
          <template #footer>
            <Button variant="outline" color="neutral" @click="inviteOpen = false">Cancel</Button>
            <Button @click="inviteOpen = false">Send invite</Button>
          </template>
        </Dialog>
        <Button color="error" variant="soft" @click="confirmOpen = true">Delete listing</Button>
        <Dialog
          v-model:open="confirmOpen"
          role="alertdialog"
          size="sm"
          color="error"
          icon="trash"
          title="Delete Cedarwood Estates?"
          description="The listing and its 3 open offers will be removed. This can't be undone."
        >
          <template #footer>
            <Button variant="outline" color="neutral" @click="confirmOpen = false">Cancel</Button>
            <Button color="error" @click="confirmOpen = false">Delete listing</Button>
          </template>
        </Dialog>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Dialog

A modal window for a focused task or a confirmation (`.apui-dialog`). Focus is trapped while
it's open, scroll is locked and the page behind is hidden from assistive technology; Escape,
the close button and the backdrop close it, and focus returns to the trigger.

## Usage

```vue
<Dialog
  v-model:open="open"
  trigger="Invite member"
  title="Invite member"
  description="They'll get an email with a link to join the project."
>
  <Input type="email" label="Email" />
  <template #footer>
    <Button variant="outline" color="neutral" @click="open = false">Cancel</Button>
    <Button @click="open = false">Send invite</Button>
  </template>
</Dialog>
```

Use `role="alertdialog"` for confirmations that interrupt: the backdrop doesn't close them
and focus starts on the close button.
</docs>
