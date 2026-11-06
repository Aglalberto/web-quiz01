import confetti from 'canvas-confetti';
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

export function burst(big = false) {
  const colors = PLAYER_COLORS.map((c) => c.hex);
  confetti({ particleCount: big ? 220 : 90, spread: big ? 120 : 75, origin: { y: 0.6 }, colors, scalar: big ? 1.3 : 1 });
  if (big) {
    setTimeout(() => confetti({ particleCount: 120, angle: 60, spread: 70, origin: { x: 0 }, colors }), 250);
    setTimeout(() => confetti({ particleCount: 120, angle: 120, spread: 70, origin: { x: 1 }, colors }), 400);
  }
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

/** Logo animado com letras saltitantes */
export function Logo({ size = 'text-6xl' }: { size?: string }) {
  const letters = 'QUIZ PARTY'.split('');
  const palette = PLAYER_COLORS.map((c) => c.hex);
  return (
    <h1 class={`font-display ${size} font-bold tracking-wide select-none`} aria-label="Quiz Party">
      {letters.map((ch, i) =>
        ch === ' ' ? (
          <span key={i} class="inline-block w-[0.4em]" />
        ) : (
          <span
            key={i}
            class="text-outline inline-block animate-float"
            style={{ color: palette[i % palette.length], animationDelay: `${i * 0.12}s` }}
          >
            {ch}
          </span>
        ),
      )}
    </h1>
  );
}
