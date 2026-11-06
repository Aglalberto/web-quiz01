import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import QRCode from 'qrcode';
import type { PublicState } from '../../shared/types';
import { MAX_PLAYERS } from '../../shared/types';
import { themeById } from '../../shared/themes';
import { useConnection, useCountdown } from '../lib/socket';
import { Avatar, Logo, OPTION_STYLES, burst, colorOf, themeLabel } from '../lib/ui';
import { EmptySeat, PlayerCard, SEAT_AREAS } from './PlayerCard';

/** URL que vai no QR: o endereço que a própria TV abriu (ou o IP do servidor, se a TV abriu via localhost). */
function useJoinUrl(state: PublicState | null) {
  return useMemo(() => {
    const local = ['localhost', '127.0.0.1', '::1', '[::1]'].includes(location.hostname);
    if (!local) return `${location.origin}/play`;
    if (state?.joinUrl) {
      try {
        const u = new URL(state.joinUrl);
        if (location.port) u.port = location.port;
        return u.toString();
      } catch {
        /* usa o padrão */
      }
    }
    return `${location.origin}/play`;
  }, [state?.joinUrl]);
}

export function TV() {
  const conn = useConnection('tv');
  const { state, online } = conn;
  const joinUrl = useJoinUrl(state);
  const phase = state?.phase;

  // confete na TV quando há vencedor
  useEffect(() => {
    if (phase === 'gameover' && state?.winnerId) {
      burst(true);
      const id = setInterval(() => burst(true), 2500);
      return () => clearInterval(id);
    }
  }, [phase, state?.winnerId]);

  const bySeat = new Map(state?.players.map((p) => [p.seat, p]) ?? []);
  const inGame = phase && phase !== 'lobby';

  return (
    <div class="party-bg relative h-full w-full cursor-none overflow-hidden select-none">
      <div class="dots pointer-events-none absolute inset-0" />
      <div class="relative grid h-full grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr_auto] gap-[1.6rem] p-[1.8rem]">
        {Array.from({ length: MAX_PLAYERS }, (_, seat) => {
          const area = SEAT_AREAS[seat];
          const p = bySeat.get(seat);
          const align =
            area.col === 1 ? 'justify-self-start' : area.col === 3 ? 'justify-self-end' : 'justify-self-center';
          const valign = area.row === 1 ? 'self-start' : area.row === 3 ? 'self-end' : 'self-center';
          return (
            <div key={seat} class={`${align} ${valign}`} style={{ gridRow: area.row, gridColumn: area.col }}>
              {p && state ? <PlayerCard player={p} state={state} /> : !inGame ? <EmptySeat seat={seat} /> : null}
            </div>
          );
        })}
        <div class="row-start-2 col-start-2 grid min-h-0 min-w-0 place-items-center px-[1.2rem]">
          {!state ? (
            <div class="text-center text-white">
              <Logo size="text-[6rem]" />
              <p class="mt-4 text-[2rem] font-semibold">{online ? 'Carregando…' : 'Conectando ao servidor…'}</p>
            </div>
          ) : (
            <Stage state={state} joinUrl={joinUrl} offset={conn.offset} />
          )}
        </div>
      </div>
      {!online && state && (
        <div class="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-red-500 px-6 py-2 text-[1.4rem] font-bold text-white chunky">
          Sem conexão com o servidor… tentando de novo
        </div>
      )}
    </div>
  );
}

function Stage({ state, joinUrl, offset }: { state: PublicState; joinUrl: string; offset: number }) {
  switch (state.phase) {
    case 'lobby':
      return <Lobby state={state} joinUrl={joinUrl} />;
    case 'voting':
      return <Voting state={state} offset={offset} />;
    case 'chosen':
      return <Chosen state={state} />;
    case 'question':
    case 'reveal':
      return <QuestionView state={state} offset={offset} />;
    case 'gameover':
      return <Podium state={state} />;
  }
}

function Panel({ children, class: cls = '' }: { children: preact.ComponentChildren; class?: string }) {
  return <div class={`rounded-[2.6rem] bg-white p-[2.2rem] chunky-lg ${cls}`}>{children}</div>;
}

