import { render, screen } from '@testing-library/vue';
import { createApp, defineComponent, h, nextTick, ref, type Ref } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import {
  TranslationProvider,
  createTranslator,
  formatMessage,
  provideTranslations,
  selectPluralForm,
  toLanguageTag,
  useTranslator,
  type ReactiveTranslator,
  type TranslationMessages,
} from '../../i18n/translator';
import { createArtisanPackUI } from '../../plugin';
import en from '../../../lang/en.json';

const catalogues = import.meta.glob<Record<string, string>>('../../../lang/*.json', {
  import: 'default',
  eager: true,
});

describe('formatMessage', () => {
  it('fills placeholders and leaves unknown ones', () => {
    expect(formatMessage('Page {page} of {pageCount}', { page: 2, pageCount: 9 })).toBe(
      'Page 2 of 9',
    );
    expect(formatMessage('Hello {name}', {})).toBe('Hello {name}');
    expect(formatMessage('Hello {name}')).toBe('Hello {name}');
  });
});

describe('toLanguageTag', () => {
  it('turns a Laravel locale into a BCP 47 tag', () => {
    expect(toLanguageTag('pt_BR')).toBe('pt-BR');
    expect(toLanguageTag('zh_CN')).toBe('zh-CN');
    expect(toLanguageTag('es')).toBe('es');
  });
});

