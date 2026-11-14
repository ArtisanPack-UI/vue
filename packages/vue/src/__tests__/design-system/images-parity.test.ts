// @vitest-environment node
/**
 * ImageGallery and ImageSlider (#61) API parity with their design-system
 * manifests. Runs in Node because the kit renders on the server. Behavior is
 * in display/image-gallery.test.ts and display/image-slider.test.ts.
 */
import { describe, it } from 'vitest';
import { expectVueParity } from '@artisanpack-ui/testing/vue';
import { ImageGallery, ImageSlider } from '../../components/display';

type KitComponent = Parameters<typeof expectVueParity>[0];

describe('design-system parity', () => {
  // downloadLabel only shows with downloadable, which the fixture keeps for the parts render.
  it('ImageGallery matches its manifest', () =>
    expectVueParity(ImageGallery as unknown as KitComponent, 'ImageGallery', {
      ignoreEffects: ['downloadLabel'],
    }));

  // interval, playLabel and pauseLabel only show with autoplay running in a
  // browser; covered in display/image-slider.test.ts.
  it('ImageSlider matches its manifest', () =>
    expectVueParity(ImageSlider as unknown as KitComponent, 'ImageSlider', {
      ignoreEffects: ['interval', 'playLabel', 'pauseLabel'],
    }));
});