function Lobby({ state, joinUrl }: { state: PublicState; joinUrl: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvas.current)
      QRCode.toCanvas(canvas.current, joinUrl, {
        width: Math.round(window.innerHeight * 0.36),
        margin: 1,
        color: { dark: '#2a1650', light: '#ffffff' },
      });
  }, [joinUrl]);
  const host = state.players.find((p) => p.isHost);
  const count = state.players.length;
  return (
    <div class="flex flex-col items-center gap-[1.4rem] text-center">
      <Logo size="text-[5.4rem]" />
      <Panel class="flex items-center gap-[2.2rem] animate-pop">
        <canvas ref={canvas} class="rounded-2xl" />
        <div class="max-w-[24rem] text-left">
          <div class="text-[2.6rem] leading-tight font-bold">Aponte a câmera do celular! 📱</div>
          <p class="mt-3 text-[1.5rem] text-ink/70">Leia o QR Code, digite seu nome e pronto.</p>
          <p class="mt-3 rounded-xl bg-ink/5 px-3 py-2 font-mono text-[1.15rem] break-all text-ink/70">{joinUrl}</p>
          <div class="mt-4 text-[1.8rem] font-bold text-grape">
            {count}/{MAX_PLAYERS} jogadores
          </div>
        </div>
      </Panel>
      <div class="rounded-full bg-white/15 px-8 py-3 text-[1.7rem] font-semibold text-white backdrop-blur">
        {host ? (
          count < 2 ? (
            <>Esperando mais um jogador entrar… 👀</>
          ) : (
            <>
              👑 <b>{host.name}</b> é o host — toque em <b>COMEÇAR</b> no celular!
            </>
          )
        ) : (
          <>O primeiro a entrar vira o host 👑</>
        )}
      </div>
    </div>
  );
}

function TimerBar({ state, offset }: { state: PublicState; offset: number }) {
  const { msLeft, secLeft } = useCountdown(state.deadline, offset);
  const total = state.duration ?? 1;
  const pct = Math.max(0, Math.min(1, msLeft / total));
  const urgent = secLeft <= 5;
  return (
    <div class="flex w-full items-center gap-4">
      <div class="h-[1.4rem] flex-1 overflow-hidden rounded-full bg-ink/10">
        <div
          class="h-full rounded-full transition-[width] duration-100 ease-linear"
          style={{ width: `${pct * 100}%`, background: urgent ? '#ff4d6d' : '#5b2bd6' }}
        />
      </div>
      <div
        class={`grid h-[4.4rem] w-[4.4rem] place-items-center rounded-full text-[2.2rem] font-bold text-white chunky ${
          urgent ? 'bg-red-500 animate-pulse-big' : 'bg-grape'
        }`}
      >
        {secLeft}
      </div>
    </div>
  );
}

