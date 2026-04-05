import { describe, it, expect } from 'vitest';

describe('vue package setup', () => {
  it('should have a valid module entry point', async () => {
    const mod = await import('../index');
    expect(mod).toBeDefined();
  });

  it('should export composables', async () => {
    const mod = await import('../index');
    expect(mod.provideTheme).toBeDefined();
    expect(typeof mod.provideTheme).toBe('function');
    expect(mod.useTheme).toBeDefined();
    expect(typeof mod.useTheme).toBe('function');
    expect(mod.useBreakpoint).toBeDefined();
    expect(typeof mod.useBreakpoint).toBe('function');
  });

  it('should export the plugin factory', async () => {
    const mod = await import('../index');
    expect(mod.createArtisanPackUI).toBeDefined();
    expect(typeof mod.createArtisanPackUI).toBe('function');
  });

  it('should export ThemeKey injection key', async () => {
    const mod = await import('../index');
    expect(mod.ThemeKey).toBeDefined();
    expect(typeof mod.ThemeKey).toBe('symbol');
  });
});
