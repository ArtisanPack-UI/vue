<script setup lang="ts">
/** @module ai/SettingsPage */
import { computed, onMounted, reactive, ref } from 'vue';
import type {
  AiApiClient,
  AiConnectionTestResult,
  AiFeatureOverride,
  AiSettingsResponse,
  AiSettingsUpdate,
} from '../types';
import { AiApiError } from '../createAiApiClient';

interface Props {
  /** API client wrapping the artisanpack-ui/ai JSON endpoints. */
  client: AiApiClient;
  /** Provider IDs shown in the provider dropdown. */
  providers?: string[];
  /** Optional heading rendered above the form. */
  heading?: string;
}

const props = withDefaults(defineProps<Props>(), {
  providers: () => ['openai', 'anthropic', 'ollama'],
  heading: undefined,
});

interface FormState {
  provider: string;
  api_key: string;
  base_url: string;
  default_model: string;
  overrides: AiFeatureOverride[];
}

const emptyForm: FormState = {
  provider: 'openai',
  api_key: '',
  base_url: '',
  default_model: '',
  overrides: [],
};

const initial = ref<AiSettingsResponse | null>(null);
const form = reactive<FormState>({ ...emptyForm });
const loading = ref(true);
const saving = ref(false);
const testing = ref(false);
const errors = ref<Record<string, string[]>>({});
const status = ref<string | null>(null);
const testResult = ref<AiConnectionTestResult | null>(null);

function toFormState(response: AiSettingsResponse): void {
  form.provider = response.credentials.provider;
  form.api_key = '';
  form.base_url = response.credentials.base_url ?? '';
  form.default_model = response.credentials.default_model ?? '';
  form.overrides = response.feature_overrides.map((o) => ({ ...o }));
}

function toUpdatePayload(): AiSettingsUpdate {
  return {
    provider: form.provider,
    api_key: form.api_key === '' ? null : form.api_key,
    base_url: form.base_url === '' ? null : form.base_url,
    default_model: form.default_model === '' ? null : form.default_model,
    feature_overrides: form.overrides.map((override) => ({
      feature_key: override.feature_key,
      model: override.model,
      instructions: override.instructions,
    })),
  };
}

const apiKeyPresent = computed(() => initial.value?.credentials.api_key_present ?? false);
const isOllama = computed(() => form.provider === 'ollama');

onMounted(async () => {
  loading.value = true;
  try {
    const response = await props.client.getSettings();
    initial.value = response;
    toFormState(response);
  } catch (err) {
    status.value = (err as Error).message;
  } finally {
    loading.value = false;
  }
});

async function handleSubmit(): Promise<void> {
  saving.value = true;
  errors.value = {};
  status.value = null;
  try {
    const response = await props.client.updateSettings(toUpdatePayload());
    initial.value = response;
    toFormState(response);
    status.value = 'Settings saved.';
  } catch (err) {
    if (err instanceof AiApiError && err.status === 422) {
      const body = err.body as { errors?: Record<string, string[]>; message?: string };
      errors.value = body?.errors ?? {};
      status.value = body?.message ?? err.message;
    } else {
      status.value = (err as Error).message;
    }
  } finally {
    saving.value = false;
  }
}

async function handleTest(): Promise<void> {
  testing.value = true;
  testResult.value = null;
  try {
    testResult.value = await props.client.testConnection({
      provider: form.provider,
      api_key: form.api_key === '' ? null : form.api_key,
      base_url: form.base_url === '' ? null : form.base_url,
      default_model: form.default_model === '' ? null : form.default_model,
    });
  } catch (err) {
    if (err instanceof AiApiError) {
      testResult.value = (err.body as AiConnectionTestResult | null) ?? {
        result: 'error',
        message: err.message,
      };
    } else {
      testResult.value = { result: 'error', message: (err as Error).message };
    }
  } finally {
    testing.value = false;
  }
}
</script>

