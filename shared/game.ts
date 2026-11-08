import type { RawQuestion } from './questions/_types';
import { MAX_PLAYERS, type Phase, type PublicState } from './types';

export type Bank = Record<string, RawQuestion[]>;

export interface Durations {
  voting: number;
  chosen: number;
  /** tempo extra da “roleta” no celular quando a votação empata */
  draw: number;
  question: number;
  reveal: number;
}

export const DEFAULT_DURATIONS: Durations = {
  voting: 15_000,
  chosen: 3_500,
  draw: 2_600,
  question: 20_000,
  reveal: 18_000,
};

export interface GameOptions {
  bank: Bank;
  winScore?: number;
  questionsPerRound?: number;
  durations?: Partial<Durations>;
  minPlayers?: number;
  rng?: () => number;
}

interface Player {
  id: string;
  name: string;
  seat: number;
  score: number;
  streak: number;
  connected: boolean;
  vote: string | null;
  choice: number | null;
  correct: boolean | null;
}

interface CurrentQuestion {
  themeId: string;
  sub?: string;
  text: string;
  options: string[];
  correct: number;
  fact: string | null;
}

export class Game {
  readonly bank: Bank;
  readonly winScore: number;
  readonly questionsPerRound: number;
  readonly durations: Durations;
  readonly minPlayers: number;
  private rng: () => number;

  phase: Phase = 'lobby';
  players: Player[] = [];
  hostId: string | null = null;
  themeOptions: string[] = [];
  themeId: string | null = null;
  /** temas empatados na votação (sorteio) — vazio se não houve empate */
  tiedThemes: string[] = [];
  /** jogo pausado pelo host: o tempo restante fica guardado em pausedLeft */
  paused = false;
  pausedLeft: number | null = null;
  /** o sorteio aconteceu porque ninguém votou */
  drawNoVotes = false;
  roundQuestion = 0;
  round = 0;
  question: CurrentQuestion | null = null;
  deadline: number | null = null;
  duration: number | null = null;
  suddenDeath = false;
  contenders: string[] = [];
  winnerId: string | null = null;

  private used = new Set<string>();
  private recentThemes: string[] = [];
  private idCounter = 0;

  constructor(opts: GameOptions) {
    this.bank = opts.bank;
    this.winScore = opts.winScore ?? 15;
    this.questionsPerRound = opts.questionsPerRound ?? 3;
    this.durations = { ...DEFAULT_DURATIONS, ...opts.durations };
    this.minPlayers = opts.minPlayers ?? 2;
    this.rng = opts.rng ?? Math.random;
  }

  // ───────────────────────── jogadores ─────────────────────────

  private newId() {
    this.idCounter++;
    return `p${Date.now().toString(36)}${this.idCounter}${Math.floor(this.rng() * 1e6).toString(36)}`;
  }

  getPlayer(id: string | null | undefined) {
    return id ? this.players.find((p) => p.id === id) : undefined;
  }

  /** Entra (ou reentra) um jogador. Retorna o id, ou um erro. */
  join(rawName: string, playerId?: string): { ok: true; id: string } | { ok: false; code: 'full' | 'name' } {
    const existing = this.getPlayer(playerId);
    if (existing) {
      existing.connected = true;
      const name = cleanName(rawName);
      if (name) existing.name = this.uniqueName(name, existing.id);
      this.ensureHost();
      return { ok: true, id: existing.id };
    }
    const name = cleanName(rawName);
    if (!name) return { ok: false, code: 'name' };
    if (this.players.length >= MAX_PLAYERS) return { ok: false, code: 'full' };
    const taken = new Set(this.players.map((p) => p.seat));
    let seat = 0;
    while (taken.has(seat)) seat++;
    const player: Player = {
      id: playerId && /^[a-z0-9]{6,32}$/i.test(playerId) ? playerId : this.newId(),
      name: this.uniqueName(name),
      seat,
      score: 0,
      streak: 0,
      connected: true,
      vote: null,
      choice: null,
      correct: null,
    };
    this.players.push(player);
    this.players.sort((a, b) => a.seat - b.seat);
    this.ensureHost();
    return { ok: true, id: player.id };
  }

  /** Reconecta pelo id salvo no celular. */
  resume(playerId: string): boolean {
    const p = this.getPlayer(playerId);
    if (!p) return false;
    p.connected = true;
    this.ensureHost();
    return true;
  }

