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
export function Logo({ size = 'text-6xl' }: { size?: string }) {
  return (
    <div class={`neon-sign font-display ${size} select-none`} role="img" aria-label="Quiz Party">
      <span class="neon-star" aria-hidden="true">
        ✦
      </span>
      <span class="neon-pink">
        QU<span class="neon-flicker">I</span>Z
      </span>
      <span class="neon-cyan">PARTY</span>
      <span class="neon-star" aria-hidden="true">
        ✦
      </span>
    </div>
  );
}
