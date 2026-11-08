import { useEffect, useRef, useState } from 'preact/hooks';
import type { PublicPlayer, PublicState } from '../../shared/types';
import { themeById } from '../../shared/themes';
import { sfx, unlockAudio } from '../lib/sound';
import { savedName, useCountdown, usePlayerConnection } from '../net/client';
import { Avatar, Logo, OPTION_STYLES, colorOf, themeLabel } from '../lib/ui';
import { burst } from '../lib/confetti';

export function Phone() {
  const conn = usePlayerConnection();
  const { state, meId } = conn;
  const me = state?.players.find((p) => p.id === meId);

  useSoundEffects(state, me);

  // som de "entrou!" quando o próprio card aparece
  const wasIn = useRef(false);
  useEffect(() => {
    if (me && !wasIn.current) sfx.join();
    wasIn.current = !!me;
  }, [!!me]);

  // tenta manter a tela ligada durante a partida
  useEffect(() => {
    if (!me) return;
    let lock: { release: () => Promise<void> } | null = null;
    const nav = navigator as Navigator & { wakeLock?: { request: (t: 'screen') => Promise<typeof lock> } };
    nav.wakeLock?.request('screen').then((l) => (lock = l)).catch(() => {});
    return () => void lock?.release().catch(() => {});
  }, [!!me]);

  if (!conn.room) return <Splash text="Leia o QR Code que aparece na TV 📺" />;
  if (conn.kicked) return <Kicked onBack={conn.rejoin} />;
  if (!conn.online) return <Splash text="Conectando…" />;
  if (!state) return <Splash text="Procurando a TV… 📺" />;
  if (!me) return <Join conn={conn} state={state} />;

  return (
    <div class="party-bg flex min-h-full flex-col">
      <Header me={me} state={state} />
      {!conn.tvOnline && (
        <div class="mx-4 mb-3 rounded-2xl bg-red-500 px-4 py-2 text-center font-bold text-white chunky">
          📺 Sem sinal da TV… a página do jogo está aberta nela?
        </div>
      )}
      <main class="flex flex-1 flex-col px-4 pb-6">
        <Screen state={state} me={me} conn={conn} />
      </main>
      {me.isHost && state.phase !== 'lobby' && state.phase !== 'gameover' && <HostBar conn={conn} />}
    </div>
  );
}

type Conn = ReturnType<typeof usePlayerConnection>;

function useSoundEffects(state: PublicState | null, me: PublicPlayer | undefined) {
  const prev = useRef<string>('');
  useEffect(() => {
    if (!state || !me) return;
    const key = `${state.phase}:${state.round}:${state.roundQuestion}`;
    if (key === prev.current) return;
    prev.current = key;
    if (state.phase === 'voting' || state.phase === 'chosen') sfx.whoosh();
    if (state.phase === 'question') sfx.pop();
    if (state.phase === 'reveal' && me.correct !== null) {
      if (me.correct) {
        sfx.correct();
        burst();
      } else sfx.wrong();
    }
    if (state.phase === 'gameover') {
      if (state.winnerId === me.id) sfx.win();
      else sfx.lose();
    }
  }, [state, me]);
}

function Splash({ text }: { text: string }) {
  return (
    <div class="party-bg grid min-h-full place-items-center p-6 text-center text-white">
      <div>
        <Logo size="text-[2.1rem]" />
        <p class="mt-6 animate-pulse text-xl font-semibold">{text}</p>
      </div>
    </div>
  );
}

function Kicked({ onBack }: { onBack: () => void }) {
  return (
    <div class="party-bg grid min-h-full place-items-center p-6 text-center text-white">
      <div>
        <div class="text-7xl">👋</div>
        <h2 class="mt-4 text-3xl font-bold">Você saiu da partida</h2>
        <button class="press mt-8 rounded-2xl bg-white px-8 py-4 text-xl font-bold text-ink chunky" onClick={onBack}>
          Entrar de novo
        </button>
      </div>
    </div>
  );
}

