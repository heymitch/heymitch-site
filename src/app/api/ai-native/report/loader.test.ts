import { describe, it, expect } from 'vitest';
import { loadComputedById } from './loader';

function mockSupabase(row: unknown, error: unknown = null) {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: () => Promise.resolve({ data: row, error }),
        }),
      }),
    }),
  } as never;
}

describe('loadComputedById', () => {
  it('returns the computed jsonb for a found submission', async () => {
    const computed = { archetype: 'Wizard', altitude: 0.8 };
    const out = await loadComputedById(mockSupabase({ computed }), 'abc');
    expect(out).toEqual(computed);
  });

  it('returns null when no row is found', async () => {
    const out = await loadComputedById(mockSupabase(null), 'missing');
    expect(out).toBeNull();
  });

  it('returns null on a query error', async () => {
    const out = await loadComputedById(mockSupabase(null, { message: 'boom' }), 'abc');
    expect(out).toBeNull();
  });
});
