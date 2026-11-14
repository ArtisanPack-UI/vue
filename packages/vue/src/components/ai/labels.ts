/**
 * @module ai/labels
 *
 * The built-in text of the AI components. Each component takes a `labels`
 * prop with any of its keys, merged over these English defaults, so an app
 * can translate them.
 */

/** Built-in text of SettingsPage. */
export interface SettingsPageLabels {
  /** While the settings load. */
  loading: string;
  /** The title of the alert when the settings can't be loaded. */
  loadError: string;
  /** The button that loads the settings again. */
  retry: string;
  /** The status after a save. */
  saved: string;
  /** The credentials fieldset's title. */
  credentials: string;
  provider: string;
  apiKey: string;
  /** The API key's hint when a key is stored. */
  apiKeyKeepHint: string;
  /** The API key's placeholder when no key is stored. */
  apiKeyPlaceholder: string;
  baseUrl: string;
  /** The base URL's hint for Ollama, which needs one. */
  baseUrlRequiredHint: string;
  /** The base URL's hint for the other providers. */
  baseUrlOptionalHint: string;
  defaultModel: string;
  defaultModelPlaceholder: string;
  testConnection: string;
  /** The test result when the API sends no message and the test passed. */
  testOk: string;
  /** The test result when the API sends no message and the test failed. */
  testFailed: string;
  /** The per-feature overrides fieldset's title. */
  overrides: string;
  /** An override's model field. */
  model: string;
  /** An override's model placeholder. */
  modelPlaceholder: string;
  /** An override's instructions field. */
  instructions: string;
  /** The submit button. */
  save: string;
  /** Shown when a request fails without a message. */
  genericError: string;
}

/** Built-in text of UsageDashboard. `live` takes `:seconds`. */
export interface UsageDashboardLabels {
  /** While the first figures load. */
  loading: string;
  /** The warning title when a refresh fails and the last figures stay. */
  refreshError: string;
  /** The requests stat and column. */
  requests: string;
  inputTokens: string;
  outputTokens: string;
  /** The cost stat and column. */
  cost: string;
  /** The per-feature table's title. */
  byFeature: string;
  /** The daily table's title. */
  daily: string;
  /** The per-feature table's feature column. */
  feature: string;
  /** The per-feature table's input tokens column. */
  input: string;
  /** The per-feature table's output tokens column. */
  output: string;
  /** The daily table's day column. */
  day: string;
  /** The daily table's tokens column. */
  tokens: string;
  noFeatureUsage: string;
  noDailyUsage: string;
  /** The live status while polling; `:seconds` is the interval. */
  live: string;
  /** Shown when a request fails without a message. */
  genericError: string;
}

/** Built-in text of FeatureToggles. */
export interface FeatureTogglesLabels {
  /** While the features load. */
  loading: string;
  /** When no AI features are registered. */
  empty: string;
  /** Shown when a request fails without a message. */
  genericError: string;
}

/** @internal */
export const SETTINGS_PAGE_LABELS: SettingsPageLabels = {
  loading: 'Loading AI settings…',
  loadError: "The AI settings couldn't be loaded.",
  retry: 'Retry',
  saved: 'Settings saved.',
  credentials: 'Credentials',
  provider: 'Provider',
  apiKey: 'API key',
  apiKeyKeepHint: 'Leave blank to keep the stored key.',
  apiKeyPlaceholder: 'sk-…',
  baseUrl: 'Base URL',
  baseUrlRequiredHint: 'Required for Ollama.',
  baseUrlOptionalHint: 'Optional.',
  defaultModel: 'Default model',
  defaultModelPlaceholder: 'gpt-4o-mini',
  testConnection: 'Test connection',
  testOk: 'OK',
  testFailed: 'Failed',
  overrides: 'Per-feature overrides',
  model: 'Model',
  modelPlaceholder: 'inherit default',
  instructions: 'Instructions',
  save: 'Save settings',
  genericError: 'Something went wrong.',
};

/** @internal */
export const USAGE_DASHBOARD_LABELS: UsageDashboardLabels = {
  loading: 'Loading usage…',
  refreshError: "Couldn't refresh usage. Showing the last figures loaded.",
  requests: 'Requests',
  inputTokens: 'Input tokens',
  outputTokens: 'Output tokens',
  cost: 'Cost',
  byFeature: 'By feature',
  daily: 'Daily',
  feature: 'Feature',
  input: 'Input',
  output: 'Output',
  day: 'Day',
  tokens: 'Tokens',
  noFeatureUsage: 'No feature usage in this range.',
  noDailyUsage: 'No daily usage in this range.',
  live: 'Live · refreshing every :secondss',
  genericError: 'Something went wrong.',
};

/** @internal */
export const FEATURE_TOGGLES_LABELS: FeatureTogglesLabels = {
  loading: 'Loading features…',
  empty: 'No AI features registered.',
  genericError: 'Something went wrong.',
};
