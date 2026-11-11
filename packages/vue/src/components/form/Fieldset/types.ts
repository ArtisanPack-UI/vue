/** The look of a Fieldset. Emitted as `data-variant`. */
export type FieldsetVariant = 'panel' | 'divided' | 'plain';

/** The parts of a Fieldset that accept extra classes. */
export type FieldsetPart = 'root' | 'legend' | 'title' | 'description';

/**
 * Props for the Fieldset component (design-system manifest `Fieldset`, #53).
 *
 * A native `<fieldset>` whose legend holds the title and description. The
 * `title` and `description` slots override the props. Attributes land on the
 * fieldset. Fields side by side go in `<div data-scope="fieldset" data-part="row">`.
 */
export interface FieldsetProps {
  /** A bordered panel, a section with an edge under it, or no chrome. @defaultValue `'panel'` */
  variant?: FieldsetVariant;
  /** The group's name, in the legend. */
  title?: string;
  /** Supporting text in the legend, under the title. */
  description?: string;
  /** Disables every control inside (native `disabled`). @defaultValue `false` */
  disabled?: boolean;
  /** Extra classes per part, such as `{ legend: '…', title: '…' }`. */
  classes?: Partial<Record<FieldsetPart, string>>;
}
