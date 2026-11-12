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
export { default as AvatarGroup } from './Avatar/AvatarGroup.vue';
export { avatarColor, avatarInitials } from './Avatar/identity';
export type {
  AvatarProps,
  AvatarGroupProps,
  AvatarGroupItem,
  AvatarColor,
  AvatarSize,
  AvatarShape,
  AvatarStatus,
  AvatarPart,
} from './Avatar/types';

export { default as Badge } from './Badge/Badge.vue';
export type { BadgeProps, BadgeVariant, BadgeColor, BadgeSize, BadgePart } from './Badge/types';

export { default as Progress } from './Progress/Progress.vue';
export type { ProgressProps, ProgressColor, ProgressPart } from './Progress/types';

export { default as ProgressRadial } from './ProgressRadial/ProgressRadial.vue';
export type { ProgressRadialProps, ProgressRadialPart } from './ProgressRadial/types';

export { default as Stat } from './Stat/Stat.vue';
export type { StatProps, StatColor, StatPart, StatSize, StatTrend } from './Stat/types';

export { default as KpiCard } from './KpiCard/KpiCard.vue';
export type { KpiCardProps, KpiCardPart, KpiCardStat, KpiCardTarget } from './KpiCard/types';

export { default as Timeline } from './Timeline/Timeline.vue';
export { default as TimelineItem } from './Timeline/TimelineItem.vue';
export type {
  TimelineProps,
  TimelineItemProps,
  TimelineItemData,
  TimelineColor,
  TimelinePart,
  TimelineVariant,
} from './Timeline/types';

export { default as Code } from './Code/Code.vue';
export type { CodeProps, CodePart } from './Code/types';

export { default as Carousel } from './Carousel/Carousel.vue';
export type { CarouselProps, CarouselSlide, CarouselPart } from './Carousel/types';

export { default as Diff } from './Diff/Diff.vue';
export type { DiffProps, DiffPart, DiffView } from './Diff/types';

export { default as Sparkline } from './Sparkline/Sparkline.vue';
export type { SparklineProps, SparklinePart, SparklineVariant } from './Sparkline/types';

export { default as ImageGallery } from './ImageGallery/ImageGallery.vue';
export type { ImageGalleryProps, ImageGalleryImage, ImageGalleryPart } from './ImageGallery/types';

export { default as ImageSlider } from './ImageSlider/ImageSlider.vue';
export type { ImageSliderProps, ImageSliderImage, ImageSliderPart } from './ImageSlider/types';
