import { describe, expect, it } from 'vitest';
import { Game, type Bank } from '../shared/game';

const mkBank = (): Bank => {
  const bank: Bank = {};
  for (const t of ['a', 'b', 'c', 'd', 'e']) {
    bank[t] = Array.from({ length: 10 }, (_, i) => ({ q: `${t}${i}?`, a: 'certo', w: ['x', 'y', 'z'] }));
  }
  return bank;
};

/** RNG determinístico */
function seeded(seed = 1) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function setup(n = 3, opts: Partial<ConstructorParameters<typeof Game>[0]> = {}) {
  const g = new Game({ bank: mkBank(), rng: seeded(), ...opts });
  const ids: string[] = [];
  for (let i = 0; i < n; i++) {
    const r = g.join(`J${i}`);
    if (!r.ok) throw new Error('join failed');
    ids.push(r.id);
  }
  return { g, ids };
}

const correctIdx = (g: Game) => g.question!.options.indexOf('certo');
const wrongIdx = (g: Game) => g.question!.options.findIndex((o) => o !== 'certo');

/** Todos votam no 1º tema, e passa do anúncio do tema para a pergunta */
function voteAndGo(g: Game, ids: string[], now = 0) {
  expect(g.phase).toBe('voting');
  for (const id of ids) g.vote(id, g.themeOptions[0], now);
  expect(g.phase).toBe('chosen');
  g.tick(now + 99_999);
  expect(g.phase).toBe('question');
}

describe('lobby', () => {
  it('atribui assentos e cores em ordem, primeiro vira host', () => {
    const { g, ids } = setup(3);
    expect(g.players.map((p) => p.seat)).toEqual([0, 1, 2]);
    expect(g.hostId).toBe(ids[0]);
  });

  it('limita a 8 jogadores', () => {
    const { g } = setup(8);
    expect(g.join('Nono')).toEqual({ ok: false, code: 'full' });
  });

  it('rejeita nome vazio e evita nomes repetidos', () => {
    const { g } = setup(1);
    expect(g.join('   ')).toEqual({ ok: false, code: 'name' });
    g.join('J0');
    expect(g.players[1].name).toBe('J0 2');
  });

  it('só o host inicia, e precisa de 2 jogadores', () => {
    const one = setup(1);
    expect(one.g.start(one.ids[0], 0)).toBe(false);
    const { g, ids } = setup(2);
    expect(g.start(ids[1], 0)).toBe(false);
    expect(g.start(ids[0], 0)).toBe(true);
    expect(g.phase).toBe('voting');
    expect(g.themeOptions).toHaveLength(3);
  });

  it('reutiliza o assento livre após remoção', () => {
    const { g, ids } = setup(3);
    expect(g.kick(ids[0], ids[1], 0)).toBe(true);
    const r = g.join('Novo');
    expect(r.ok && g.getPlayer(r.id)!.seat).toBe(1);
  });
});

describe('votação', () => {
  it('maioria vence', () => {
    const { g, ids } = setup(3);
    g.start(ids[0], 0);
    const [t1, t2] = g.themeOptions;
    g.vote(ids[0], t1, 0);
    g.vote(ids[1], t2, 0);
    g.vote(ids[2], t2, 0);
    expect(g.phase).toBe('chosen');
    expect(g.themeId).toBe(t2);
  });

  it('sem votos, sorteia entre os 3 quando o tempo acaba', () => {
    const { g, ids } = setup(2);
    g.start(ids[0], 0);
    const opts = [...g.themeOptions];
    g.tick(g.durations.voting);
    expect(g.view('', 0).drawNoVotes).toBe(true);
    expect(g.phase).toBe('chosen');
    expect(opts).toContain(g.themeId);
  });

  it('empate é decidido entre os empatados, com tempo extra para a roleta', () => {
    const { g, ids } = setup(2);
    g.start(ids[0], 0);
    const [t1, t2] = g.themeOptions;
    g.vote(ids[0], t1, 0);
    g.vote(ids[1], t2, 0);
    expect([t1, t2]).toContain(g.themeId);
    expect(g.view('', 0).tiedThemes.sort()).toEqual([t1, t2].sort());
    expect(g.duration).toBe(g.durations.chosen + g.durations.draw);
    expect(g.view('', 0).drawNoVotes).toBe(false);
  });

  it('sem empate não há roleta', () => {
    const { g, ids } = setup(2);
    g.start(ids[0], 0);
    const [t1] = g.themeOptions;
    g.vote(ids[0], t1, 0);
    g.vote(ids[1], t1, 0);
    expect(g.view('', 0).tiedThemes).toEqual([]);
    expect(g.duration).toBe(g.durations.chosen);
  });
});

