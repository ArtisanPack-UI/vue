// @vitest-environment node
/**
 * API parity with the design-system manifests (#41) for the Layout wave
 * (#58): Accordion, Collapse, AppShell, PageHeader, Divider, Grid and Stack.
 * Runs in Node because the kit renders on the server.
 */
import { describe, it } from 'vitest';
import {
  expectVueParity as expectParity,
  type VueParityOptions,
} from '@artisanpack-ui/testing/vue';
import {
  Accordion,
  AppShell,
  Collapse,
  Divider,
  Grid,
  PageHeader,
  Stack,
} from '../../components/layout';

type KitComponent = Parameters<typeof expectParity>[0];

/** The kit's `Component` type comes from the design-system repo's Vue; cast. */
const expectVueParity = (component: unknown, name: string, options?: VueParityOptions) =>
  expectParity(component as KitComponent, name, options);

describe('design-system parity: layout', () => {
  it('Accordion matches its manifest', () => expectVueParity(Accordion, 'Accordion'));

  // openLabel replaces the label only while open, which a closed fixture doesn't
  // render; collapse.test.ts covers it.
  it('Collapse matches its manifest', () =>
    expectVueParity(Collapse, 'Collapse', { ignoreEffects: ['openLabel'] }));

  it('AppShell matches its manifest', () => expectVueParity(AppShell, 'AppShell'));

  it('PageHeader matches its manifest', () => expectVueParity(PageHeader, 'PageHeader'));

  it('Divider matches its manifest', () => expectVueParity(Divider, 'Divider'));

  it('Grid matches its manifest', () => expectVueParity(Grid, 'Grid'));

  // direction is the deprecated spelling of orientation, kept for 1.x code.
  it('Stack matches its manifest', () =>
    expectVueParity(Stack, 'Stack', { ignoreDeclared: ['direction'] }));
});
