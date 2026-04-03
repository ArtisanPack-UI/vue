/**
 * @module display
 *
 * Display components for the ArtisanPack UI Vue component library.
 * Provides presentational components for avatars, badges, progress indicators,
 * statistics, timelines, code blocks, carousels, and diff viewers.
 *
 * @example
 * ```vue
 * import { Avatar, Badge, Progress, Stat, Timeline, Code, Carousel, Diff, Sparkline } from '@artisanpack-ui/vue';
 * ```
 */

export { default as Avatar } from './Avatar/Avatar.vue';
export type { AvatarProps } from './Avatar/types';

export { default as Badge } from './Badge/Badge.vue';
export type { BadgeProps } from './Badge/types';

export { default as Progress } from './Progress/Progress.vue';
export type { ProgressProps } from './Progress/types';

export { default as Stat } from './Stat/Stat.vue';
export type { StatProps } from './Stat/types';

export { default as Timeline } from './Timeline/Timeline.vue';
export type { TimelineProps, TimelineItem } from './Timeline/types';

export { default as Code } from './Code/Code.vue';
export type { CodeProps } from './Code/types';

export { default as Carousel } from './Carousel/Carousel.vue';
export type { CarouselProps, CarouselSlide } from './Carousel/types';

export { default as Diff } from './Diff/Diff.vue';
export type { DiffProps } from './Diff/types';

export { default as Sparkline } from './Sparkline/Sparkline.vue';
export type { SparklineProps } from './Sparkline/types';