  private uniqueName(name: string, selfId?: string) {
    const others = new Set(this.players.filter((p) => p.id !== selfId).map((p) => p.name.toLowerCase()));
    if (!others.has(name.toLowerCase())) return name;
    for (let i = 2; ; i++) {
      const candidate = `${name.slice(0, 12)} ${i}`;
      if (!others.has(candidate.toLowerCase())) return candidate;
    }
  }

  disconnect(playerId: string, now: number) {
    const p = this.getPlayer(playerId);
    if (!p) return;
    p.connected = false;
    if (this.hostId === playerId) {
      this.hostId = null;
      this.ensureHost();
    }
    this.checkEarlyEnd(now);
  }

  kick(byId: string, targetId: string, now: number): boolean {
    if (byId !== this.hostId || byId === targetId) return false;
    const idx = this.players.findIndex((p) => p.id === targetId);
    if (idx < 0) return false;
    this.players.splice(idx, 1);
    this.contenders = this.contenders.filter((id) => id !== targetId);
    this.checkEarlyEnd(now);
    return true;
  }

  private ensureHost() {
    if (this.hostId && this.getPlayer(this.hostId)) {
      const host = this.getPlayer(this.hostId)!;
      if (host.connected) return;
    }
    const next = this.players.find((p) => p.connected);
    this.hostId = next ? next.id : this.players[0]?.id ?? null;
  }

  private connectedPlayers() {
    return this.players.filter((p) => p.connected);
  }

  /** Jogadores que podem responder a pergunta atual */
  private answerers() {
    const list = this.connectedPlayers();
    return this.suddenDeath ? list.filter((p) => this.contenders.includes(p.id)) : list;
  }

  // ───────────────────────── ações ─────────────────────────

  start(byId: string, now: number): boolean {
    if (byId !== this.hostId || this.phase !== 'lobby') return false;
    if (this.connectedPlayers().length < this.minPlayers) return false;
    this.resetScores();
    this.startVoting(now);
    return true;
  }

  playAgain(byId: string, now: number): boolean {
    if (byId !== this.hostId || this.phase !== 'gameover') return false;
    this.resetScores();
    this.startVoting(now);
    return true;
  }

  endGame(byId: string): boolean {
    if (byId !== this.hostId || this.phase === 'lobby') return false;
    this.resetScores();
    this.phase = 'lobby';
    this.setDeadline(null, 0);
    return true;
  }

  /** Host pula a fase atual (avança imediatamente). */
  /** Host pausa: congela o tempo da fase atual. */
  pause(byId: string, now: number): boolean {
    if (byId !== this.hostId || this.paused || this.deadline === null) return false;
    this.pausedLeft = Math.max(0, this.deadline - now);
    this.deadline = null;
    this.paused = true;
    return true;
  }

  /** Host continua: o tempo volta de onde parou. */
  unpause(byId: string, now: number): boolean {
    if (byId !== this.hostId || !this.paused) return false;
    this.deadline = now + (this.pausedLeft ?? 0);
    this.paused = false;
    this.pausedLeft = null;
    return true;
  }

  skip(byId: string, now: number): boolean {
    if (byId !== this.hostId) return false;
    if (this.phase === 'lobby' || this.phase === 'gameover') return false;
    this.advance(now);
    return true;
  }

  vote(playerId: string, themeId: string, now: number): boolean {
    const p = this.getPlayer(playerId);
    if (!p || this.paused || this.phase !== 'voting' || !this.themeOptions.includes(themeId)) return false;
    p.vote = themeId;
    this.checkEarlyEnd(now);
    return true;
  }

  answer(playerId: string, index: number, now: number): boolean {
    const p = this.getPlayer(playerId);
    if (!p || this.paused || this.phase !== 'question' || !this.question) return false;
    if (this.suddenDeath && !this.contenders.includes(p.id)) return false;
    if (!Number.isInteger(index) || index < 0 || index >= this.question.options.length) return false;
    p.choice = index;
    this.checkEarlyEnd(now);
    return true;
  }

  /** Chamado pelo servidor quando o prazo da fase vence. */
  tick(now: number) {
    if (this.deadline !== null && now >= this.deadline) this.advance(now);
  }

