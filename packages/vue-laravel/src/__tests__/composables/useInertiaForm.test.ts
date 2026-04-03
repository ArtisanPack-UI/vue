import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock @inertiajs/vue3
const mockFormInstance = {
  processing: false,
  recentlySuccessful: false,
  isDirty: false,
  errors: {} as Record<string, string>,
  reset: vi.fn(),
  clearErrors: vi.fn(),
  submit: vi.fn(),
};

vi.mock('@inertiajs/vue3', () => ({
  useForm: vi.fn((data: Record<string, unknown>) => {
    Object.assign(mockFormInstance, { ...data });
    return mockFormInstance;
  }),
}));

import { useInertiaForm } from '../../composables/useInertiaForm';

describe('useInertiaForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFormInstance.errors = {};
    mockFormInstance.processing = false;
    mockFormInstance.recentlySuccessful = false;
    mockFormInstance.isDirty = false;
  });

  it('creates a form with initial data', () => {
    const { form } = useInertiaForm({ name: '', email: '' });
    expect(form).toBeDefined();
    expect(form.name).toBe('');
    expect(form.email).toBe('');
  });

  it('returns getError that reads form.errors', () => {
    const { getError } = useInertiaForm({ name: '' });
    mockFormInstance.errors = { name: 'Name is required' };
    expect(getError('name')).toBe('Name is required');
  });

  it('returns undefined for fields without errors', () => {
    const { getError } = useInertiaForm({ name: '' });
    mockFormInstance.errors = {};
    expect(getError('name')).toBeUndefined();
  });

  it('calls form.clearErrors when clearErrors is called', () => {
    const { clearErrors } = useInertiaForm({ name: '' });
    clearErrors('name');
    expect(mockFormInstance.clearErrors).toHaveBeenCalledWith('name');
  });

  it('calls form.clearErrors with no args to clear all', () => {
    const { clearErrors } = useInertiaForm({ name: '' });
    clearErrors();
    expect(mockFormInstance.clearErrors).toHaveBeenCalledWith();
  });

  it('calls form.reset when reset is called', () => {
    const { reset } = useInertiaForm({ name: '' });
    reset();
    expect(mockFormInstance.reset).toHaveBeenCalledWith();
  });

  it('submit calls form.submit with the given method and url', () => {
    const { submit } = useInertiaForm({ name: '' });
    submit('post', '/users');
    expect(mockFormInstance.submit).toHaveBeenCalledWith('post', '/users', expect.any(Object));
  });

  it('post shorthand calls submit with post method', () => {
    const { post } = useInertiaForm({ name: '' });
    post('/users');
    expect(mockFormInstance.submit).toHaveBeenCalledWith('post', '/users', expect.any(Object));
  });

  it('put shorthand calls submit with put method', () => {
    const { put } = useInertiaForm({ name: '' });
    put('/users/1');
    expect(mockFormInstance.submit).toHaveBeenCalledWith('put', '/users/1', expect.any(Object));
  });

  it('patch shorthand calls submit with patch method', () => {
    const { patch } = useInertiaForm({ name: '' });
    patch('/users/1');
    expect(mockFormInstance.submit).toHaveBeenCalledWith('patch', '/users/1', expect.any(Object));
  });

  it('destroy shorthand calls submit with delete method', () => {
    const { destroy } = useInertiaForm({ name: '' });
    destroy('/users/1');
    expect(mockFormInstance.submit).toHaveBeenCalledWith('delete', '/users/1', expect.any(Object));
  });

  it('resetOnSuccess option resets form on success callback', () => {
    const { submit } = useInertiaForm({ name: '' }, { resetOnSuccess: true });
    submit('post', '/users');

    const submitOptions = mockFormInstance.submit.mock.calls[0][2] as Record<string, unknown>;
    expect(submitOptions.onSuccess).toBeDefined();

    (submitOptions.onSuccess as () => void)();
    expect(mockFormInstance.reset).toHaveBeenCalled();
  });

  it('resetOnSuccess false does not add reset to onSuccess', () => {
    const { submit } = useInertiaForm({ name: '' }, { resetOnSuccess: false });
    submit('post', '/users');

    const submitOptions = mockFormInstance.submit.mock.calls[0][2] as Record<string, unknown>;
    expect(submitOptions.onSuccess).toBeUndefined();
  });

  it('resetOnSuccess preserves existing onSuccess and calls it before reset', () => {
    const callOrder: string[] = [];
    const existingOnSuccess = vi.fn(() => callOrder.push('userCallback'));
    mockFormInstance.reset.mockImplementation(() => callOrder.push('reset'));

    const { submit } = useInertiaForm({ name: '' }, { resetOnSuccess: true });
    submit('post', '/users', { onSuccess: existingOnSuccess });

    const submitOptions = mockFormInstance.submit.mock.calls[0][2] as Record<string, unknown>;
    (submitOptions.onSuccess as () => void)();

    expect(existingOnSuccess).toHaveBeenCalled();
    expect(mockFormInstance.reset).toHaveBeenCalled();
    expect(callOrder).toEqual(['userCallback', 'reset']);
  });
});