function Join({ conn, state }: { conn: Conn; state: PublicState }) {
  const [name, setName] = useState(savedName.get());
  const full = state.players.length >= 8;
  const [sentAt, setSentAt] = useState(0);
  const [, tick] = useState(0);
  const waiting = sentAt > 0 && !conn.error && Date.now() - sentAt < 8000;
  useEffect(() => {
    if (!sentAt) return;
    const id = setTimeout(() => tick((n) => n + 1), 8100);
    return () => clearTimeout(id);
  }, [sentAt]);
  const submit = (e: Event) => {
    e.preventDefault();
    unlockAudio();
    const n = name.trim();
    if (!n) return;
    savedName.set(n);
    setSentAt(Date.now());
    conn.join(n);
  };
  return (
    <div class="party-bg flex min-h-full flex-col items-center justify-center p-6 text-center">
      <Logo size="text-[2.1rem]" />
      <form onSubmit={submit} class="mt-8 w-full max-w-sm animate-pop rounded-[2rem] bg-white p-6 chunky-lg">
        <label class="block text-2xl font-bold" for="name">
          Qual é o seu nome?
        </label>
        <input
          id="name"
          class="mt-4 w-full rounded-2xl border-4 border-ink/15 px-4 py-3 text-center text-2xl font-bold outline-none focus:border-grape"
          maxLength={14}
          autoComplete="off"
          autoCapitalize="words"
          enterKeyHint="go"
          placeholder="Ex.: Ana"
          value={name}
          onInput={(e) => {
            setName((e.target as HTMLInputElement).value);
            conn.clearError();
          }}
        />
        {conn.error && <p class="mt-3 font-semibold text-red-500">{conn.error}</p>}
        {!conn.tvOnline && !conn.error && (
          <p class="mt-3 font-semibold text-red-500">Sem sinal da TV. Confira se o jogo está aberto nela.</p>
        )}
        {full && !conn.error && <p class="mt-3 font-semibold text-red-500">A sala está cheia (8 jogadores)!</p>}
        <button
          type="submit"
          disabled={!name.trim() || full || waiting}
          class="press mt-5 w-full rounded-2xl bg-grape py-4 text-2xl font-bold text-white chunky disabled:opacity-40"
        >
          {waiting ? 'Entrando…' : 'ENTRAR! 🎉'}
        </button>
      </form>
      <p class="mt-6 font-medium text-white/80">{state.players.length}/8 jogadores na sala</p>
    </div>
  );
}

function Header({ me, state }: { me: PublicPlayer; state: PublicState }) {
  return (
    <header
      class="mb-4 flex items-center gap-3 rounded-b-[1.8rem] px-4 pt-4 pb-3 text-white chunky"
      style={{ background: `linear-gradient(180deg, ${colorOf(me.seat).hex}, ${colorOf(me.seat).dark})` }}
    >
      <Avatar name={me.name} seat={me.seat} size="3rem" ring />
      <div class="min-w-0 flex-1">
        <div class="truncate text-xl leading-tight font-bold">
          {me.name} {me.isHost && <span title="Host">👑</span>}
        </div>
        <div class="text-sm font-medium opacity-90">
          {me.streak >= 2 ? `🔥 ${me.streak} seguidas!` : colorOf(me.seat).name}
        </div>
      </div>
      <div class="rounded-2xl bg-white/25 px-3 py-1 text-center">
        <div class="text-2xl leading-none font-bold">{me.score}</div>
        <div class="text-xs font-semibold opacity-90">de {state.winScore}</div>
      </div>
    </header>
  );
}

function Card({ children, class: cls = '' }: { children: preact.ComponentChildren; class?: string }) {
  return <div class={`rounded-[2rem] bg-white p-5 text-center chunky-lg ${cls}`}>{children}</div>;
}

function Screen({ state, me, conn }: { state: PublicState; me: PublicPlayer; conn: Conn }) {
  switch (state.phase) {
    case 'lobby':
      return <LobbyScreen state={state} me={me} conn={conn} />;
    case 'voting':
      return <VoteScreen state={state} me={me} conn={conn} />;
    case 'chosen':
      return <ChosenScreen state={state} me={me} />;
    case 'question':
      return (
        <AnswerScreen
          key={`${state.round}:${state.roundQuestion}:${state.question?.text}`}
          state={state}
          me={me}
          conn={conn}
        />
      );
    case 'reveal':
      return <RevealScreen state={state} me={me} />;
    case 'gameover':
      return <GameOverScreen state={state} me={me} conn={conn} />;
  }
}

