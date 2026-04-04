/* eslint-disable @typescript-eslint/no-unused-vars */
import 'vitest';

declare module '@vitest/expect' {
  interface Assertion<T> {
    toHaveNoViolations(): void;
  }
}