describe('selectPluralForm', () => {
  it('follows English rules', () => {
    expect(selectPluralForm('{count} item|{count} items', 1, 'en')).toBe('{count} item');
    expect(selectPluralForm('{count} item|{count} items', 0, 'en')).toBe('{count} items');
    expect(selectPluralForm('{count} item|{count} items', 5, 'en')).toBe('{count} items');
  });

  it('uses the only form for a locale without plurals', () => {
    expect(selectPluralForm('{count} 件', 1, 'ja')).toBe('{count} 件');
  });

  it("orders Arabic's six categories zero, one, two, few, many, other", () => {
    const forms = 'zero|one|two|few|many|other';
    expect(selectPluralForm(forms, 0, 'ar')).toBe('zero');
    expect(selectPluralForm(forms, 1, 'ar')).toBe('one');
    expect(selectPluralForm(forms, 2, 'ar')).toBe('two');
    expect(selectPluralForm(forms, 3, 'ar')).toBe('few');
    expect(selectPluralForm(forms, 11, 'ar')).toBe('many');
    expect(selectPluralForm(forms, 100, 'ar')).toBe('other');
  });

  it('gives one the first form and every other category the last when a translation has too few', () => {
    expect(selectPluralForm('one|other', 1, 'ar')).toBe('one');
    expect(selectPluralForm('one|other', 0, 'ar')).toBe('other');
    expect(selectPluralForm('one|other', 2, 'ar')).toBe('other');
    expect(selectPluralForm('one|other', 3, 'ar')).toBe('other');
  });

  it('keeps the right forms on a runtime whose CLDR data lacks a category', () => {
    const Native = Intl.PluralRules;
    // An older engine: Spanish with only one and other, no many.
    class OldPluralRules extends Native {
      resolvedOptions() {
        return {
          ...super.resolvedOptions(),
          pluralCategories: ['one', 'other'] as Intl.LDMLPluralRule[],
        };
      }
      select(count: number) {
        return count === 1 ? 'one' : 'other';
      }
    }
    vi.stubGlobal('Intl', { ...Intl, PluralRules: OldPluralRules });
    try {
      const forms = '{count} campo|{count} de campos|{count} campos';
      expect(selectPluralForm(forms, 1, 'es')).toBe('{count} campo');
      expect(selectPluralForm(forms, 2, 'es')).toBe('{count} campos');
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('falls back to English rules for an unknown locale', () => {
    expect(selectPluralForm('one|other', 1, 'not a locale!')).toBe('one');
  });
});

describe('createTranslator', () => {
  it('returns English without a catalogue', () => {
    const { t, tChoice, locale } = createTranslator();
    expect(locale).toBeUndefined();
    expect(t('Close')).toBe('Close');
    expect(tChoice('{count} file|{count} files', 2)).toBe('2 files');
  });

  it('translates from the catalogue and keeps English for missing or empty keys', () => {
    const { t, locale } = createTranslator('pt_BR', { Close: 'Fechar', Open: '' });
    expect(locale).toBe('pt-BR');
    expect(t('Close')).toBe('Fechar');
    expect(t('Open')).toBe('Open');
    expect(t('Missing')).toBe('Missing');
  });

  it('applies the locale plural rules to translated forms', () => {
    const { tChoice } = createTranslator('fr', {
      '{count} file|{count} files': '{count} fichier|{count} fichiers',
    });
    expect(tChoice('{count} file|{count} files', 0)).toBe('0 fichier');
    expect(tChoice('{count} file|{count} files', 3)).toBe('3 fichiers');
  });
});

describe('useTranslator', () => {
  const Probe = defineComponent({
    setup() {
      const { t, locale } = useTranslator();
      return () => h('span', `${t('Close')} ${locale.value ?? 'none'}`);
    },
  });

  it('gives English without translations', () => {
    render(Probe);
    expect(screen.getByText('Close none')).toBeTruthy();
  });

  it('translates for the components below a provider, the nearest one winning', () => {
    render(() =>
      h(TranslationProvider, { locale: 'es', messages: { Close: 'Cerrar' } }, () => [
        h(Probe),
        h(TranslationProvider, { locale: 'de', messages: { Close: 'Schließen' } }, () => h(Probe)),
      ]),
    );
    expect(screen.getByText('Cerrar es')).toBeTruthy();
    expect(screen.getByText('Schließen de')).toBeTruthy();
  });

  it('follows a change of locale and catalogue', async () => {
    const locale = ref('es');
    const messages: Ref<TranslationMessages> = ref({ Close: 'Cerrar' });
    const Root = defineComponent({
      setup() {
        provideTranslations({ locale, messages });
        return () => h(Probe);
      },
    });
    render(Root);
    expect(screen.getByText('Cerrar es')).toBeTruthy();

    locale.value = 'fr';
    messages.value = { Close: 'Fermer' };
    await nextTick();
    expect(screen.getByText('Fermer fr')).toBeTruthy();
  });

  it('keeps the translator when the catalogue is rebuilt with the same entries', async () => {
    const entries = ref<Record<string, string>>({ Close: 'Cerrar' });
    let provided: ReturnType<typeof provideTranslations> | undefined;
    const Root = defineComponent({
      setup() {
        provided = provideTranslations({ locale: 'es', messages: () => ({ ...entries.value }) });
        return () => h('span');
      },
    });
    render(Root);
    const first = provided!.value;

    entries.value = { ...entries.value };
    await nextTick();
    expect(provided!.value).toBe(first);

    entries.value = { Close: 'Salir' };
    await nextTick();
    expect(provided!.value).not.toBe(first);
    expect(provided!.value.t('Close')).toBe('Salir');
  });

  it('takes the locale and catalogue from the plugin', () => {
    let translator: ReactiveTranslator | undefined;
    const app = createApp(
      defineComponent({
        setup() {
          translator = useTranslator();
          return () => h('div');
        },
      }),
    );
    app.use(createArtisanPackUI({ locale: 'pt_BR', messages: { Close: 'Fechar' } }));
    app.mount(document.createElement('div'));
    expect(translator!.t('Close')).toBe('Fechar');
    expect(translator!.locale.value).toBe('pt-BR');
    expect(translator!.tChoice('{count} file|{count} files', 1)).toBe('1 file');
    app.unmount();
  });

  it('leaves the plugin in English without a locale', () => {
    let translator: ReactiveTranslator | undefined;
    const app = createApp(
      defineComponent({
        setup() {
          translator = useTranslator();
          return () => h('div');
        },
      }),
    );
    app.use(createArtisanPackUI({ messages: { Close: 'Fechar' } }));
    app.mount(document.createElement('div'));
    expect(translator!.t('Close')).toBe('Close');
    expect(translator!.locale.value).toBeUndefined();
    app.unmount();
  });
});

describe('the shipped catalogues', () => {
  const locales = ['es', 'fr', 'de', 'pt_BR', 'ja', 'zh_CN', 'it', 'ar'];

  it.each(locales)('ships %s with every English key', (locale) => {
    const catalogue = catalogues[`../../../lang/${locale}.json`];
    expect(catalogue).toBeDefined();
    expect(Object.keys(catalogue).sort()).toEqual(Object.keys(en).sort());
  });

  it.each(locales)('gives every plural key in %s the forms its locale uses', (locale) => {
    const catalogue = catalogues[`../../../lang/${locale}.json`];
    const categories = new Intl.PluralRules(toLanguageTag(locale)).resolvedOptions()
      .pluralCategories.length;
    for (const key of Object.keys(en).filter((key) => key.includes('|'))) {
      expect(catalogue[key].split('|'), `${locale}: ${key}`).toHaveLength(categories);
    }
  });
});
