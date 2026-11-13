<script setup lang="ts">
/** @module ai/SettingsPage */
import { computed, onScopeDispose, reactive, ref, watch } from 'vue';
import type {
  AiApiClient,
  AiConnectionTestResult,
  AiFeatureOverride,
  AiSettingsResponse,
  AiSettingsUpdate,
} from '../types';
import { AiApiError } from '../createAiApiClient';
import { errorMessage } from '../errorMessage';
import Alert from '../../feedback/Alert/Alert.vue';
import Loading from '../../feedback/Loading/Loading.vue';
import Button from '../../form/Button/Button.vue';
import Fieldset from '../../form/Fieldset/Fieldset.vue';
import Form from '../../form/Form/Form.vue';
import Input from '../../form/Input/Input.vue';
import Password from '../../form/Password/Password.vue';
import Select from '../../form/Select/Select.vue';
import Textarea from '../../form/Textarea/Textarea.vue';
import Card from '../../layout/Card/Card.vue';
import Heading from '../../layout/Heading/Heading.vue';
import Stack from '../../layout/Stack/Stack.vue';
import Text from '../../layout/Text/Text.vue';

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
const loadError = ref<string | null>(null);
const saving = ref(false);
const testing = ref(false);
const errors = ref<Record<string, string[]>>({});
const status = ref<string | null>(null);
const statusVariant = ref<'success' | 'error'>('success');
const testResult = ref<AiConnectionTestResult | null>(null);
// Bumped on every load, so a slower earlier load can't overwrite a newer one.
let loadSeq = 0;
// Bumped whenever the credentials change, so a probe only reports on the
// credentials it actually tested.
let testSeq = 0;

function toFormState(response: AiSettingsResponse): void {
  form.provider = response.credentials.provider;
  form.api_key = '';
  form.base_url = response.credentials.base_url ?? '';
  form.default_model = response.credentials.default_model ?? '';
  form.overrides = response.feature_overrides.map((o) => ({ ...o }));
}

/**
 * The credential fields shared by save and test-connection. A blank API key is
 * omitted, which the API reads as "keep the stored key".
 */
function toCredentials(): Omit<AiSettingsUpdate, 'feature_overrides'> {
  return {
    provider: form.provider,
    ...(form.api_key === '' ? {} : { api_key: form.api_key }),
    base_url: form.base_url === '' ? null : form.base_url,
    default_model: form.default_model === '' ? null : form.default_model,
  };
}

function toUpdatePayload(): AiSettingsUpdate {
  return {
    ...toCredentials(),
    feature_overrides: form.overrides.map((override) => ({
      feature_key: override.feature_key,
      model: override.model,
      instructions: override.instructions,
    })),
  };
}

const apiKeyPresent = computed(() => initial.value?.credentials.api_key_present ?? false);
const isOllama = computed(() => form.provider === 'ollama');

async function loadSettings(): Promise<void> {
  const seq = ++loadSeq;
  invalidateTest();
  loading.value = true;
  loadError.value = null;
  initial.value = null;
  try {
    const response = await props.client.getSettings();
    if (seq !== loadSeq) return;
    invalidateTest();
    initial.value = response;
    toFormState(response);
  } catch (err) {
    if (seq !== loadSeq) return;
    loadError.value = errorMessage(err);
  } finally {
    if (seq === loadSeq) loading.value = false;
  }
}

watch(() => props.client, loadSettings, { immediate: true });

onScopeDispose(() => {
  loadSeq++;
  testSeq++;
});

/** Clears any probe result, and retires an in-flight probe, when credentials change. */
function invalidateTest(): void {
  testSeq++;
  testResult.value = null;
  testing.value = false;
}

watch(() => [form.provider, form.api_key, form.base_url, form.default_model], invalidateTest);

function handleProviderChange(provider: string): void {
  // Reset the typed key + last probe result so we don't silently ship
  // an OpenAI key to an Ollama base URL (or the other way around).
  form.provider = provider;
  form.api_key = '';
  invalidateTest();
}

