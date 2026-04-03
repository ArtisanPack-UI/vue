/**
 * Props for the Markdown component.
 *
 * Renders markdown content as HTML using DaisyUI's prose typography classes.
 * Supports basic markdown syntax including headings, bold, italic, links,
 * lists, code blocks, blockquotes, horizontal rules, and images.
 */
export interface MarkdownProps {
  /** The raw markdown string to render. */
  content: string;
  /** Additional CSS classes applied to the prose container. */
  className?: string;
}