function Voting({ state, offset }: { state: PublicState; offset: number }) {
  return (
    <div class="flex w-full max-w-[64rem] flex-col items-center gap-[1.6rem]">
      <div class="text-center text-white">
        <div class="text-[1.6rem] font-semibold opacity-80">Rodada {state.round}</div>
        <h2 class="text-outline animate-bounce-in text-[4.4rem] leading-none font-bold text-yellow-300">
          Escolham o tema!
        </h2>
        <p class="mt-2 text-[1.6rem] font-medium opacity-90">Votem pelo celular 📱</p>
      </div>
      <div class="grid w-full grid-cols-3 gap-[1.6rem]">
        {state.themeOptions.map((id, i) => {
          const t = themeById(id)!;
          const voters = state.players.filter((p) => p.vote === id);
          return (
            <div
              key={id}
              class="animate-zoom flex flex-col items-center rounded-[2.2rem] p-[1.6rem] text-white chunky-lg"
              style={{ background: t.color, animationDelay: `${i * 0.12}s` }}
            >
              <div class="text-[6rem] leading-none animate-wiggle" style={{ animationDelay: `${i * 0.3}s` }}>
                {t.emoji}
              </div>
              <div class="mt-3 text-center text-[2.2rem] leading-tight font-bold drop-shadow">{t.name}</div>
              <div class="mt-4 flex min-h-[3.2rem] flex-wrap justify-center gap-2">
                {voters.map((p) => (
                  <div key={p.id} class="animate-pop">
                    <Avatar name={p.name} seat={p.seat} size="3rem" ring />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <Panel class="w-full !p-[1.2rem]">
        <TimerBar state={state} offset={offset} />
      </Panel>
    </div>
  );
}

function Chosen({ state }: { state: PublicState }) {
  const t = state.themeId ? themeById(state.themeId) : undefined;
  if (!t) return null;
  const contenders = state.players.filter((p) => p.contender);
  return (
    <div class="flex flex-col items-center gap-[1.6rem] text-center text-white">
      {state.suddenDeath ? (
        <>
          <h2 class="text-outline animate-bounce-in text-[5.4rem] font-bold text-red-400">☠️ MORTE SÚBITA! ☠️</h2>
          <div class="flex items-center gap-4 text-[2rem] font-semibold">
            {contenders.map((p, i) => (
              <span key={p.id} class="flex items-center gap-2">
                {i > 0 && <span class="mx-2 text-yellow-300">vs</span>}
                <Avatar name={p.name} seat={p.seat} size="3.4rem" ring /> {p.name}
              </span>
            ))}
          </div>
          <p class="text-[1.6rem] opacity-90">Quem acertar sozinho leva a coroa 👑</p>
        </>
      ) : (
        <div class="text-[2rem] font-semibold opacity-90">O tema escolhido foi…</div>
      )}
      <div
        class="animate-zoom flex flex-col items-center rounded-[3rem] px-[4rem] py-[2.4rem] chunky-lg"
        style={{ background: t.color }}
      >
        <div class="text-[9rem] leading-none animate-wiggle">{t.emoji}</div>
        <div class="text-outline mt-4 text-[4.4rem] font-bold">{t.name}</div>
      </div>
    </div>
  );
}

function QuestionView({ state, offset }: { state: PublicState; offset: number }) {
  const q = state.question;
  const revealing = state.phase === 'reveal';
  const t = q ? themeById(q.themeId) : undefined;
  if (!q || !t) return null;
  return (
    <div class="flex w-full max-w-[72rem] flex-col gap-[1.3rem]">
      <div class="flex items-center justify-between text-white">
        <span class="rounded-full px-5 py-1.5 text-[1.5rem] font-bold chunky" style={{ background: t.color }}>
          {t.emoji} {themeLabel(q.themeId, q.sub)}
        </span>
        <span class="text-[1.5rem] font-semibold opacity-90">
          {state.suddenDeath ? '☠️ Morte súbita' : `Pergunta ${state.roundQuestion}/${state.questionsPerRound}`}
        </span>
      </div>
      <Panel class="animate-pop !py-[1.8rem]">
        <h2 key={q.text} class="text-center text-[3rem] leading-[1.15] font-bold text-balance">
          {q.text}
        </h2>
        {!revealing && (
          <div class="mt-5">
            <TimerBar state={state} offset={offset} />
          </div>
        )}
      </Panel>
      <div class="grid grid-cols-2 gap-[1.1rem]">
        {q.options.map((opt, i) => {
          const s = OPTION_STYLES[i];
          const isRight = revealing && q.correct === i;
          const faded = revealing && q.correct !== i;
          const pickers = revealing ? state.players.filter((p) => p.choice === i) : [];
          return (
            <div
              key={i}
              class={`relative flex min-h-[6.2rem] items-center gap-4 rounded-[1.8rem] px-[1.4rem] py-[1rem] text-white chunky-lg transition-all duration-500 ${
                faded ? 'scale-95 opacity-35' : ''
              } ${isRight ? 'animate-pulse-big ring-[0.4rem] ring-white' : ''}`}
              style={{ background: s.bg }}
            >
              <span class="text-[2.4rem] leading-none opacity-90">{s.shape}</span>
              <span class="flex-1 text-[2rem] leading-tight font-bold drop-shadow">{opt}</span>
              {isRight && <span class="text-[2.6rem]">✅</span>}
              {pickers.length > 0 && (
                <div class="absolute -bottom-[1.2rem] right-4 flex -space-x-2">
                  {pickers.map((p) => (
                    <div key={p.id} class="animate-pop">
                      <Avatar name={p.name} seat={p.seat} size="2.6rem" ring />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {revealing && q.fact && (
        <div class="animate-bounce-in mt-2 flex items-start gap-3 rounded-[1.6rem] bg-yellow-300 px-6 py-3 text-[1.5rem] font-medium chunky">
          <span class="text-[2rem] leading-none">💡</span>
          <span>
            <b>Você sabia?</b> {q.fact}
          </span>
        </div>
      )}
    </div>
  );
}

function Podium({ state }: { state: PublicState }) {
  const ranked = [...state.players].sort((a, b) => {
    if (a.id === state.winnerId) return -1;
    if (b.id === state.winnerId) return 1;
    return b.score - a.score;
  });
  const winner = ranked[0];
  const [show, setShow] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setShow(true), 400);
    return () => clearTimeout(id);
  }, []);
  if (!winner) return null;
  const order = [ranked[1], ranked[0], ranked[2]];
  const heights = ['h-[10rem]', 'h-[15rem]', 'h-[7rem]'];
  const medals = ['🥈', '🏆', '🥉'];
  return (
    <div class="flex flex-col items-center gap-[1.2rem] text-center text-white">
      <h2 class="text-outline animate-bounce-in text-[5rem] leading-none font-bold text-yellow-300">
        {winner.name} venceu!
      </h2>
      <div class="flex items-end gap-[1.4rem]">
        {order.map((p, i) =>
          p ? (
            <div key={p.id} class="flex w-[16rem] flex-col items-center">
              <div class={`text-[4rem] ${i === 1 ? 'animate-wiggle' : ''}`}>{medals[i]}</div>
              <Avatar name={p.name} seat={p.seat} size={i === 1 ? '6rem' : '4.4rem'} ring />
              <div class="mt-2 max-w-full truncate text-[2rem] font-bold">{p.name}</div>
              <div class="text-[1.4rem] opacity-90">{p.score} acertos</div>
              <div
                class={`mt-2 w-full rounded-t-[1.6rem] ${heights[i]} transition-all duration-1000 chunky-lg ${
                  show ? '' : '!h-0'
                }`}
                style={{ background: colorOf(p.seat).hex }}
              />
            </div>
          ) : (
            <div key={i} class="w-[16rem]" />
          ),
        )}
      </div>
      <div class="rounded-full bg-white/15 px-8 py-3 text-[1.6rem] font-semibold backdrop-blur">
        👑 O host pode começar outra partida pelo celular
      </div>
    </div>
  );
}