  // ───────────────────────── fluxo ─────────────────────────

  private resetScores() {
    for (const p of this.players) {
      p.score = 0;
      p.streak = 0;
      p.vote = null;
      p.choice = null;
      p.correct = null;
    }
    this.round = 0;
    this.roundQuestion = 0;
    this.suddenDeath = false;
    this.contenders = [];
    this.winnerId = null;
    this.question = null;
    this.themeId = null;
    this.themeOptions = [];
    this.tiedThemes = [];
  }

  private setDeadline(now: number | null, ms: number) {
    // toda mudança de fase tira o jogo da pausa
    this.paused = false;
    this.pausedLeft = null;
    if (now === null) {
      this.deadline = null;
      this.duration = null;
    } else {
      this.deadline = now + ms;
      this.duration = ms;
    }
  }

  private checkEarlyEnd(now: number) {
    if (this.paused) return;
    if (this.phase === 'voting') {
      const voters = this.connectedPlayers();
      if (voters.length > 0 && voters.every((p) => p.vote)) this.advance(now);
    } else if (this.phase === 'question') {
      const list = this.answerers();
      if (list.length > 0 && list.every((p) => p.choice !== null)) this.advance(now);
    }
  }

  private advance(now: number) {
    switch (this.phase) {
      case 'voting':
        return this.finishVoting(now);
      case 'chosen':
        return this.nextQuestion(now);
      case 'question':
        return this.reveal(now);
      case 'reveal':
        return this.afterReveal(now);
    }
  }

  private availableThemes() {
    return Object.keys(this.bank).filter((t) => this.bank[t].length > 0);
  }

  private startVoting(now: number) {
    this.round++;
    this.roundQuestion = 0;
    this.question = null;
    this.themeId = null;
    for (const p of this.players) p.vote = null;
    const all = this.availableThemes();
    let pool = all.filter((t) => !this.recentThemes.includes(t));
    if (pool.length < 3) pool = all;
    this.themeOptions = shuffle(pool, this.rng).slice(0, 3);
    this.phase = 'voting';
    this.setDeadline(now, this.durations.voting);
  }

  private finishVoting(now: number) {
    const counts = new Map<string, number>();
    for (const p of this.players) if (p.vote) counts.set(p.vote, (counts.get(p.vote) ?? 0) + 1);
    let best: string[] = [];
    let max = 0;
    for (const t of this.themeOptions) {
      const c = counts.get(t) ?? 0;
      if (c > max) {
        max = c;
        best = [t];
      } else if (c === max) best.push(t);
    }
    if (best.length === 0) best = [...this.themeOptions];
    this.themeId = best[Math.floor(this.rng() * best.length)];
    this.recentThemes = [this.themeId, ...this.recentThemes].slice(0, 6);
    this.tiedThemes = best.length > 1 ? [...best] : [];
    this.drawNoVotes = max === 0;
    this.phase = 'chosen';
    this.setDeadline(now, this.durations.chosen + (this.tiedThemes.length ? this.durations.draw : 0));
  }

  private pickQuestion(themeId: string): CurrentQuestion {
    const list = this.bank[themeId];
    let candidates = list.map((_, i) => i).filter((i) => !this.used.has(`${themeId}:${i}`));
    if (candidates.length === 0) {
      for (let i = 0; i < list.length; i++) this.used.delete(`${themeId}:${i}`);
      candidates = list.map((_, i) => i);
    }
    const idx = candidates[Math.floor(this.rng() * candidates.length)];
    this.used.add(`${themeId}:${idx}`);
    const raw = list[idx];
    const options = shuffle([raw.a, ...raw.w], this.rng);
    return {
      themeId,
      sub: raw.sub,
      text: raw.q,
      options,
      correct: options.indexOf(raw.a),
      fact: raw.fact ?? null,
    };
  }

  private nextQuestion(now: number) {
    if (!this.themeId) return this.startVoting(now);
    this.roundQuestion++;
    for (const p of this.players) {
      p.choice = null;
      p.correct = null;
    }
    this.question = this.pickQuestion(this.themeId);
    this.phase = 'question';
    this.setDeadline(now, this.durations.question);
  }