<template>
  <div
    v-if="loading"
    class="flex items-center gap-2"
    role="status"
    aria-live="polite"
  >
    <span class="loading loading-spinner loading-sm" aria-hidden="true" />
    <span>Loading AI settings…</span>
  </div>

  <form
    v-else
    class="flex flex-col gap-6"
    data-testid="ai-settings-page"
    novalidate
    @submit.prevent="handleSubmit"
  >
    <h2 v-if="heading" class="text-lg font-semibold">{{ heading }}</h2>

    <div
      v-if="status"
      role="status"
      aria-live="polite"
      :class="Object.keys(errors).length > 0 ? 'alert alert-error' : 'alert alert-success'"
    >
      <span>{{ status }}</span>
    </div>

    <fieldset class="flex flex-col gap-3">
      <legend class="text-base font-medium">Credentials</legend>

      <label class="form-control flex flex-col gap-1">
        <span class="label-text">Provider</span>
        <select v-model="form.provider" class="select select-bordered">
          <option v-for="provider in props.providers" :key="provider" :value="provider">
            {{ provider }}
          </option>
        </select>
        <span
          v-for="message in errors.provider"
          :key="message"
          class="label-text-alt text-error"
        >{{ message }}</span>
      </label>

      <label v-if="!isOllama" class="form-control flex flex-col gap-1">
        <span class="label-text">
          API key <span v-if="apiKeyPresent">(leave blank to keep the stored key)</span>
        </span>
        <input
          v-model="form.api_key"
          type="password"
          autocomplete="off"
          class="input input-bordered"
          :placeholder="apiKeyPresent ? '••••••••' : 'sk-…'"
        >
        <span
          v-for="message in errors.api_key"
          :key="message"
          class="label-text-alt text-error"
        >{{ message }}</span>
      </label>

      <label class="form-control flex flex-col gap-1">
        <span class="label-text">
          Base URL <span v-if="isOllama">(required)</span><span v-else>(optional)</span>
        </span>
        <input
          v-model="form.base_url"
          type="url"
          class="input input-bordered"
          :placeholder="isOllama ? 'http://localhost:11434' : 'https://api.example.com/v1'"
        >
        <span
          v-for="message in errors.base_url"
          :key="message"
          class="label-text-alt text-error"
        >{{ message }}</span>
      </label>

      <label class="form-control flex flex-col gap-1">
        <span class="label-text">Default model</span>
        <input
          v-model="form.default_model"
          type="text"
          class="input input-bordered"
          placeholder="gpt-4o-mini"
        >
        <span
          v-for="message in errors.default_model"
          :key="message"
          class="label-text-alt text-error"
        >{{ message }}</span>
      </label>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="btn btn-outline btn-sm"
          :disabled="testing"
          @click="handleTest"
        >
          {{ testing ? 'Testing…' : 'Test connection' }}
        </button>
        <span
          v-if="testResult"
          role="status"
          :class="testResult.result === 'ok' ? 'text-sm text-success' : 'text-sm text-error'"
        >
          {{ testResult.message ?? (testResult.result === 'ok' ? 'OK' : 'Failed') }}
        </span>
      </div>
    </fieldset>

    <fieldset v-if="form.overrides.length > 0" class="flex flex-col gap-3">
      <legend class="text-base font-medium">Per-feature overrides</legend>
      <div
        v-for="(override, index) in form.overrides"
        :key="override.feature_key"
        class="rounded-box border border-base-300 p-3"
      >
        <div class="text-sm font-medium">
          {{ override.package }} · {{ override.feature_key }}
        </div>
        <label class="form-control mt-2 flex flex-col gap-1">
          <span class="label-text">Model</span>
          <input
            v-model="form.overrides[index].model"
            type="text"
            class="input input-bordered input-sm"
            placeholder="inherit default"
          >
        </label>
        <label class="form-control mt-2 flex flex-col gap-1">
          <span class="label-text">Instructions</span>
          <textarea
            v-model="form.overrides[index].instructions"
            class="textarea textarea-bordered"
            rows="3"
          />
        </label>
      </div>
    </fieldset>

    <div class="flex justify-end">
      <button type="submit" class="btn btn-primary" :disabled="saving">
        {{ saving ? 'Saving…' : 'Save settings' }}
      </button>
    </div>
  </form>
</template>
