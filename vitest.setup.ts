import '@testing-library/jest-dom';
import { expect, beforeAll, afterEach, afterAll, vi } from 'vitest';
import { setupServer } from 'msw/node';
import * as matchers from 'vitest-axe/matchers';

// Tambahkan custom matchers untuk pengujian aksesibilitas (axe)
expect.extend(matchers);

// Konfigurasi Mock Service Worker (MSW) untuk intercept request API global
export const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});
afterAll(() => server.close());