function LobbyScreen({ state, me, conn }: { state: PublicState; me: PublicPlayer; conn: Conn }) {
  const enough = state.players.filter((p) => p.connected).length >= 2;
  return (
    <div class="flex flex-1 flex-col gap-4">
      <Card class="animate-pop">
        <div class="text-6xl animate-wiggle">🎉</div>
        <h2 class="mt-2 text-3xl font-bold">Você está dentro!</h2>
        <p class="mt-1 text-lg text-ink/70">Seu card está na TV com a cor {colorOf(me.seat).name.toLowerCase()}.</p>
      </Card>
      {me.isHost ? (
        <Card>
          <h3 class="text-xl font-bold">👑 Você é o host</h3>
          <ul class="mt-3 flex flex-col gap-2 text-left">
            {state.players.map((p) => (
              <li key={p.id} class="flex items-center gap-3 rounded-2xl bg-ink/5 px-3 py-2">
                <Avatar name={p.name} seat={p.seat} size="2.2rem" />
                <span class={`flex-1 truncate text-lg font-semibold ${p.connected ? '' : 'opacity-40'}`}>{p.name}</span>
                {p.id !== me.id && (
                  <button
                    class="press rounded-xl bg-red-100 px-3 py-1 text-sm font-bold text-red-600"
                    onClick={() => confirm(`Remover ${p.name}?`) && conn.send({ type: 'kick', playerId: p.id })}
                  >
                    remover
                  </button>
                )}
              </li>
            ))}
          </ul>
          <button
            disabled={!enough}
            onClick={() => conn.send({ type: 'start' })}
            class="press mt-5 w-full rounded-2xl bg-green-500 py-5 text-3xl font-bold text-white chunky disabled:opacity-40"
          >
            COMEÇAR! 🚀
          </button>
          {!enough && <p class="mt-2 text-sm font-semibold text-ink/60">Precisa de pelo menos 2 jogadores</p>}
        </Card>
      ) : (
        <Card>
          <p class="text-lg font-semibold">
            Esperando 👑 <b>{state.players.find((p) => p.isHost)?.name}</b> começar o jogo…
          </p>
          <p class="mt-2 text-ink/60">{state.players.length} jogadores na sala</p>
        </Card>
      )}
    </div>
  );
}

function SmallTimer({ state, offset }: { state: PublicState; offset: number }) {
  const { msLeft, secLeft } = useCountdown(state.deadline, offset);
  const pct = state.duration ? msLeft / state.duration : 0;
  const lastTick = useRef(-1);
  useEffect(() => {
    if (state.phase === 'question' && secLeft <= 3 && secLeft > 0 && secLeft !== lastTick.current) {
      lastTick.current = secLeft;
      sfx.tick();
    }
  }, [secLeft, state.phase]);
  return (
    <div class="h-3 overflow-hidden rounded-full bg-white/30">
      <div
        class="h-full rounded-full bg-white transition-[width] duration-100 ease-linear"
        style={{ width: `${Math.max(0, Math.min(1, pct)) * 100}%` }}
      />
    </div>
  );
}

