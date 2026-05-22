import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Canonical source tree only — never the leftover .claude/worktrees/* checkouts.
    include: ['src/**/*.test.ts'],
  },
});
