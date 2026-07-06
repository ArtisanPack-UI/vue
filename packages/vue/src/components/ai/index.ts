/**
 * @module ai
 *
 * Vue components + composables for consuming the artisanpack-ui/ai JSON API.
 * Shipped as the `@artisanpack-ui/vue/ai` subpath.
 *
 * @example
 * ```ts
 * import { createAiApiClient, SettingsPage, UsageDashboard, FeatureToggles } from '@artisanpack-ui/vue/ai';
 * ```
 */

export { default as SettingsPage } from './SettingsPage/SettingsPage.vue';
export { default as UsageDashboard } from './UsageDashboard/UsageDashboard.vue';
export { default as FeatureToggles } from './FeatureToggles/FeatureToggles.vue';

export { createAiApiClient, AiApiError } from './createAiApiClient';
export type { CreateAiApiClientOptions } from './createAiApiClient';

export { useStreamingText } from './useStreamingText';
export type { UseStreamingTextResult } from './useStreamingText';

export type {
  AiApiClient,
  AiCredentials,
  AiFeature,
  AiFeatureOverride,
  AiSettingsResponse,
  AiSettingsUpdate,
  AiConnectionTestResult,
  AiUsageTotals,
  AiUsageByFeature,
  AiUsageDaily,
  AiUsageResponse,
  AiValidationError,
} from './types';
