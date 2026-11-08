export type Phase = 'lobby' | 'voting' | 'chosen' | 'question' | 'reveal' | 'gameover';

/** 8 cores, uma por assento (ordem: sup-esq, cima, sup-dir, direita, inf-dir, baixo, inf-esq, esquerda) */
export const PLAYER_COLORS = [
  { name: 'Vermelho', hex: '#ff4d6d', dark: '#c9184a' },
  { name: 'Laranja', hex: '#ff9f1c', dark: '#d97706' },
  { name: 'Amarelo', hex: '#ffd60a', dark: '#ca8a04' },
  { name: 'Verde', hex: '#38d36b', dark: '#15803d' },
  { name: 'Ciano', hex: '#22d3ee', dark: '#0e7490' },
  { name: 'Azul', hex: '#4d7cff', dark: '#1d4ed8' },
  { name: 'Roxo', hex: '#a66bff', dark: '#6d28d9' },
  { name: 'Rosa', hex: '#ff6bd6', dark: '#be185d' },
] as const;

export const MAX_PLAYERS = 8;

export interface PublicPlayer {
  id: string;
  name: string;
  seat: number;
  score: number;
  streak: number;
  connected: boolean;
  isHost: boolean;
  /** já respondeu a pergunta atual (sem revelar qual) */
  answered: boolean;
  /** voto atual (themeId) — votos são públicos */
  vote: string | null;
  /** só preenchido na revelação */
  choice: number | null;
  /** só preenchido na revelação */
  correct: boolean | null;
  /** está disputando a morte súbita */
  contender: boolean;
}

export interface PublicQuestion {
  themeId: string;
  sub?: string;
  text: string;
  options: string[];
  /** índice correto — só enviado na revelação */
  correct: number | null;
  fact: string | null;
}

export interface PublicState {
  phase: Phase;
  players: PublicPlayer[];
  hostId: string | null;
  winScore: number;
  questionsPerRound: number;
  /** temas sorteados para votação */
  themeOptions: string[];
  /** tema da rodada */
  themeId: string | null;
  /** 1..questionsPerRound dentro da rodada */
  roundQuestion: number;
  round: number;
  question: PublicQuestion | null;
  /** epoch ms do servidor em que a fase atual termina */
  deadline: number | null;
  /** duração total da fase atual (ms), p/ desenhar o timer */
  duration: number | null;
  suddenDeath: boolean;
  /** pausado pelo host */
  paused: boolean;
  /** tempo que faltava quando pausou (ms) */
  pausedLeft: number | null;
  /** temas empatados na votação: o celular mostra a roleta do sorteio */
  tiedThemes: string[];
  /** o sorteio aconteceu porque ninguém votou */
  drawNoVotes: boolean;
  /** duração da roleta (ms), contada do início da fase 'chosen' */
  drawMs: number;
  winnerId: string | null;
  joinUrl: string;
  serverNow: number;
}

/** Mensagens celular → TV */
export type ClientMsg =
  | { type: 'join'; name: string }
  | { type: 'ping' }
  | { type: 'vote'; themeId: string }
  | { type: 'answer'; index: number }
  | { type: 'start' }
  | { type: 'skip' }
  | { type: 'kick'; playerId: string }
  | { type: 'playAgain' }
  | { type: 'endGame' }
  | { type: 'pause' }
  | { type: 'unpause' };

/** Envelope publicado pelos celulares no tópico "up" da sala */
export interface UpEnvelope {
  from: string;
  msg: ClientMsg;
}

/** Mensagens diretas TV → um celular */
export type DirectMsg =
  | { type: 'error'; code: 'full' | 'name'; message: string }
  | { type: 'kicked' };
