import { describe, expect, it } from 'vitest';
import { BANK } from '../shared/questions';
import { MUSIC_SUBS, THEMES } from '../shared/themes';

describe('banco de perguntas', () => {
  it('todo tema tem perguntas e todo arquivo tem tema', () => {
    expect(Object.keys(BANK).sort()).toEqual(THEMES.map((t) => t.id).sort());
  });

  for (const theme of THEMES) {
    it(`${theme.name}: formato válido e ≥ 30 perguntas`, () => {
      const list = BANK[theme.id];
      expect(list.length).toBeGreaterThanOrEqual(30);
      for (const q of list) {
        const ctx = `[${theme.id}] ${q.q}`;
        expect(q.q.trim().length, ctx).toBeGreaterThan(5);
        expect(q.w, ctx).toHaveLength(3);
        const opts = [q.a, ...q.w].map((o) => o.trim().toLowerCase());
        expect(new Set(opts).size, `${ctx} — alternativas repetidas`).toBe(4);
        for (const o of opts) expect(o.length, ctx).toBeGreaterThan(0);
      }
    });
  }

  it('Música tem ≥ 10 perguntas por subgênero', () => {
    const counts: Record<string, number> = {};
    for (const q of BANK.musica) {
      expect(Object.keys(MUSIC_SUBS), q.q).toContain(q.sub);
      counts[q.sub!] = (counts[q.sub!] ?? 0) + 1;
    }
    for (const sub of Object.keys(MUSIC_SUBS)) expect(counts[sub] ?? 0, sub).toBeGreaterThanOrEqual(10);
  });

  it('sem perguntas duplicadas', () => {
    const seen = new Map<string, string>();
    const dups: string[] = [];
    for (const [theme, list] of Object.entries(BANK)) {
      for (const q of list) {
        const key = q.q.toLowerCase().replace(/[^a-z0-9à-ú]/g, '');
        if (seen.has(key)) dups.push(`${theme} ↔ ${seen.get(key)}: ${q.q}`);
        seen.set(key, theme);
      }
    }
    expect(dups).toEqual([]);
  });
});
