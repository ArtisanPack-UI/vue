// @vitest-environment node
/**
 * API parity with the design-system manifests (#41) for #58 and #61:
 * Heading, Text, ListItem, UserMenu, Avatar and Badge. Runs in Node because
 * the kit renders on the server.
 */
import { describe, it } from 'vitest';
import {
  expectVueParity as expectParity,
  type VueParityOptions,
} from '@artisanpack-ui/testing/vue';
import { Avatar, Badge } from '../../components/display';
import { Heading, ListItem, Text, UserMenu } from '../../components/layout';

type KitComponent = Parameters<typeof expectParity>[0];

/** The kit's `Component` type comes from the design-system repo's Vue; cast. */
const expectVueParity = (component: unknown, name: string, options?: VueParityOptions) =>
  expectParity(component as KitComponent, name, options);

describe('design-system parity: typography, list, user menu, avatar, badge', () => {
  it('Heading matches its manifest', () => expectVueParity(Heading, 'Heading'));
  it('Text matches its manifest', () => expectVueParity(Text, 'Text'));
  it('ListItem matches its manifest', () => expectVueParity(ListItem, 'ListItem'));
  it('UserMenu matches its manifest', () => expectVueParity(UserMenu, 'UserMenu'));
  it('Avatar matches its manifest', () => expectVueParity(Avatar, 'Avatar'));
  it('Badge matches its manifest', () => expectVueParity(Badge, 'Badge'));
});
