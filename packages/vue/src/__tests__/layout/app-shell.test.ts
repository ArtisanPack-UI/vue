import { describe, it, expect } from 'vitest';
import { fireEvent, render } from '@testing-library/vue';
import { AppShell } from '../../components/layout';

const part = (name: string) =>
  document.querySelector<HTMLElement>(`[data-scope="app-shell"][data-part="${name}"]`);

describe('AppShell', () => {
  it('renders the frame: skip link, sidebar, main and content', () => {
    render(AppShell, {
      props: { brand: 'Apexify', header: 'Top bar' },
      slots: { sidebar: '<nav>Navigation</nav>', default: 'Page content' },
    });
    const root = document.querySelector('.apui-app-shell')!;
    expect(root.hasAttribute('data-collapsed')).toBe(false);
    const main = part('main')!;
    expect(main.tagName).toBe('MAIN');
    expect(main.getAttribute('tabindex')).toBe('-1');
    expect(part('skip-link')!.getAttribute('href')).toBe(`#${main.id}`);
    expect(part('skip-link')!.textContent).toBe('Skip to main content');
    expect(part('sidebar')!.tagName).toBe('ASIDE');
    expect(part('sidebar')!.getAttribute('aria-label')).toBe('Sidebar');
    expect(part('brand')!.textContent?.trim()).toBe('Apexify');
    expect(part('sidebar')!.querySelector('nav')).not.toBeNull();
    expect(main.textContent).toContain('Top bar');
    expect(part('content')!.textContent).toBe('Page content');
    expect(part('footer')).toBeNull();
  });

  it('collapses from the trigger and emits collapsed-change', async () => {
    const { emitted } = render(AppShell, { props: { collapsible: true, footer: 'Olivia' } });
    const root = document.querySelector('.apui-app-shell')!;
    expect(root.hasAttribute('data-collapsible')).toBe(true);
    const trigger = part('collapse-trigger')!;
    expect(trigger.getAttribute('aria-label')).toBe('Collapse sidebar');
    expect(trigger.getAttribute('aria-pressed')).toBe('false');
    expect(trigger.getAttribute('aria-controls')).toBe(part('sidebar')!.id);
    await fireEvent.click(trigger);
    expect(root.hasAttribute('data-collapsed')).toBe(true);
    expect(trigger.getAttribute('aria-pressed')).toBe('true');
    expect(emitted()['collapsed-change']).toEqual([[true]]);
  });

  it('follows collapsed and sets the width and gutter tokens', async () => {
    const { rerender } = render(AppShell, { props: { sidebarWidth: '280px', gutter: '8px' } });
    const root = document.querySelector<HTMLElement>('.apui-app-shell')!;
    expect(root.style.getPropertyValue('--apui-sidebar-width')).toBe('280px');
    expect(root.style.getPropertyValue('--apui-shell-gutter')).toBe('8px');
    await rerender({ collapsed: true });
    expect(root.hasAttribute('data-collapsed')).toBe(true);
  });

  it('translates its labels through props', () => {
    render(AppShell, {
      props: {
        label: 'Barre',
        skipLabel: 'Aller au contenu',
        collapseLabel: 'Réduire',
        collapsible: true,
      },
    });
    expect(part('sidebar')!.getAttribute('aria-label')).toBe('Barre');
    expect(part('skip-link')!.textContent).toBe('Aller au contenu');
    expect(part('collapse-trigger')!.getAttribute('aria-label')).toBe('Réduire');
  });
});