async function handleSubmit(): Promise<void> {
  saving.value = true;
  errors.value = {};
  status.value = null;
  try {
    const response = await props.client.updateSettings(toUpdatePayload());
    invalidateTest();
    initial.value = response;
    toFormState(response);
    status.value = 'Settings saved.';
    statusVariant.value = 'success';
  } catch (err) {
    statusVariant.value = 'error';
    if (err instanceof AiApiError && err.status === 422) {
      const body = err.body as { errors?: Record<string, string[]>; message?: string };
      errors.value = body?.errors ?? {};
      status.value = body?.message ?? err.message;
    } else {
      status.value = errorMessage(err);
    }
  } finally {
    saving.value = false;
  }
}

/** Joins a field's validation messages into the single string the field components take. */
function fieldError(field: string): string | undefined {
  return errors.value[field]?.join(' ');
}

async function handleTest(): Promise<void> {
  const seq = ++testSeq;
  testing.value = true;
  testResult.value = null;
  let result: AiConnectionTestResult;
  try {
    result = await props.client.testConnection(toCredentials());
  } catch (err) {
    if (err instanceof AiApiError) {
      result = (err.body as AiConnectionTestResult | null) ?? {
        result: 'error',
        message: err.message,
      };
    } else {
      result = { result: 'error', message: errorMessage(err) };
    }
  }
  if (seq !== testSeq) return;
  testResult.value = result;
  testing.value = false;
}
</script>

<template>
  <Loading v-if="loading" size="sm"> Loading AI settings… </Loading>

  <Alert
    v-else-if="loadError !== null || initial === null"
    color="error"
    title="The AI settings couldn't be loaded."
    :description="loadError ?? undefined"
  >
    <template #actions>
      <Button variant="outline" color="neutral" size="sm" @click="loadSettings"> Retry </Button>
    </template>
  </Alert>

  <Form v-else data-testid="ai-settings-page" novalidate @submit.prevent="handleSubmit">
    <Heading v-if="heading" :level="2">
      {{ heading }}
    </Heading>

    <Alert
      v-if="status"
      :color="statusVariant === 'error' ? 'error' : 'success'"
      :description="status"
    />

    <Fieldset title="Credentials" :disabled="saving">
      <Select
        label="Provider"
        :options="props.providers"
        :model-value="form.provider"
        :error="fieldError('provider')"
        @update:model-value="(provider) => handleProviderChange(String(provider))"
      />

      <Password
        v-if="!isOllama"
        v-model="form.api_key"
        label="API key"
        :hint="apiKeyPresent ? 'Leave blank to keep the stored key.' : undefined"
        autocomplete="new-password"
        :placeholder="apiKeyPresent ? '••••••••' : 'sk-…'"
        :error="fieldError('api_key')"
      />

      <Input
        v-model="form.base_url"
        type="url"
        label="Base URL"
        :hint="isOllama ? 'Required for Ollama.' : 'Optional.'"
        :required="isOllama"
        :placeholder="isOllama ? 'http://localhost:11434' : 'https://api.example.com/v1'"
        :error="fieldError('base_url')"
      />

      <Input
        v-model="form.default_model"
        label="Default model"
        placeholder="gpt-4o-mini"
        :error="fieldError('default_model')"
      />

      <Stack orientation="horizontal" gap="2" align="center" wrap>
        <Button variant="outline" color="neutral" size="sm" :loading="testing" @click="handleTest">
          Test connection
        </Button>
        <Text
          v-if="testResult"
          as="span"
          size="sm"
          role="status"
          :tone="testResult.result === 'ok' ? 'success' : 'error'"
        >
          {{ testResult.message ?? (testResult.result === 'ok' ? 'OK' : 'Failed') }}
        </Text>
      </Stack>
    </Fieldset>

    <Fieldset v-if="form.overrides.length > 0" title="Per-feature overrides" :disabled="saving">
      <Card
        v-for="override in form.overrides"
        :key="override.feature_key"
        :title="`${override.package} · ${override.feature_key}`"
      >
        <Stack gap="3">
          <Input
            size="sm"
            label="Model"
            placeholder="inherit default"
            :model-value="override.model ?? ''"
            @update:model-value="(model) => (override.model = model === '' ? null : model)"
          />
          <Textarea
            label="Instructions"
            :rows="3"
            :model-value="override.instructions ?? ''"
            @update:model-value="
              (instructions) => (override.instructions = instructions === '' ? null : instructions)
            "
          />
        </Stack>
      </Card>
    </Fieldset>

    <template #actions>
      <Button type="submit" color="primary" :loading="saving"> Save settings </Button>
    </template>
  </Form>
</template>
