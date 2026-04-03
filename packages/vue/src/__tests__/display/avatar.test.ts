import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Avatar } from '../../components/display';

describe('Avatar', () => {
  it('renders with an image when src is provided', () => {
    const { container } = render(Avatar, {
      props: { src: '/photo.jpg', alt: 'User photo' },
    });
    const img = container.querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe('/photo.jpg');
    expect(img?.getAttribute('alt')).toBe('User photo');
  });

  it('renders initials when no src is provided', () => {
    render(Avatar, { props: { initials: 'JM' } });
    expect(screen.getByText('JM')).toBeTruthy();
  });

  it('renders slot content when no src or initials provided', () => {
    render(Avatar, { slots: { default: '?' } });
    expect(screen.getByText('?')).toBeTruthy();
  });

  it('applies circle shape by default', () => {
    const { container } = render(Avatar, { props: { initials: 'A' } });
    expect(container.querySelector('.rounded-full')).toBeTruthy();
  });

  it('applies squircle mask', () => {
    const { container } = render(Avatar, {
      props: { initials: 'A', shape: 'squircle' },
    });
    expect(container.querySelector('.mask-squircle')).toBeTruthy();
  });

  it('applies online indicator', () => {
    const { container } = render(Avatar, {
      props: { initials: 'A', online: true },
    });
    expect(container.querySelector('.avatar-online')).toBeTruthy();
  });

  it('applies offline indicator', () => {
    const { container } = render(Avatar, {
      props: { initials: 'A', offline: true },
    });
    expect(container.querySelector('.avatar-offline')).toBeTruthy();
  });

  it('applies placeholder class for initials', () => {
    const { container } = render(Avatar, { props: { initials: 'A' } });
    expect(container.querySelector('.avatar-placeholder')).toBeTruthy();
  });

  it('applies size class', () => {
    const { container } = render(Avatar, {
      props: { initials: 'A', size: 'lg' },
    });
    expect(container.querySelector('.w-24')).toBeTruthy();
  });

  it('has correct ARIA role', () => {
    const { container } = render(Avatar, { props: { alt: 'User' } });
    expect(container.querySelector('[role="img"]')).toBeTruthy();
  });

  it('uses alt as aria-label', () => {
    const { container } = render(Avatar, { props: { alt: 'User photo' } });
    expect(container.querySelector('[aria-label="User photo"]')).toBeTruthy();
  });
});
