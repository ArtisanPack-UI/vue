/** @module ai/useStreamingText */

import { onScopeDispose, ref, type Ref } from 'vue';

/**
 * Result of {@link useStreamingText}.
 */
export interface UseStreamingTextResult {
  /** Accumulated text chunks received so far. */
  text: Ref<string>;
  /** True while a stream is actively being consumed. */
  streaming: Ref<boolean>;
  /** Populated when the stream ends with an error. */
  error: Ref<Error | null>;
  /**
   * Kick off a stream from the given URL. Aborts any in-flight stream first.
   * Chunks decoded from `Response.body` are appended to `text` as they arrive.
   */
  start: (url: string, init?: RequestInit) => Promise<void>;
  /** Abort the in-flight stream, if any. */
  stop: () => void;
  /** Reset accumulated text and error state. */
  reset: () => void;
}

/**
 * Consume a long-running fetch response as a UTF-8 text stream, appending
 * decoded chunks to `text` on each read.
 *
 * Wraps the browser Streams API and cleans up its abort controller when the
 * calling scope is disposed. Useful for the AI usage dashboard's long-running
 * agent output surface.
 */
export function useStreamingText(): UseStreamingTextResult {
  const text = ref('');
  const streaming = ref(false);
  const error = ref<Error | null>(null);
  let controller: AbortController | null = null;

  function stop(): void {
    controller?.abort();
    controller = null;
    streaming.value = false;
  }

  function reset(): void {
    text.value = '';
    error.value = null;
  }

  async function start(url: string, init?: RequestInit): Promise<void> {
    controller?.abort();
    const localController = new AbortController();
    controller = localController;

    text.value = '';
    error.value = null;
    streaming.value = true;

    try {
      const response = await fetch(url, { ...init, signal: localController.signal });
      if (!response.ok || !response.body) {
        throw new Error(`Stream request failed with status ${response.status}`);
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        text.value += decoder.decode(value, { stream: true });
      }
      text.value += decoder.decode();
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        error.value = err as Error;
      }
    } finally {
      if (controller === localController) {
        controller = null;
      }
      streaming.value = false;
    }
  }

  onScopeDispose(() => {
    controller?.abort();
  });

  return { text, streaming, error, start, stop, reset };
}
