import type { PublicPlayer, PublicState } from '../../shared/types';
import { Avatar, colorOf } from '../lib/ui';

/** Posição de cada assento na grade 3×3 da TV */
export const SEAT_AREAS = [
  { row: 1, col: 1 }, // superior esquerdo
  { row: 1, col: 2 }, // cima
  { row: 1, col: 3 }, // superior direito
  { row: 2, col: 3 }, // direita
  { row: 3, col: 3 }, // inferior direito
  { row: 3, col: 2 }, // baixo
  { row: 3, col: 1 }, // inferior esquerdo
  { row: 2, col: 1 }, // esquerda
];

export function PlayerCard({ player, state }: { player: PublicPlayer; state: PublicState }) {
  const c = colorOf(player.seat);
  const revealing = state.phase === 'reveal';
  const asking = state.phase === 'question';
  const voting = state.phase === 'voting';
  const sitOut = state.suddenDeath && !player.contender;
  const pct = Math.min(1, player.score / state.winScore);

  let badge: preact.JSX.Element | null = null;
  if (asking && !sitOut) {
    badge = player.answered ? (
      <span class="animate-pop rounded-full bg-white px-3 py-0.5 text-[1.1rem] font-bold text-green-600 chunky">✓ Respondeu</span>
    ) : (
      <span class="rounded-full bg-white/70 px-3 py-0.5 text-[1.1rem] font-semibold text-ink/60">pensando…</span>
    );
  } else if (voting) {
    badge = player.vote ? (
      <span class="animate-pop rounded-full bg-white px-3 py-0.5 text-[1.1rem] font-bold text-grape chunky">✓ Votou</span>
    ) : (
      <span class="rounded-full bg-white/70 px-3 py-0.5 text-[1.1rem] font-semibold text-ink/60">votando…</span>
    );
  } else if (revealing && player.correct !== null) {
    badge = player.correct ? (
      <span class="animate-bounce-in rounded-full bg-green-500 px-3 py-0.5 text-[1.3rem] font-bold text-white chunky">
        {state.suddenDeath ? 'ACERTOU!' : '+1 ✓'}
      </span>
    ) : (
      <span class="animate-shake rounded-full bg-red-500 px-3 py-0.5 text-[1.3rem] font-bold text-white chunky">✗</span>
    );
  }

  return (
    <div
      class={`relative w-[22rem] rounded-[1.6rem] border-[0.35rem] bg-white p-3 chunky-lg transition-all duration-500 ${
        player.connected ? '' : 'opacity-45 grayscale'
      } ${sitOut ? 'scale-90 opacity-50' : ''} ${player.contender ? 'animate-pulse-big' : ''}`}
      style={{ borderColor: c.hex }}
    >
      {player.isHost && (
        <span class="absolute -top-[1.6rem] left-3 text-[2.2rem] animate-wiggle" title="Host">
          👑
        </span>
      )}
      <div class="flex items-center gap-3">
        <Avatar name={player.name} seat={player.seat} size="3.6rem" />
        <div class="min-w-0 flex-1">
          <div class="truncate text-[1.7rem] leading-tight font-bold">{player.name}</div>
          <div class="flex items-center gap-2 text-[1.1rem] font-semibold text-ink/60">
            {!player.connected ? (
              <span>📵 reconectando…</span>
            ) : player.streak >= 2 ? (
              <span class="font-bold text-orange-500">🔥 {player.streak} seguidas</span>
            ) : (
              <span>{c.name}</span>
            )}
          </div>
        </div>
        <div class="text-right">
          <div class="text-[2.6rem] leading-none font-bold" style={{ color: c.dark }}>
            {player.score}
          </div>
          <div class="text-[0.9rem] font-semibold text-ink/50">/{state.winScore}</div>
        </div>
      </div>
      <div class="mt-2 h-[0.9rem] overflow-hidden rounded-full bg-ink/10">
        <div
          class="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct * 100}%`, background: `linear-gradient(90deg, ${c.hex}, ${c.dark})` }}
        />
      </div>
      {badge && <div class="absolute -bottom-[1.1rem] right-3">{badge}</div>}
    </div>
  );
}

export function EmptySeat({ seat }: { seat: number }) {
  const c = colorOf(seat);
  return (
    <div
      class="grid h-[7.6rem] w-[22rem] place-items-center rounded-[1.6rem] border-[0.3rem] border-dashed text-[1.4rem] font-semibold text-white/60"
      style={{ borderColor: `${c.hex}88`, background: `${c.hex}18` }}
    >
      lugar livre
    </div>
  );
}
