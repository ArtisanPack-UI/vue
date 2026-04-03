/**
 * Props for the Stat component.
 *
 * Displays a statistic with label, value, description, and optional change indicator.
 */
export interface StatProps {
  /** Label text above the value. */
  title: string;
  /** The main statistic value. */
  value: string | number;
  /** Description text below the value. */
  description?: string;
  /** Change indicator text (e.g., "+12%"). */
  change?: string;
  /** Direction of change for color coding. */
  changeDirection?: 'up' | 'down' | 'neutral';
  /** Additional CSS classes. */
  className?: string;
}