function VoteScreen({ state, me, conn }: { state: PublicState; me: PublicPlayer; conn: Conn }) {
  return (
    <div class="flex flex-1 flex-col gap-4">
      <div class="text-center text-white">
        <h2 class="text-outline text-4xl font-bold text-yellow-300">Vote no tema!</h2>
        <p class="font-medium opacity-90">Rodada {state.round} · você pode trocar o voto</p>
      </div>
      <SmallTimer state={state} offset={conn.offset} />
      <div class="flex flex-1 flex-col gap-4">
        {state.themeOptions.map((id, i) => {
          const t = themeById(id)!;
          const mine = me.vote === id;
          const count = state.players.filter((p) => p.vote === id).length;
          return (
            <button
              key={id}
              onClick={() => {
                sfx.tap();
                conn.send({ type: 'vote', themeId: id });
              }}
              class={`press animate-pop flex flex-1 items-center gap-4 rounded-[1.8rem] px-5 py-4 text-left text-white chunky-lg ${
                mine ? 'ring-[6px] ring-white' : me.vote ? 'opacity-60' : ''
              }`}
              style={{ background: t.color, animationDelay: `${i * 0.08}s` }}
            >
              <span class="text-5xl">{t.emoji}</span>
              <span class="flex-1 text-2xl leading-tight font-bold drop-shadow">{t.name}</span>
              {count > 0 && <span class="rounded-full bg-white/30 px-3 py-1 text-lg font-bold">{count}</span>}
              {mine && <span class="text-3xl">✅</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChosenScreen({ state, me }: { state: PublicState; me: PublicPlayer }) {
  const t = state.themeId ? themeById(state.themeId) : undefined;
  return (
    <div class="flex flex-1 flex-col items-center justify-center gap-4 text-center text-white">
      {state.suddenDeath && (
        <h2 class="text-outline animate-bounce-in text-4xl font-bold text-red-300">☠️ MORTE SÚBITA!</h2>
      )}
      {state.suddenDeath && !me.contender && (
        <p class="text-xl font-semibold">Só quem empatou responde agora. Torça! 📣</p>
      )}
      {t && (
        <div class="animate-zoom rounded-[2.4rem] px-10 py-8 chunky-lg" style={{ background: t.color }}>
          <div class="text-8xl animate-wiggle">{t.emoji}</div>
          <div class="text-outline mt-3 text-4xl font-bold">{t.name}</div>
        </div>
      )}
      <p class="text-xl font-semibold opacity-90">Prepare-se… 👀</p>
    </div>
  );
}

function AnswerScreen({ state, me, conn }: { state: PublicState; me: PublicPlayer; conn: Conn }) {
  const q = state.question!;
  const spectator = state.suddenDeath && !me.contender;
  const [picked, setPicked] = useState<number | null>(null);
  // após recarregar a página, sabemos que respondeu mas não qual
  const chosen = picked ?? (me.answered ? -1 : null);
  if (spectator) {
    return (
      <div class="flex flex-1 flex-col items-center justify-center gap-4 text-center text-white">
        <div class="text-7xl">📣</div>
        <h2 class="text-3xl font-bold">Morte súbita!</h2>
        <p class="text-xl">Olhe a TV e torça!</p>
      </div>
    );
  }
  return (
    <div class="flex flex-1 flex-col gap-3">
      <div class="rounded-2xl bg-white/20 px-4 py-3 text-center text-white">
        <div class="text-sm font-semibold opacity-90">{themeLabel(q.themeId, q.sub)}</div>
        <div class="text-lg leading-snug font-bold">📺 Leia a pergunta na TV e escolha:</div>
      </div>
      <SmallTimer state={state} offset={conn.offset} />
      <div class="grid flex-1 grid-cols-1 gap-3">
        {q.options.map((opt, i) => {
          const s = OPTION_STYLES[i];
          const isMine = chosen === i;
          return (
            <button
              key={i}
              onClick={() => {
                sfx.tap();
                setPicked(i);
                conn.send({ type: 'answer', index: i });
              }}
              class={`press flex min-h-[4.5rem] items-center gap-3 rounded-[1.6rem] px-4 py-3 text-left text-white chunky-lg ${
                chosen !== null && !isMine ? 'opacity-60' : ''
              } ${isMine ? 'ring-[6px] ring-white' : ''}`}
              style={{ background: s.bg }}
            >
              <span class="text-3xl">{s.shape}</span>
              <span class="flex-1 text-xl leading-tight font-bold drop-shadow">{opt}</span>
              {isMine && <span class="text-2xl">🤞</span>}
            </button>
          );
        })}
      </div>
      {chosen !== null && (
        <p class="animate-pop text-center text-xl font-bold text-white">Resposta enviada! 🤞 Pode trocar até o tempo acabar</p>
      )}
    </div>
  );
}

function RevealScreen({ state, me }: { state: PublicState; me: PublicPlayer }) {
  const q = state.question!;
  const correctText = q.correct !== null ? q.options[q.correct] : '';
  if (me.correct === null) {
    return (
      <div class="flex flex-1 flex-col items-center justify-center gap-4 text-center text-white">
        <div class="text-7xl">👀</div>
        <p class="text-2xl font-bold">Resposta certa:</p>
        <p class="rounded-2xl bg-white px-6 py-3 text-2xl font-bold text-ink chunky">{correctText}</p>
      </div>
    );
  }
  return (
    <div class="flex flex-1 flex-col items-center justify-center gap-5 text-center">
      {me.correct ? (
        <>
          <div class="text-8xl animate-bounce-in">🎉</div>
          <h2 class="text-outline animate-bounce-in text-6xl font-bold text-green-300">ACERTOU!</h2>
          {!state.suddenDeath && <div class="animate-rise text-5xl font-bold text-white">+1</div>}
          {me.streak >= 2 && (
            <div class="animate-pop rounded-full bg-orange-500 px-5 py-2 text-2xl font-bold text-white chunky">
              🔥 {me.streak} seguidas!
            </div>
          )}
        </>
      ) : (
        <>
          <div class="text-8xl animate-shake">{noAnswer(me) ? '⏰' : '😵'}</div>
          <h2 class="text-outline text-6xl font-bold text-red-300">{noAnswer(me) ? 'Tempo!' : 'Ops!'}</h2>
          <p class="text-xl font-semibold text-white">A resposta era:</p>
          <p class="rounded-2xl bg-white px-6 py-3 text-2xl font-bold text-ink chunky">{correctText}</p>
        </>
      )}
    </div>
  );
}

const noAnswer = (me: PublicPlayer) => me.choice === null;

function GameOverScreen({ state, me, conn }: { state: PublicState; me: PublicPlayer; conn: Conn }) {
  const won = state.winnerId === me.id;
  const ranked = [...state.players].sort((a, b) =>
    a.id === state.winnerId ? -1 : b.id === state.winnerId ? 1 : b.score - a.score,
  );
  const pos = ranked.findIndex((p) => p.id === me.id) + 1;
  return (
    <div class="flex flex-1 flex-col gap-4">
      <Card class="animate-pop">
        <div class="text-7xl">{won ? '🏆' : pos === 2 ? '🥈' : pos === 3 ? '🥉' : '👏'}</div>
        <h2 class="mt-2 text-4xl font-bold">{won ? 'VOCÊ VENCEU!' : `${pos}º lugar`}</h2>
        <p class="mt-1 text-lg text-ink/70">
          {won ? 'Campeão(ã) do Quiz Party!' : `${ranked[0]?.name} levou a coroa 👑`}
        </p>
      </Card>
      {me.isHost ? (
        <div class="flex flex-col gap-3">
          <button
            onClick={() => conn.send({ type: 'playAgain' })}
            class="press w-full rounded-2xl bg-green-500 py-5 text-2xl font-bold text-white chunky-lg"
          >
            JOGAR DE NOVO 🔁
          </button>
          <button
            onClick={() => conn.send({ type: 'endGame' })}
            class="press w-full rounded-2xl bg-white/90 py-3 text-lg font-bold text-ink chunky"
          >
            Voltar para a sala (entrar/sair gente)
          </button>
        </div>
      ) : (
        <p class="text-center text-lg font-semibold text-white">O host pode começar outra partida 👑</p>
      )}
    </div>
  );
}

function HostBar({ conn }: { conn: Conn }) {
  const [open, setOpen] = useState(false);
  return (
    <div class="sticky bottom-0 px-4 pb-4">
      {open ? (
        <div class="flex gap-2 rounded-2xl bg-white/95 p-2 chunky">
          <button
            class="press flex-1 rounded-xl bg-grape py-3 font-bold text-white"
            onClick={() => conn.send({ type: 'skip' })}
          >
            ⏭ Pular
          </button>
          <button
            class="press flex-1 rounded-xl bg-red-500 py-3 font-bold text-white"
            onClick={() => confirm('Encerrar a partida e voltar para a sala?') && conn.send({ type: 'endGame' })}
          >
            ⏹ Encerrar
          </button>
          <button class="press rounded-xl bg-ink/10 px-4 font-bold" onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>
      ) : (
        <button
          class="press w-full rounded-2xl bg-black/20 py-2 text-sm font-bold text-white"
          onClick={() => setOpen(true)}
        >
          👑 Controles do host
        </button>
      )}
    </div>
  );
}
