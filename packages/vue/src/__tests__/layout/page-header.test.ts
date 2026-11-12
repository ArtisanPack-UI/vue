import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { PageHeader } from '../../components/layout';

const part = (name: string) =>
  document.querySelector<HTMLElement>(`[data-scope="page-header"][data-part="${name}"]`);

describe('PageHeader', () => {
  it('renders the title as h1 with the description and regions', () => {
    render(PageHeader, {
      props: { title: 'Dashboard', description: 'All stores.', meta: 'Draft', actions: 'Share' },
      slots: { breadcrumbs: 'Home / Dashboard', tabs: 'Overview' },
    });
    expect(document.querySelector('.apui-page-header')).not.toBeNull();
    expect(part('title')!.tagName).toBe('H1');
    expect(part('title')!.textContent?.trim()).toBe('Dashboard');
    expect(part('description')!.tagName).toBe('P');
    expect(part('meta')!.textContent?.trim()).toBe('Draft');
    expect(part('actions')!.textContent?.trim()).toBe('Share');
    expect(part('breadcrumbs')!.textContent?.trim()).toBe('Home / Dashboard');
    expect(part('tabs')!.textContent?.trim()).toBe('Overview');
    expect(part('row')!.contains(part('actions'))).toBe(true);
  });

  it('takes level, and leaves out empty regions', () => {
    render(PageHeader, { props: { title: 'Section', level: 2 } });
    expect(part('title')!.tagName).toBe('H2');
    expect(part('description')).toBeNull();
    expect(part('actions')).toBeNull();
    expect(part('tabs')).toBeNull();
  });
});
