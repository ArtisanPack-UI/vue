---
'@artisanpack-ui/vue': minor
---

Translate the components' built-in text.

- New `provideTranslations()`, `<TranslationProvider>` and `useTranslator()` (also from `@artisanpack-ui/vue/i18n`), plus `locale` and `messages` options on `createArtisanPackUI()`. Give the app a locale and a catalogue, and every built-in accessible name, placeholder, empty state and message renders in that language. Without one the components stay in English, and a prop such as `closeLabel` still wins over the catalogue. The locale and catalogue may be refs or getters to switch language at runtime.
- Catalogues keyed by the English text ship under `@artisanpack-ui/vue/lang/*.json` for `en`, `es`, `fr`, `de`, `pt_BR`, `ja`, `zh_CN`, `it` and `ar`. Spread one and add your own overrides: `{ ...es, Close: 'Salir' }`. A catalogue rebuilt with the same entries doesn't re-render the components. The non-English catalogues are machine-translated first passes awaiting review by fluent speakers.
- Strings with plural forms use `|`-separated forms in CLDR order (zero, one, two, few, many, other), picked with `Intl.PluralRules` for the locale.
- `DatePicker` and `Calendar` format dates in the translator's locale unless given their own `locale`.
