/**
 * @module ai/labels
 *
 * The built-in text of the AI components. Each component takes a `labels`
 * prop with any of its keys, merged over its defaults: the English text, or
 * the active locale's when translations are provided (see `provideTranslations`).
 */

import type { TranslateFunction } from '../../i18n/translator';

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
  /** The API key field's reveal button's name. */
  apiKeyReveal: string;
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

/** {@link SettingsPageLabels} through a translator: the English defaults, or the active locale's. */
export function settingsPageLabels(t: TranslateFunction): SettingsPageLabels {
  return {
    loading: t('Loading AI settings…'),
    loadError: t("The AI settings couldn't be loaded."),
    retry: t('Retry'),
    saved: t('Settings saved.'),
    credentials: t('Credentials'),
    provider: t('Provider'),
    apiKey: t('API key'),
    apiKeyKeepHint: t('Leave blank to keep the stored key.'),
    apiKeyPlaceholder: 'sk-…',
    apiKeyReveal: t('Show password'),
    baseUrl: t('Base URL'),
    baseUrlRequiredHint: t('Required for Ollama.'),
    baseUrlOptionalHint: t('Optional.'),
    defaultModel: t('Default model'),
    defaultModelPlaceholder: 'gpt-4o-mini',
    testConnection: t('Test connection'),
    testOk: t('OK'),
    testFailed: t('Failed'),
    overrides: t('Per-feature overrides'),
    model: t('Model'),
    modelPlaceholder: t('inherit default'),
    instructions: t('Instructions'),
    save: t('Save settings'),
    genericError: t('Something went wrong.'),
  };
}

/** {@link UsageDashboardLabels} through a translator: the English defaults, or the active locale's. */
export function usageDashboardLabels(t: TranslateFunction): UsageDashboardLabels {
  return {
    loading: t('Loading usage…'),
    refreshError: t("Couldn't refresh usage. Showing the last figures loaded."),
    requests: t('Requests'),
    inputTokens: t('Input tokens'),
    outputTokens: t('Output tokens'),
    cost: t('Cost'),
    byFeature: t('By feature'),
    daily: t('Daily'),
    feature: t('Feature'),
    input: t('Input'),
    output: t('Output'),
    day: t('Day'),
    tokens: t('Tokens'),
    noFeatureUsage: t('No feature usage in this range.'),
    noDailyUsage: t('No daily usage in this range.'),
    live: t('Live · refreshing every :seconds s'),
    genericError: t('Something went wrong.'),
  };
}

/** {@link FeatureTogglesLabels} through a translator: the English defaults, or the active locale's. */
export function featureTogglesLabels(t: TranslateFunction): FeatureTogglesLabels {
  return {
    loading: t('Loading features…'),
    empty: t('No AI features registered.'),
    genericError: t('Something went wrong.'),
  };
}
