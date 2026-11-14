import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Sidebar } from '../../components/navigation';

const part = (name: string) =>
  document.querySelector<HTMLElement>(`[data-scope="app-shell"][data-part="${name}"]`);

describe('Sidebar (deprecated alias of AppShell)', () => {
  it('warns once in development that it is deprecated', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(Sidebar);
    render(Sidebar);
    const calls = warn.mock.calls.filter(([m]) => String(m).includes('Sidebar'));
    expect(calls).toHaveLength(1);
    expect(calls[0]![0]).toContain('Sidebar is deprecated; use AppShell.');
    warn.mockRestore();
  });

  it('renders the design-system AppShell, with no DaisyUI markup', () => {
    const { container } = render(Sidebar, {
      slots: { default: '<p>Main Content</p>', sidebar: '<nav>Sidebar Content</nav>' },
    });
    expect(container.querySelector('.apui-app-shell')).toBeTruthy();
    expect(container.querySelector('.drawer, .drawer-side, .drawer-toggle, .menu')).toBeNull();
    expect(part('sidebar')!.textContent).toContain('Sidebar Content');
    expect(part('content')!.textContent).toContain('Main Content');
    expect(screen.getByText('Main Content')).toBeTruthy();
  });

  it('maps ariaLabel to the sidebar landmark label', () => {
    render(Sidebar);
    expect(part('sidebar')!.getAttribute('aria-label')).toBe('Sidebar navigation');
    document.body.innerHTML = '';
    render(Sidebar, { props: { ariaLabel: 'Main navigation' } });
    expect(part('sidebar')!.getAttribute('aria-label')).toBe('Main navigation');
  });

  it('maps className to the frame and consumes open, side and responsive', () => {
    const { container } = render(Sidebar, {
      props: { className: 'my-frame', open: true, side: 'right', responsive: false },
    });
    const root = container.querySelector('.apui-app-shell')!;
    expect(root.classList.contains('my-frame')).toBe(true);
    for (const name of ['open', 'side', 'responsive']) {
      expect(root.hasAttribute(name)).toBe(false);
    }
  });

  it('passes AppShell props through', () => {
    const { container } = render(Sidebar, { attrs: { collapsible: true, brand: 'Apexify' } });
    expect(container.querySelector('.apui-app-shell')!.hasAttribute('data-collapsible')).toBe(true);
    expect(part('brand')!.textContent?.trim()).toBe('Apexify');
  });
});