describe('perguntas', () => {
  it('3 perguntas por rodada e depois nova votação', () => {
    const { g, ids } = setup(2);
    g.start(ids[0], 0);
    voteAndGo(g, ids);
    for (let n = 1; n <= 3; n++) {
      expect(g.roundQuestion).toBe(n);
      for (const id of ids) g.answer(id, correctIdx(g), 0);
      expect(g.phase).toBe('reveal');
      g.tick(99_999);
    }
    expect(g.phase).toBe('voting');
    expect(g.round).toBe(2);
  });

  it('não revela a resposta antes da hora e pontua quem acerta', () => {
    const { g, ids } = setup(2);
    g.start(ids[0], 0);
    voteAndGo(g, ids);
    expect(g.view('', 0).question!.correct).toBeNull();
    g.answer(ids[0], correctIdx(g), 0);
    expect(g.view('', 0).players[0].answered).toBe(true);
    expect(g.view('', 0).players[0].choice).toBeNull();
    g.answer(ids[1], wrongIdx(g), 0);
    const v = g.view('', 0);
    expect(v.phase).toBe('reveal');
    expect(v.question!.correct).toBe(correctIdx(g));
    expect(g.getPlayer(ids[0])!.score).toBe(1);
    expect(g.getPlayer(ids[0])!.streak).toBe(1);
    expect(g.getPlayer(ids[1])!.score).toBe(0);
  });

  it('pode trocar de resposta enquanto o tempo corre; vale a última', () => {
    const { g, ids } = setup(3);
    g.start(ids[0], 0);
    voteAndGo(g, ids);
    expect(g.answer(ids[0], wrongIdx(g), 0)).toBe(true);
    expect(g.answer(ids[0], correctIdx(g), 0)).toBe(true);
    expect(g.phase).toBe('question');
    g.tick(1e12);
    expect(g.phase).toBe('reveal');
    expect(g.getPlayer(ids[0])!.correct).toBe(true);
    expect(g.answer(ids[0], wrongIdx(g), 0)).toBe(false); // depois do tempo, não muda
  });

  it('tempo esgotado conta como erro e zera sequência', () => {
    const { g, ids } = setup(2);
    g.start(ids[0], 0);
    voteAndGo(g, ids);
    g.tick(99_999 + g.durations.question);
    expect(g.phase).toBe('reveal');
    expect(g.getPlayer(ids[0])!.correct).toBe(false);
  });

  it('não repete pergunta na partida até esgotar o tema', () => {
    const { g, ids } = setup(2, { questionsPerRound: 10, winScore: 99 });
    g.start(ids[0], 0);
    voteAndGo(g, ids);
    const seen = new Set<string>();
    let t = 1e9;
    for (let n = 0; n < 10; n++) {
      seen.add(g.question!.text);
      g.tick((t += 1e6));
      g.tick((t += 1e6));
    }
    expect(seen.size).toBe(10);
  });

  it('jogador desconectado não trava o fim antecipado', () => {
    const { g, ids } = setup(3);
    g.start(ids[0], 0);
    voteAndGo(g, ids);
    g.disconnect(ids[2], 0);
    g.answer(ids[0], 0, 0);
    g.answer(ids[1], 0, 0);
    expect(g.phase).toBe('reveal');
  });
});

