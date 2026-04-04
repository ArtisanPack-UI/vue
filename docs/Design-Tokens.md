# Design Tokens

ArtisanPack UI uses a shared `@artisanpack-ui/tokens` package to define framework-agnostic types that ensure consistency across the component library.

## Shared Types

### DaisyColor

The set of DaisyUI semantic color names available to component `color` props:

```ts
type DaisyColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';
```

Used by: Button, Checkbox, Toggle, Radio, Range, Pin, Badge, Alert, Progress, and others.

### Size

Standard size scale for components:

```ts
type Size = 'xs' | 'sm' | 'md' | 'lg';
```

Used by: Button, Avatar, Badge, Loading, and others.

### ColorScheme

Theme mode preference:

```ts
type ColorScheme = 'light' | 'dark' | 'system';
```

Used by: `createArtisanPackUI()` plugin options and `provideTheme()` / `useTheme()` composables.

### FormFieldProps

Common props shared across form components:

```ts
interface FormFieldProps {
  label?: string;
  hint?: string;
  error?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
}
```

Most form components (Input, Select, Textarea, etc.) extend this base set of props.

### GlassProps

Props for glass morphism styling:

```ts
interface GlassProps {
  glass?: boolean;
}
```

Used by: Card.

### ColorProps

Props for color variants:

```ts
interface ColorProps {
  color?: DaisyColor;
}
```

## Importing Types

Import types directly from `@artisanpack-ui/vue`:

```ts
import type { DaisyColor, Size, ColorScheme } from '@artisanpack-ui/vue';
```

Or from the tokens package if building a separate integration:

```ts
import type { DaisyColor, Size, FormFieldProps } from '@artisanpack-ui/tokens';
```
