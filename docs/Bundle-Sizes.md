# Bundle Sizes

`@artisanpack-ui/vue` uses category-based entry points so you only pay for the components you import. Each entry point is a separate ESM bundle that tree-shakes independently.

## Per Entry Point

| Entry Point | Import Path | Raw | Gzipped | Components |
|-------------|-------------|-----|---------|------------|
| Form | `@artisanpack-ui/vue/form` | 102.1 KB | 14.4 KB | 15 components |
| Layout | `@artisanpack-ui/vue/layout` | 58.9 KB | 10.8 KB | 11 components |
| Navigation | `@artisanpack-ui/vue/navigation` | 43.0 KB | 7.8 KB | 7 components |
| Display | `@artisanpack-ui/vue/display` | 51.2 KB | 9.0 KB | 9 components |
| Data | `@artisanpack-ui/vue/data` | 26.6 KB | 6.1 KB | 3 components |
| Feedback | `@artisanpack-ui/vue/feedback` | 22.3 KB | 4.3 KB | 6 components |
| Utility | `@artisanpack-ui/vue/utility` | 24.0 KB | 5.7 KB | 5 components |
| Composables | `@artisanpack-ui/vue/composables` | 3.8 KB | 1.6 KB | 2 composables |
| **Full bundle** | `@artisanpack-ui/vue` | **333.9 KB** | **60.1 KB** | **56 components + 2 composables** |

Sizes measured from the `dist/` output after `npm run build` (tsup with esbuild). Gzipped sizes use standard gzip compression. Vue and peer dependencies (apexcharts, vue3-apexcharts) are externalized and not included in these sizes.

## Recommendations

- **Import by category** instead of from the main entry point to minimize bundle size:
  ```ts
  // Preferred — only loads form components (~14 KB gzipped)
  import { Button, Input, Select } from '@artisanpack-ui/vue/form';

  // Avoid — loads all components (~60 KB gzipped)
  import { Button, Input, Select } from '@artisanpack-ui/vue';
  ```

- **Composables are lightweight** at 1.6 KB gzipped — safe to import freely.

- **Data components** include the Chart component which depends on `apexcharts` and `vue3-apexcharts` as optional peer dependencies. If you don't use Chart, those dependencies won't be loaded.
