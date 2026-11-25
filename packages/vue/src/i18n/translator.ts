/**
 * @module i18n
 *
 * Translations for the components' built-in text (#66): accessible names,
 * placeholders, empty states and the like. Every string is keyed by its
 * English text, the same way Laravel's JSON translation files are, so a
 * component renders English when no translations are provided.
 *
 * The package ships a catalogue per locale under `@artisanpack-ui/vue/lang`.
 * Give one (merged with your own overrides) to the plugin, to
 * {@link provideTranslations} or to the {@link TranslationProvider} component:
 *
 * ```ts
 * import es from '@artisanpack-ui/vue/lang/es.json';
 *
 * app.use(createArtisanPackUI({ locale: 'es', messages: { ...es, Close: 'Salir' } }));
 * ```
 *
 * The locale and the catalogue may be refs or getters, so switching language
 * at runtime re-renders the components' text. A prop always wins over the
 * catalogue: `<Dialog close-label="…">` keeps its text whatever the locale.
 *
 * @packageDocumentation
 */

import {
  computed,
  defineComponent,
  inject,
  provide,
  toValue,
  type ComputedRef,
  type InjectionKey,
  type MaybeRefOrGetter,
  type PropType,
} from 'vue';

/** A catalogue: English text to translated text. */
export type TranslationMessages = Readonly<Record<string, string>>;

/** Values for a string's `{name}` placeholders. */
export type TranslationParams = Readonly<Record<string, string | number>>;

/** Translates a string, filling its `{name}` placeholders. */
export type TranslateFunction = (key: string, params?: TranslationParams) => string;

/**
 * Translates a string with plural forms and fills `{count}` and the other
 * placeholders. The forms are separated by `|`, one per CLDR plural category
 * the locale uses, in the order zero, one, two, few, many, other: English
 * `'{count} item|{count} items'`, Japanese a single form, Arabic six.
 */
export type TranslateChoiceFunction = (
  key: string,
  count: number,
  params?: TranslationParams,
) => string;

/** A translator for one locale and catalogue. */
export interface Translator {
  /** Translates a string. */
  t: TranslateFunction;
  /** Translates a string with plural forms. */
  tChoice: TranslateChoiceFunction;
  /**
   * The locale as a BCP 47 tag (`pt_BR` becomes `pt-BR`), or `undefined`
   * when no translations are provided.
   */
  locale: string | undefined;
}

/**
 * What {@link useTranslator} returns. `t` and `tChoice` read the nearest
 * translations each time they run, so calls in a template, a `computed` or a
 * render function follow a change of locale or catalogue.
 */
export interface ReactiveTranslator {
  /** Translates a string. */
  t: TranslateFunction;
  /** Translates a string with plural forms. */
  tChoice: TranslateChoiceFunction;
  /**
   * The locale as a BCP 47 tag, or `undefined` without translations.
   * Components that format dates or numbers use it unless given their own `locale`.
   */
  locale: ComputedRef<string | undefined>;
}

/** What {@link provideTranslations} and the plugin take. */
export interface TranslationOptions {
  /** The locale, as a BCP 47 tag or a Laravel locale (`pt_BR`). Picks the plural rules. */
  locale: MaybeRefOrGetter<string>;
  /** The catalogue. Strings missing from it render in English. */
  messages?: MaybeRefOrGetter<TranslationMessages | undefined>;
}

const CATEGORY_ORDER: readonly Intl.LDMLPluralRule[] = [
  'zero',
  'one',
  'two',
  'few',
  'many',
  'other',
];

/** Turns a Laravel locale (`pt_BR`) into a BCP 47 tag (`pt-BR`). */
export function toLanguageTag(locale: string): string {
  return locale.replaceAll('_', '-');
}

/** Fills each `{name}` placeholder in `text` with its value from `params`. */
export function formatMessage(text: string, params?: TranslationParams): string {
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : match,
  );
}

/**
 * Picks the plural form for `count` from `|`-separated `forms` under the
 * locale's rules. When the form count doesn't match the runtime's categories
 * (a translation with too few forms, or an older browser whose CLDR data lacks
 * a category the catalogue has), `one` takes the first form and every other
 * category the last, so the result is never a form meant for another count.
 */