describe('vitória', () => {
  function playUntil(g: Game, ids: string[], answerFor: (id: string) => 'right' | 'wrong') {
    let guard = 0;
    while (g.phase !== 'gameover' && guard++ < 500) {
      if (g.phase === 'voting') {
        for (const id of ids) g.vote(id, g.themeOptions[0], 0);
      } else if (g.phase === 'question') {
        for (const id of ids) {
          if (g.suddenDeath && !g.contenders.includes(id)) continue;
          g.answer(id, answerFor(id) === 'right' ? correctIdx(g) : wrongIdx(g), 0);
        }
      } else g.tick(1e12);
    }
  }

  it('primeiro a 15 vence', () => {
    const { g, ids } = setup(2);
    g.start(ids[0], 0);
    playUntil(g, ids, (id) => (id === ids[0] ? 'right' : 'wrong'));
    expect(g.winnerId).toBe(ids[0]);
    expect(g.getPlayer(ids[0])!.score).toBe(15);
  });

  it('empate em 15 vai para morte súbita e só os empatados respondem', () => {
    const { g, ids } = setup(3, { winScore: 2 });
    g.start(ids[0], 0);
    voteAndGo(g, ids);
    for (let n = 0; n < 2; n++) {
      g.answer(ids[0], correctIdx(g), 0);
      g.answer(ids[1], correctIdx(g), 0);
      g.answer(ids[2], wrongIdx(g), 0);
      g.tick(1e9 + n);
    }
    expect(g.suddenDeath).toBe(true);
    expect(g.phase).toBe('chosen');
    expect(new Set(g.contenders)).toEqual(new Set([ids[0], ids[1]]));
    g.tick(1e10);
    expect(g.phase).toBe('question');
    expect(g.answer(ids[2], 0, 0)).toBe(false);
    // ambos erram → repete
    g.answer(ids[0], wrongIdx(g), 0);
    g.answer(ids[1], wrongIdx(g), 0);
    g.tick(1e11);
    expect(g.suddenDeath).toBe(true);
    g.tick(1e12);
    // só o segundo acerta → vence
    g.answer(ids[0], wrongIdx(g), 0);
    g.answer(ids[1], correctIdx(g), 0);
    g.tick(1e13);
    expect(g.phase).toBe('gameover');
    expect(g.winnerId).toBe(ids[1]);
  });

  it('jogar de novo zera placar e mantém jogadores', () => {
    const { g, ids } = setup(2, { winScore: 1 });
    g.start(ids[0], 0);
    voteAndGo(g, ids);
    g.answer(ids[0], correctIdx(g), 0);
    g.answer(ids[1], wrongIdx(g), 0);
    g.tick(1e9);
    expect(g.phase).toBe('gameover');
    expect(g.playAgain(ids[0], 0)).toBe(true);
    expect(g.phase).toBe('voting');
    expect(g.players.every((p) => p.score === 0)).toBe(true);
    expect(g.players).toHaveLength(2);
  });
});

describe('conexão', () => {
  it('host que cai passa a coroa para o próximo conectado', () => {
    const { g, ids } = setup(3);
    g.disconnect(ids[0], 0);
    expect(g.hostId).toBe(ids[1]);
    expect(g.resume(ids[0])).toBe(true);
    expect(g.hostId).toBe(ids[1]);
    expect(g.getPlayer(ids[0])!.connected).toBe(true);
  });

  it('reconectar com o mesmo id mantém placar e assento', () => {
    const { g, ids } = setup(2);
    g.getPlayer(ids[1])!.score = 7;
    g.disconnect(ids[1], 0);
    const r = g.join('J1', ids[1]);
    expect(r).toEqual({ ok: true, id: ids[1] });
    expect(g.getPlayer(ids[1])!.score).toBe(7);
    expect(g.players).toHaveLength(2);
  });

  it('host pausa e continua: o tempo congela e ninguém responde', () => {
    const { g, ids } = setup(2);
    g.start(ids[0], 0);
    voteAndGo(g, ids, 0);
    const left = g.deadline! - 100_000;
    expect(g.pause(ids[1], 100_000)).toBe(false); // só o host
    expect(g.pause(ids[0], 100_000)).toBe(true);
    expect(g.view('', 0).paused).toBe(true);
    expect(g.view('', 0).pausedLeft).toBe(left);
    expect(g.answer(ids[0], 0, 100_000)).toBe(false);
    g.tick(1e12); // o tempo não passa pausado
    expect(g.phase).toBe('question');
    expect(g.unpause(ids[0], 500_000)).toBe(true);
    expect(g.deadline).toBe(500_000 + left);
    expect(g.answer(ids[0], 0, 500_000)).toBe(true);
  });

  it('pular tira o jogo da pausa', () => {
    const { g, ids } = setup(2);
    g.start(ids[0], 0);
    g.pause(ids[0], 0);
    expect(g.skip(ids[0], 0)).toBe(true);
    expect(g.paused).toBe(false);
    expect(g.phase).toBe('chosen');
  });

  it('host pula fase', () => {
    const { g, ids } = setup(2);
    g.start(ids[0], 0);
    expect(g.skip(ids[1], 0)).toBe(false);
    expect(g.skip(ids[0], 0)).toBe(true);
    expect(g.phase).toBe('chosen');
  });
});
