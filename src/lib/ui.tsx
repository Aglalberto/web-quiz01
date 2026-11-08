import { PLAYER_COLORS } from '../../shared/types';
import { MUSIC_SUBS, themeById } from '../../shared/themes';

export const colorOf = (seat: number) => PLAYER_COLORS[seat % PLAYER_COLORS.length];

/** Cores + formas das 4 alternativas */
export const OPTION_STYLES = [
  { bg: '#ff4d6d', shape: '▲' },
  { bg: '#4d7cff', shape: '◆' },
  { bg: '#ffb703', shape: '●' },
  { bg: '#2ec46b', shape: '■' },
];

export function themeLabel(themeId: string | null | undefined, sub?: string) {
  const t = themeId ? themeById(themeId) : undefined;
  if (!t) return '';
  return sub && MUSIC_SUBS[sub] ? `${t.name} · ${MUSIC_SUBS[sub]}` : t.name;
}

export function Avatar({ name, seat, size = '3rem', ring = false }: { name: string; seat: number; size?: string; ring?: boolean }) {
  const c = colorOf(seat);
  return (
    <div
      class="grid shrink-0 place-items-center rounded-full font-bold text-white"
      style={{
        width: size,
        height: size,
        background: c.hex,
        fontSize: `calc(${size} * 0.5)`,
        boxShadow: ring ? `0 0 0 0.2rem white, 0 0 0 0.4rem ${c.dark}` : `inset 0 -0.2rem 0 ${c.dark}`,
        textShadow: `0 0.1rem 0 ${c.dark}`,
      }}
    >
      {name.slice(0, 1).toUpperCase()}
    </div>
  );
}

/**
 * Logo “Quiz Party” em letreiro de neon (estilo fliperama).
 * Brilho estático (text-shadow / box-shadow pintados uma vez) para não pesar na TV;
 * a única animação é uma letra que “pisca” de leve a cada poucos segundos (só opacidade).
 */
/** Uma cor de neon por letra, nas cores dos jogadores (como o logo antigo) */
const LOGO_LETTERS: { ch: string; color: string; flicker?: boolean }[] = [
  { ch: 'Q', color: '#ff4d6d' },
  { ch: 'U', color: '#ff9f1c' },
  { ch: 'I', color: '#ffd60a', flicker: true },
  { ch: 'Z', color: '#38d36b' },
  { ch: ' ', color: '' },
  { ch: 'P', color: '#22d3ee' },
  { ch: 'A', color: '#4d7cff' },
  { ch: 'R', color: '#a66bff' },
  { ch: 'T', color: '#ff6bd6' },
  { ch: 'Y', color: '#ff4d6d' },
];

export function Logo({ size = 'text-6xl' }: { size?: string }) {
  return (
    <div class={`neon-sign font-display ${size} select-none`} role="img" aria-label="Quiz Party">
      <span class="neon-star" aria-hidden="true">
        ✦
      </span>
      <span class="neon-word" aria-hidden="true">
        {LOGO_LETTERS.map((l, i) =>
          l.ch === ' ' ? (
            <span key={i} class="inline-block w-[0.32em]" />
          ) : (
            <span
              key={i}
              class={l.flicker ? 'neon-flicker' : undefined}
              style={{
                color: l.color,
                // brilho estático na cor da letra (pintado uma vez, leve para a TV)
                textShadow: `0 0 0.03em #fff, 0 0 0.12em ${l.color}, 0 0 0.32em ${l.color}`,
              }}
            >
              {l.ch}
            </span>
          ),
        )}
      </span>
      <span class="neon-star" aria-hidden="true">
        ✦
      </span>
    </div>
  );
}
