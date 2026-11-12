// @vitest-environment node
/**
 * DatePicker (#55) API parity with its design-system manifest. Runs in Node
 * because the kit renders on the server. Behavior is in form/datepicker.test.ts.
 */
import { describe, it } from 'vitest';
import { expectVueParity as expectParity } from '@artisanpack-ui/testing/vue';
import { DatePicker } from '../../components/form';

type KitComponent = Parameters<typeof expectParity>[0];

describe('design-system parity', () => {
  // These only show in time mode, with a real date, or once the calendar is used.
  it('DatePicker matches its manifest', () =>
    expectParity(DatePicker as unknown as KitComponent, 'DatePicker', {
      ignoreEffects: [
        'step',
        'timeZone',
        'min',
        'max',
        'disabledDates',
        'format',
        'timeLabel',
        'endLabel',
        'timeZoneLabel',
      ],
    }));
});
