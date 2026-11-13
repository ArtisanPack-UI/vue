import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { File as FileUpload, FileUpload as DeprecatedFileUpload } from '../../components/form';

describe('File', () => {
  it('keeps FileUpload as a deprecated alias', () => {
    expect(DeprecatedFileUpload).toBe(FileUpload);
  });

  it('puts the native input over the drop zone', () => {
    const { container } = render(FileUpload, {
      props: {
        label: 'Photos',
        hint: 'JPG only',
        multiple: true,
        accept: 'image/*',
        maxSize: 1000,
      },
      attrs: { id: 'f' },
    });
    const input = screen.getByLabelText('Photos') as HTMLInputElement;
    expect(input.type).toBe('file');
    expect(input.parentElement!.getAttribute('data-part')).toBe('dropzone');
    expect(input.multiple).toBe(true);
    expect(input.getAttribute('accept')).toBe('image/*');
    expect(input.getAttribute('aria-describedby')).toBe('f-hint');
    expect(container.querySelector('.apui-file')!.getAttribute('data-max-size')).toBe('1000');
    expect(container.querySelector('[data-part="title"]')!.textContent).toBe(
      'Drop files here or browse',
    );
  });

  it('names the input by the title without a label', () => {
    render(FileUpload, { props: { title: 'Upload a contract' } });
    expect(screen.getByLabelText('Upload a contract').getAttribute('type')).toBe('file');
  });

  it('lists chosen files and removes one', async () => {
    const { container, emitted } = render(FileUpload, { props: { label: 'Docs', multiple: true } });
    const a = new globalThis.File(['x'.repeat(2400)], 'a.pdf', { type: 'application/pdf' });
    const b = new globalThis.File(['y'], 'b.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText('Docs') as HTMLInputElement;
    Object.defineProperty(input, 'files', { value: [a, b], configurable: true });
    await fireEvent.change(input);
    expect(emitted()['update:modelValue']![0]).toEqual([[a, b]]);
    expect(container.querySelectorAll('[data-part="item"]')).toHaveLength(2);
    expect(container.querySelector('[data-part="meta"]')!.textContent!.trim()).toBe('2.4 KB');
    Object.defineProperty(input, 'files', { value: [a, b], writable: true, configurable: true });
    await fireEvent.click(screen.getByRole('button', { name: 'Remove a.pdf' }));
    expect(emitted().remove![0]).toEqual([a, 0]);
    expect(emitted()['update:modelValue']![1]).toEqual([[b]]);
  });

  it('shows progress and errors from v-model entries', () => {
    const { container } = render(FileUpload, {
      props: {
        modelValue: [
          { name: 'up.jpg', size: 1000, progress: 64 },
          { name: 'bad.heic', error: 'Not supported.' },
        ],
        removeLabel: 'Quitar :name',
      },
    });
    const items = container.querySelectorAll('[data-part="item"]');
    expect(items[0]!.querySelector('progress')!.getAttribute('value')).toBe('64');
    expect(items[1]!.getAttribute('data-state')).toBe('error');
    expect(items[1]!.querySelector('[data-part="meta"]')!.textContent).toContain('Not supported.');
    expect(screen.getByRole('button', { name: 'Quitar up.jpg' })).toBeTruthy();
  });

  it('sets the drag state while files are over the zone', async () => {
    const { container } = render(FileUpload, { props: { label: 'Docs' } });
    const zone = container.querySelector('[data-part="dropzone"]')!;
    await fireEvent.dragEnter(zone);
    expect(zone.getAttribute('data-state')).toBe('drag');
    await fireEvent.dragLeave(zone);
    expect(zone.hasAttribute('data-state')).toBe(false);
  });
});
