import { vi } from 'vitest';
import type { AiApiClient } from '../../components/ai/types';

export function createMockClient(overrides: Partial<AiApiClient> = {}): AiApiClient {
  return {
    getSettings: vi.fn(),
    updateSettings: vi.fn(),
    testConnection: vi.fn(),
    getFeatures: vi.fn(),
    toggleFeature: vi.fn(),
    getUsage: vi.fn(),
    ...overrides,
  } as AiApiClient;
}
