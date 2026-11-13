/** The parts of a Form that accept extra classes. */
export type FormPart = 'root' | 'actions';

/**
 * Props for the Form component (design-system manifest `Form`, #53).
 *
 * A native `<form>`: attributes and listeners (`@submit`, `action`,
 * `novalidate`, `aria-label`) land on it. The `actions` slot overrides the
 * `actions` prop.
 */
export interface FormProps {
  /** Text for the actions row; use the `actions` slot for buttons. */
  actions?: string;
  /** Separates the actions row with an edge above it. @defaultValue `false` */
  divided?: boolean;
  /** Extra classes per part, such as `{ actions: '…' }`. */
  classes?: Partial<Record<FormPart, string>>;
}
