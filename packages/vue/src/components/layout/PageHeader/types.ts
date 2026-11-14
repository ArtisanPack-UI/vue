/** The parts of a PageHeader that accept extra classes. */
export type PageHeaderPart =
  | 'root'
  | 'breadcrumbs'
  | 'row'
  | 'meta'
  | 'title'
  | 'description'
  | 'actions'
  | 'tabs';

/** Props for the PageHeader component. Every text prop has a slot of the same name that overrides it. */
export interface PageHeaderProps {
  /** The page's title. */
  title?: string;
  /** Supporting text under the title. */
  description?: string;
  /** The title's heading level, 1 to 6. @defaultValue `1` */
  level?: number;
  /** Breadcrumbs above the title. */
  breadcrumbs?: string;
  /** Status above the title. */
  meta?: string;
  /** Buttons at the inline end of the title row. */
  actions?: string;
  /** Tabs under the title row. */
  tabs?: string;
  /** Extra classes per part; `classes.root` merges with `class`. */
  classes?: Partial<Record<PageHeaderPart, string>>;
}
