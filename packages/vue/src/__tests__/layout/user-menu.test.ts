import { describe, it, expect } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { createSSRApp } from 'vue';
import { fireEvent, render, screen } from '@testing-library/vue';
import { DropdownMenuItem, UserMenu } from '../../components/layout';

const USER = {
  name: 'Olivia Rhye',
  email: 'olivia@company.com',
  role: 'Admin · Apexify',
  status: 'online' as const,
};
const WORKSPACES = [
  { id: 'apexify', name: 'Apexify' },
  { id: 'horizon', name: 'Horizon Homes' },
];

describe('UserMenu', () => {
  it('renders a menu button trigger with the avatar, name and role', async () => {
    const host = document.createElement('div');
    host.innerHTML = await renderToString(
      createSSRApp({ render: () => h(UserMenu, { user: USER, portal: false }) }),
    );
    const trigger = host.querySelector('button[data-scope="user-menu"][data-part="trigger"]')!;
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.querySelector('[data-part="name"]')?.textContent).toBe('Olivia Rhye');
    expect(trigger.querySelector('[data-part="role"]')?.textContent).toBe('Admin · Apexify');
    expect(trigger.querySelector('[data-part="indicator"] svg')).not.toBeNull();
    const avatar = trigger.querySelector('.apui-avatar')!;
    expect(avatar.getAttribute('aria-hidden')).toBe('true');
    expect(avatar.getAttribute('data-part')).toBe('avatar');
    expect(avatar.textContent).toBe('OR');
  });

  it('names a compact trigger after the person', () => {
    render(UserMenu, { props: { user: USER, compact: true, portal: false } });
    expect(
      screen.getByRole('button', { name: 'Olivia Rhye' }).getAttribute('data-avatar-only'),
    ).toBe('');
  });

  it('renders the header, workspaces, theme control and log out last', () => {
    render(
      defineComponent({
        render: () =>
          h(
            UserMenu,
            {
              user: USER,
              workspaces: WORKSPACES,
              workspace: 'horizon',
              theme: 'dark',
              open: true,
              portal: false,
              items: [{ value: 'profile', label: 'Profile', icon: 'user' }],
            },
            { default: () => h(DropdownMenuItem, { value: 'billing' }, () => 'Billing') },
          ),
      }),
    );
    const panel = document.querySelector('.apui-dropdown-menu.apui-user-menu')!;
    expect(panel.getAttribute('role')).toBe('menu');
    expect(panel.querySelector('[data-part="header"] [data-part="email"]')?.textContent).toBe(
      'olivia@company.com',
    );
    expect(
      screen.getByRole('menuitemradio', { name: 'Horizon Homes' }).getAttribute('aria-checked'),
    ).toBe('true');
    expect(screen.getByRole('menuitemradio', { name: 'Dark' }).getAttribute('aria-checked')).toBe(
      'true',
    );
    expect(screen.getAllByRole('menuitem').map((item) => item.textContent?.trim())).toEqual([
      'Profile',
      'Billing',
      'Log out',
    ]);
  });

  it('emits workspace-change, theme-change and select', async () => {
    const props = {
      user: USER,
      workspaces: WORKSPACES,
      workspace: 'apexify',
      open: true,
      portal: false,
      logoutLabel: 'Abmelden',
    };
    const first = render(UserMenu, { props });
    await fireEvent.click(screen.getByRole('menuitemradio', { name: 'Horizon Homes' }));
    await nextTick();
    expect(first.emitted('workspace-change')?.[0]).toEqual(['horizon']);
    first.unmount();

    const second = render(UserMenu, { props });
    await fireEvent.click(screen.getByRole('menuitemradio', { name: 'Light' }));
    await nextTick();
    expect(second.emitted('theme-change')?.[0]).toEqual(['light']);
    expect(second.emitted('select')).toBeUndefined();
    second.unmount();

    const third = render(UserMenu, { props });
    await fireEvent.click(screen.getByRole('menuitem', { name: 'Abmelden' }));
    await nextTick();
    expect(third.emitted('select')?.[0]).toEqual(['logout']);
  });

  it('leaves out one workspace and a hidden theme control', () => {
    render(UserMenu, {
      props: {
        user: USER,
        workspaces: [WORKSPACES[0]!],
        hideTheme: true,
        open: true,
        portal: false,
      },
    });
    expect(screen.queryAllByRole('menuitemradio')).toHaveLength(0);
    expect(document.querySelector('[data-part="theme"]')).toBeNull();
  });
});