export function selectPluralForm(forms: string, count: number, locale = 'en'): string {
  const parts = forms.split('|');
  if (parts.length === 1) return parts[0];
  let rules: Intl.PluralRules;
  try {
    rules = new Intl.PluralRules(toLanguageTag(locale));
  } catch {
    rules = new Intl.PluralRules('en');
  }
  const categories = CATEGORY_ORDER.filter((category) =>
    rules.resolvedOptions().pluralCategories.includes(category),
  );
  const category = rules.select(count);
  if (parts.length === categories.length) return parts[categories.indexOf(category)];
  return category === 'one' ? parts[0] : parts[parts.length - 1];
}

/** Whether two catalogues hold the same entries. */
function sameMessages(
  a: TranslationMessages | undefined,
  b: TranslationMessages | undefined,
): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  const keys = Object.keys(a);
  return keys.length === Object.keys(b).length && keys.every((key) => a[key] === b[key]);
}

/** Builds a {@link Translator} from a locale and a catalogue. */
export function createTranslator(locale?: string, messages: TranslationMessages = {}): Translator {
  const lookup = (key: string): string | undefined => {
    const value = messages[key];
    return typeof value === 'string' && value !== '' ? value : undefined;
  };
  return {
    locale: locale === undefined ? undefined : toLanguageTag(locale),
    t: (key, params) => formatMessage(lookup(key) ?? key, params),
    tChoice: (key, count, params) => {
      const translated = lookup(key);
      // English forms follow English plural rules when the catalogue has no entry.
      const form = selectPluralForm(translated ?? key, count, translated ? locale : 'en');
      return formatMessage(form, { count, ...params });
    },
  };
}

interface TranslatorState {
  translator: Translator;
  locale: string | undefined;
  messages: TranslationMessages | undefined;
}

/**
 * Injection key for the nearest translations. A registry symbol, so a second
 * copy of the package (two bundles, or a subpath entry bundled apart) still
 * finds the provider.
 */
export const TranslatorKey: InjectionKey<ComputedRef<Translator>> = Symbol.for(
  'artisanpack-ui.vue.translator',
);

const englishTranslator = createTranslator();

/**
 * A computed translator over `options`. A catalogue rebuilt with the same
 * entries (`{ ...es, Close: 'Salir' }` inline in a template) keeps the same
 * translator, so the components using it don't re-render for it.
 */
export function createTranslatorRef(options: TranslationOptions): ComputedRef<Translator> {
  const state = computed<TranslatorState>((previous) => {
    const locale = toValue(options.locale);
    const messages = toValue(options.messages);
    if (previous && previous.locale === locale && sameMessages(previous.messages, messages)) {
      return previous;
    }
    return { translator: createTranslator(locale, messages), locale, messages };
  });
  return computed(() => state.value.translator);
}

/**
 * Gives the calling component's descendants a locale and a catalogue for the
 * components' built-in text. Call it in `setup`. Providers nest; the nearest
 * one wins.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { ref } from 'vue';
 * import { provideTranslations } from '@artisanpack-ui/vue';
 * import fr from '@artisanpack-ui/vue/lang/fr.json';
 *
 * const locale = ref('fr');
 * provideTranslations({ locale, messages: fr });
 * </script>
 * ```
 */
export function provideTranslations(options: TranslationOptions): ComputedRef<Translator> {
  const translator = createTranslatorRef(options);
  provide(TranslatorKey, translator);
  return translator;
}

/**
 * The nearest translations' translator, or English without any. Call it in
 * `setup`.
 */
export function useTranslator(): ReactiveTranslator {
  const current = inject(TranslatorKey, null);
  const active = (): Translator => current?.value ?? englishTranslator;
  return {
    t: (key, params) => active().t(key, params),
    tChoice: (key, count, params) => active().tChoice(key, count, params),
    locale: computed(() => active().locale),
  };
}

/**
 * Gives the components in its default slot a locale and a catalogue for their
 * built-in text, like {@link provideTranslations} in a template.
 *
 * @example
 * ```vue
 * <TranslationProvider locale="es" :messages="es">
 *   <App />
 * </TranslationProvider>
 * ```
 */
export const TranslationProvider = defineComponent({
  name: 'TranslationProvider',
  props: {
    /** The locale, as a BCP 47 tag or a Laravel locale (`pt_BR`). */
    locale: { type: String, required: true },
    /** The catalogue. Strings missing from it render in English. */
    messages: { type: Object as PropType<TranslationMessages>, default: undefined },
  },
  setup(props, { slots }) {
    provideTranslations({ locale: () => props.locale, messages: () => props.messages });
    return () => slots.default?.();
  },
});
