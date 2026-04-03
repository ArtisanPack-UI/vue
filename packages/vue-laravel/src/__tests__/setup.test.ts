import { describe, it, expect } from 'vitest';

describe('vue-laravel package setup', () => {
  it('should have a valid module entry point', async () => {
    const mod = await import('../index');
    expect(mod).toBeDefined();
  });
});
