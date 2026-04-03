import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { FileUpload } from '../../components/form';

describe('FileUpload', () => {
  it('renders with label', () => {
    render(FileUpload, { props: { label: 'Upload' } });
    expect(screen.getByText('Upload')).toBeTruthy();
  });

  it('renders a file input by default', () => {
    render(FileUpload);
    const input = document.querySelector('input[type="file"]');
    expect(input).toBeTruthy();
  });

  it('renders drag-and-drop zone when withDragDrop is true', () => {
    render(FileUpload, { props: { withDragDrop: true } });
    expect(screen.getByText('Drop files here or click to browse')).toBeTruthy();
  });

  it('renders custom drag-drop text', () => {
    render(FileUpload, { props: { withDragDrop: true, dragDropText: 'Custom text' } });
    expect(screen.getByText('Custom text')).toBeTruthy();
  });

  it('shows required indicator', () => {
    render(FileUpload, { props: { label: 'Required', required: true } });
    expect(screen.getByText('*')).toBeTruthy();
  });

  it('shows hint text', () => {
    render(FileUpload, { props: { hint: 'Max 5MB' } });
    expect(screen.getByText('Max 5MB')).toBeTruthy();
  });

  it('shows error and hides hint', () => {
    render(FileUpload, { props: { hint: 'Help', error: 'File too large' } });
    expect(screen.getByText('File too large')).toBeTruthy();
    expect(screen.queryByText('Help')).toBeNull();
  });

  it('shows progress bar when progress > 0', () => {
    render(FileUpload, { props: { progress: 50 } });
    const progress = document.querySelector('progress');
    expect(progress).toBeTruthy();
    expect(progress?.getAttribute('value')).toBe('50');
  });

  it('hides progress bar when hideProgress is true', () => {
    render(FileUpload, { props: { progress: 50, hideProgress: true } });
    expect(document.querySelector('progress')).toBeNull();
  });

  it('applies file-input-error class on error', () => {
    render(FileUpload, { props: { error: 'Error' } });
    const input = document.querySelector('input[type="file"]');
    expect(input?.classList.contains('file-input-error')).toBe(true);
  });

  it('drag-and-drop zone has keyboard accessibility', () => {
    render(FileUpload, { props: { withDragDrop: true } });
    const dropZone = screen.getByRole('button');
    expect(dropZone.getAttribute('tabindex')).toBe('0');
  });
});
