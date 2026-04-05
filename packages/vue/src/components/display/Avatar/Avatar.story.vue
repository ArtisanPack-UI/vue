<script setup lang="ts">
import Avatar from './Avatar.vue';
</script>

<template>
  <Story title="Display/Avatar" group="display">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstText v-model="state.src" title="Image URL" />
        <HstText v-model="state.initials" title="Initials" />
        <HstSelect v-model="state.size" title="Size" :options="['', 'xs', 'sm', 'md', 'lg']" />
        <HstSelect
          v-model="state.shape"
          title="Shape"
          :options="['', 'circle', 'squircle', 'hexagon', 'triangle']"
        />
        <HstSelect
          v-model="state.ring"
          title="Ring Color"
          :options="['', 'primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info']"
        />
        <HstCheckbox v-model="state.online" title="Online" />
        <HstCheckbox v-model="state.offline" title="Offline" />
      </template>

      <template #default="{ state }">
        <Avatar
          :src="state.src || undefined"
          :initials="state.initials || 'JD'"
          :size="state.size || undefined"
          :shape="state.shape || undefined"
          :ring="state.ring || undefined"
          :online="state.online"
          :offline="state.offline"
        />
      </template>
    </Variant>

    <Variant title="Sizes">
      <div style="display: flex; gap: 16px; align-items: center">
        <Avatar initials="XS" size="xs" />
        <Avatar initials="SM" size="sm" />
        <Avatar initials="MD" size="md" />
        <Avatar initials="LG" size="lg" />
      </div>
    </Variant>

    <Variant title="Shapes">
      <div style="display: flex; gap: 16px; align-items: center">
        <Avatar initials="CI" shape="circle" color="primary" />
        <Avatar initials="SQ" shape="squircle" color="secondary" />
        <Avatar initials="HX" shape="hexagon" color="accent" />
        <Avatar initials="TR" shape="triangle" color="success" />
      </div>
    </Variant>

    <Variant title="Online / Offline">
      <div style="display: flex; gap: 16px; align-items: center">
        <Avatar initials="ON" :online="true" ring="success" />
        <Avatar initials="OF" :offline="true" ring="error" />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Avatar

An avatar component with image, initials, shapes, sizes, and online/offline indicators.
</docs>
