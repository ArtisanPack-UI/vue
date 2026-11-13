<script setup lang="ts">
/** @module ai/FeatureToggles */
import { onMounted, reactive, ref } from 'vue';
import type { AiApiClient, AiFeature } from '../types';

interface Props {
  /** API client wrapping the artisanpack-ui/ai JSON endpoints. */
  client: AiApiClient;
  /** Optional heading rendered above the list. */
  heading?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  toggle: [feature: Pick<AiFeature, 'key' | 'package' | 'enabled'>];
}>();

const features = ref<AiFeature[] | null>(null);
const error = ref<string | null>(null);
const pending = reactive<Record<string, boolean>>({});

onMounted(async () => {
  try {
    const response = await props.client.getFeatures();
    features.value = response.features;
  } catch (err) {
    error.value = (err as Error).message;
  }
});

async function handleToggle(feature: AiFeature): Promise<void> {
  const target = !feature.enabled;
  pending[feature.key] = true;
  // Optimistic flip
  if (features.value) {
    features.value = features.value.map((f) =>
      f.key === feature.key ? { ...f, enabled: target } : f,
    );
  }

  try {
    const response = await props.client.toggleFeature(feature.key, target);
    error.value = null;
    emit('toggle', response.feature);
  } catch (err) {
    // Roll back on failure
    if (features.value) {
      features.value = features.value.map((f) =>
        f.key === feature.key ? { ...f, enabled: feature.enabled } : f,
      );
    }
    error.value = (err as Error).message;
  } finally {
    delete pending[feature.key];
  }
}
</script>

<template>
  <div class="flex flex-col gap-3" data-testid="ai-feature-toggles">
    <h2 v-if="heading" class="text-lg font-semibold">
      {{ heading }}
    </h2>

    <div v-if="error && !features" role="alert" class="alert alert-error">
      <span>{{ error }}</span>
    </div>

    <div v-else-if="!features" class="flex items-center gap-2" role="status" aria-live="polite">
      <span class="loading loading-spinner loading-sm" aria-hidden="true" />
      <span>Loading features…</span>
    </div>

    <div v-else-if="features.length === 0" class="text-sm text-base-content/70" role="status">
      No AI features registered.
    </div>

    <template v-else>
      <div v-if="error" role="alert" class="alert alert-error">
        <span>{{ error }}</span>
      </div>
      <ul class="flex flex-col gap-2">
        <li
          v-for="feature in features"
          :key="feature.key"
          class="flex items-center justify-between gap-4 rounded-box border border-base-300 p-3"
        >
          <div class="flex flex-col">
            <span class="font-medium">{{ feature.label }}</span>
            <span v-if="feature.description" class="text-sm text-base-content/70">{{
              feature.description
            }}</span>
            <span class="text-xs uppercase tracking-wide text-base-content/50">
              {{ feature.package }} · {{ feature.key }}
            </span>
          </div>
          <label class="cursor-pointer">
            <span class="sr-only">
              {{ feature.enabled ? 'Disable' : 'Enable' }} {{ feature.label }}
            </span>
            <input
              type="checkbox"
              class="toggle toggle-primary"
              :checked="feature.enabled"
              :disabled="pending[feature.key] === true"
              :aria-label="`Toggle ${feature.label}`"
              @change="handleToggle(feature)"
            />
          </label>
        </li>
      </ul>
    </template>
  </div>
</template>
