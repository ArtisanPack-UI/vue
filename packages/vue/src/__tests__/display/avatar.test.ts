import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Avatar, AvatarGroup, avatarColor, avatarInitials } from '../../components/display';

describe('Avatar', () => {
  it('renders initials as role=img named after the person', () => {
    const { container } = render(Avatar, { props: { name: 'Olivia Rhye' } });
    const root = screen.getByRole('img', { name: 'Olivia Rhye' });
    expect(root.classList.contains('apui-avatar')).toBe(true);
    expect(root.getAttribute('data-size')).toBe('md');
    expect(root.getAttribute('data-shape')).toBe('circle');
    expect(container.querySelector('[data-part="initials"]')?.textContent).toBe('OR');
  });

  it('takes initials from the first and last word, keeping multibyte letters', () => {
    expect(avatarInitials('Olivia Rhye')).toBe('OR');
    expect(avatarInitials('  Ana María de la Peña ')).toBe('AP');
    expect(avatarInitials('émile')).toBe('É');
    expect(avatarInitials('')).toBe('');
  });

  it('hashes the color from the name, the same way as Livewire and React', () => {
    // Code points of "Olivia Rhye" sum to 1052; 1052 % 7 = 2 → accent.
    expect(avatarColor('Olivia Rhye')).toBe('accent');
    expect(avatarColor('')).toBe('neutral');
    render(Avatar, { props: { name: 'Olivia Rhye', color: 'info' } });
    expect(screen.getByRole('img').getAttribute('data-color')).toBe('info');
  });

  it('puts a decorative image over the initials, and drops unsafe sources', () => {
    const { container } = render(Avatar, { props: { name: 'Olivia Rhye', src: '/a.jpg' } });
    const image = container.querySelector('img[data-part="image"]')!;
    expect(image.getAttribute('src')).toBe('/a.jpg');
    expect(image.getAttribute('alt')).toBe('');
    expect(container.querySelector('[data-part="initials"]')).not.toBeNull();

    const unsafe = render(Avatar, { props: { name: 'X', src: 'javascript:alert(1)' } });
    expect(unsafe.container.querySelector('img')).toBeNull();
  });

  it('is decorative with the user icon without a name', () => {
    const { container } = render(Avatar);
    const root = container.querySelector('.apui-avatar')!;
    expect(root.getAttribute('aria-hidden')).toBe('true');
    expect(root.hasAttribute('role')).toBe(false);
    expect(root.getAttribute('data-color')).toBe('neutral');
    expect(root.querySelector(':scope > svg')).not.toBeNull();
  });

  it('announces the status in words', () => {
    const { container } = render(Avatar, { props: { name: 'Olivia Rhye', status: 'away' } });
    expect(screen.getByRole('img', { name: 'Olivia Rhye (Away)' })).toBeTruthy();
    expect(container.querySelector('[data-part="status"]')?.getAttribute('data-status')).toBe(
      'away',
    );
    render(Avatar, { props: { name: 'Ana', status: 'online', statusLabel: 'En línea' } });
    expect(screen.getByRole('img', { name: 'Ana (En línea)' })).toBeTruthy();
  });

  it('groups avatars and collapses the rest past max', () => {
    const { container } = render(AvatarGroup, {
      props: {
        label: 'Members',
        max: 2,
        size: 'sm',
        avatars: [
          { name: 'Olivia Rhye' },
          { name: 'Phoenix Baker' },
          { name: 'Lana Steiner' },
          { name: 'Demi Wilkinson' },
        ],
      },
    });
    expect(
      screen.getByRole('group', { name: 'Members' }).classList.contains('apui-avatar-group'),
    ).toBe(true);
    expect(container.querySelectorAll('.apui-avatar[data-size="sm"]')).toHaveLength(3);
    expect(screen.getByRole('img', { name: '2 more' }).textContent).toBe('+2');
  });
});
