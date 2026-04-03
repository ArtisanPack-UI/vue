/**
 * Props for the Diff component.
 *
 * A side-by-side or inline diff viewer for comparing two pieces of content.
 */
export interface DiffProps {
  /** The original (before) content. */
  before: string;
  /** The modified (after) content. */
  after: string;
  /** Label for the before content. @defaultValue `'Before'` */
  beforeLabel?: string;
  /** Label for the after content. @defaultValue `'After'` */
  afterLabel?: string;
  /** Display mode. @defaultValue `'side-by-side'` */
  mode?: 'side-by-side' | 'inline';
  /** When true, shows line numbers. @defaultValue `true` */
  lineNumbers?: boolean;
  /** Additional CSS classes. */
  className?: string;
}