  private reveal(now: number) {
    const q = this.question!;
    for (const p of this.players) {
      const eligible = !this.suddenDeath || this.contenders.includes(p.id);
      if (!eligible) {
        p.correct = null;
        continue;
      }
      p.correct = p.choice === q.correct;
      if (this.suddenDeath) continue; // morte súbita não altera placar
      if (p.correct) {
        p.score++;
        p.streak++;
      } else {
        p.streak = 0;
      }
    }
    this.phase = 'reveal';
    this.setDeadline(now, this.durations.reveal);
  }

  private afterReveal(now: number) {
    if (this.suddenDeath) {
      const right = this.contenders.filter((id) => this.getPlayer(id)?.correct);
      const stillHere = this.contenders.filter((id) => this.getPlayer(id));
      if (right.length === 1) return this.finish(right[0]);
      if (stillHere.length === 1) return this.finish(stillHere[0]);
      if (stillHere.length === 0) return this.finish(this.leaderId());
      if (right.length >= 2) this.contenders = right;
      return this.suddenDeathQuestion(now);
    }

    const winners = this.players.filter((p) => p.score >= this.winScore);
    if (winners.length === 1) return this.finish(winners[0].id);
    if (winners.length > 1) {
      this.suddenDeath = true;
      this.contenders = winners.map((p) => p.id);
      return this.suddenDeathQuestion(now);
    }

    if (this.roundQuestion >= this.questionsPerRound) return this.startVoting(now);
    return this.nextQuestion(now);
  }

  private suddenDeathQuestion(now: number) {
    const themes = this.availableThemes();
    this.themeId = themes[Math.floor(this.rng() * themes.length)];
    this.themeOptions = [];
    this.tiedThemes = [];
    this.roundQuestion = 0;
    // passa por 'chosen' para a TV anunciar a morte súbita + tema
    this.phase = 'chosen';
    this.setDeadline(now, this.durations.chosen);
  }

  private leaderId() {
    return [...this.players].sort((a, b) => b.score - a.score)[0]?.id ?? null;
  }

  private finish(winnerId: string | null) {
    this.winnerId = winnerId;
    this.phase = 'gameover';
    this.suddenDeath = false;
    this.setDeadline(null, 0);
  }

  // ───────────────────────── visão pública ─────────────────────────

  /** Escolha do próprio jogador (enviada só para o celular dele) */
  choiceOf(playerId: string): number | null {
    if (this.phase !== 'question' && this.phase !== 'reveal') return null;
    return this.getPlayer(playerId)?.choice ?? null;
  }

  view(joinUrl: string, now: number): PublicState {
    const revealing = this.phase === 'reveal';
    return {
      phase: this.phase,
      hostId: this.hostId,
      winScore: this.winScore,
      questionsPerRound: this.questionsPerRound,
      themeOptions: this.themeOptions,
      themeId: this.themeId,
      tiedThemes: this.phase === 'chosen' ? this.tiedThemes : [],
      drawNoVotes: this.phase === 'chosen' && this.drawNoVotes,
      drawMs: this.durations.draw,
      roundQuestion: this.roundQuestion,
      round: this.round,
      deadline: this.deadline,
      duration: this.duration,
      suddenDeath: this.suddenDeath,
      paused: this.paused,
      pausedLeft: this.pausedLeft,
      winnerId: this.winnerId,
      joinUrl,
      serverNow: now,
      question:
        this.question && (this.phase === 'question' || this.phase === 'reveal')
          ? {
              themeId: this.question.themeId,
              sub: this.question.sub,
              text: this.question.text,
              options: this.question.options,
              correct: revealing ? this.question.correct : null,
              fact: revealing ? this.question.fact : null,
            }
          : null,
      players: this.players.map((p) => ({
        id: p.id,
        name: p.name,
        seat: p.seat,
        score: p.score,
        streak: p.streak,
        connected: p.connected,
        isHost: p.id === this.hostId,
        answered: (this.phase === 'question' || revealing) && p.choice !== null,
        vote: this.phase === 'voting' ? p.vote : null,
        choice: revealing ? p.choice : null,
        correct: revealing ? p.correct : null,
        contender: this.suddenDeath && this.contenders.includes(p.id),
      })),
    };
  }
}

export function cleanName(raw: string) {
  return (raw ?? '')
    .replace(/[\u0000-\u001f<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 14);
}

export function shuffle<T>(arr: T[], rng: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
