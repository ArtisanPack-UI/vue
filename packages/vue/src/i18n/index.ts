/**
 * @module @artisanpack-ui/vue/i18n
 *
 * Translations for the components' built-in text. See {@link provideTranslations}.
 *
 * @packageDocumentation
 */

export {
  createTranslator,
  createTranslatorRef,
  formatMessage,
  provideTranslations,
  selectPluralForm,
  toLanguageTag,
  TranslationProvider,
  TranslatorKey,
  useTranslator,
} from './translator';
export type {
  ReactiveTranslator,
  TranslateChoiceFunction,
  TranslateFunction,
  TranslationMessages,
  TranslationOptions,
  TranslationParams,
  Translator,
} from './translator';
