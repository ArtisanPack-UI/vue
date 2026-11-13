import { afterEach, describe, it, expect, vi } from 'vitest';
import { effectScope, type EffectScope } from 'vue';
import { useStreamingText } from '../../components/ai/useStreamingText';
import { deferred } from './testClient';

/** A Response whose body yields the given chunks, each read settled by the test. */
function scriptedResponse(chunks: Promise<Uint8Array | null>[]): Response {
  let index = 0;
  const body = new ReadableStream<Uint8Array>({
    async pull(controller) {
      const next = await chunks[index++];
      if (next === null || next === undefined) {
        controller.close();
      } else {
        controller.enqueue(next);
      }
    },
  });
  return new Response(body);
}

const flush = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

let scope: EffectScope | undefined;

function setup(): ReturnType<typeof useStreamingText> {
  scope = effectScope();
  return scope.run(() => useStreamingText())!;
}

describe('useStreamingText', () => {
  afterEach(() => {
    scope?.stop();
    scope = undefined;
    vi.unstubAllGlobals();
  });

  it('decodes a character split across chunks', async () => {
    const bytes = new TextEncoder().encode('héllo €');
    const parts = [bytes.slice(0, 2), bytes.slice(2, 7), bytes.slice(7)];
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => scriptedResponse([...parts, null].map((part) => Promise.resolve(part)))),
    );

    const { text, streaming, start } = setup();
    await start('/stream');

    expect(text.value).toBe('héllo €');
    expect(streaming.value).toBe(false);
  });

  it('ignores chunks and errors from a stream that a newer start() replaced', async () => {
    const staleRead = deferred<Uint8Array | null>();
    const encoder = new TextEncoder();
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(scriptedResponse([staleRead.promise]))
        .mockResolvedValueOnce(
          scriptedResponse([Promise.resolve(encoder.encode('fresh')), Promise.resolve(null)]),
        ),
    );

    const { text, error, start } = setup();
    const first = start('/a');
    await flush();
    await start('/b');
    staleRead.resolve(encoder.encode('stale'));
    await first;

    expect(text.value).toBe('fresh');
    expect(error.value).toBeNull();
  });

  it("aborts the request when the caller's signal is already aborted", async () => {
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      if (init?.signal?.aborted) {
        throw new DOMException('Aborted', 'AbortError');
      }
      return scriptedResponse([Promise.resolve(null)]);
    });
    vi.stubGlobal('fetch', fetchMock);
    const caller = new AbortController();
    caller.abort();

    const { error, streaming, start } = setup();
    await start('/stream', { signal: caller.signal });

    expect(fetchMock.mock.calls[0][1]?.signal?.aborted).toBe(true);
    expect(error.value).toBeNull();
    expect(streaming.value).toBe(false);
  });

  it("aborts the stream when the caller's signal aborts mid-stream", async () => {
    const hang = deferred<Uint8Array | null>();
    let seenSignal: AbortSignal | undefined;
    vi.stubGlobal(
      'fetch',
      vi.fn(async (_url: string, init?: RequestInit) => {
        seenSignal = init?.signal ?? undefined;
        return scriptedResponse([hang.promise]);
      }),
    );
    const caller = new AbortController();

    const { text, streaming, start } = setup();
    const running = start('/stream', { signal: caller.signal });
    await flush();

    caller.abort();
    expect(seenSignal?.aborted).toBe(true);

    hang.resolve(new TextEncoder().encode('late'));
    await running;

    expect(streaming.value).toBe(false);
    expect(text.value).toBe('');
  });
});
