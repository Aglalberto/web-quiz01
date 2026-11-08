import { useEffect, useState } from 'preact/hooks';
import type { MqttClient } from 'mqtt';
import { Game } from '../../shared/game';
import { BANK } from '../../shared/questions';
import type { DirectMsg, PublicState, UpEnvelope } from '../../shared/types';
import { BROKERS, brokerFromUrl, connect, connectFirst, roomCode, topics } from './mqtt';

const PLAYER_TIMEOUT = 12_000; // sem sinal do celular por 12 s = desconectado
const HEARTBEAT = 3_000; // TV reenvia o estado a cada 3 s (sinal de vida)

/**
 * A TV é o “servidor”: roda as regras do jogo no navegador e conversa com os
 * celulares através de um broker MQTT público.
 */
class HostRoom {
  game: Game;
  code: string;
  client: MqttClient | null = null;
  brokerUrl = '';
  private lastSeen = new Map<string, number>();
  private timer: ReturnType<typeof setTimeout> | null = null;
  private intervals: ReturnType<typeof setInterval>[] = [];
  private listeners = new Set<() => void>();
  online = false;

  constructor(private params: URLSearchParams) {
    const fast = params.get('fast') === '1';
    this.game = new Game({
      bank: BANK,
      winScore: Number(params.get('vitoria')) || 15,
      durations: fast ? { voting: 2500, chosen: 800, question: 2500, reveal: 1200 } : undefined,
    });
    // cada vez que a página abre (ou recarrega) é uma sala nova, com código novo
    this.code = roomCode();
    this.brokerUrl = brokerFromUrl(params) ?? '';
    try {
      localStorage.removeItem('quizparty:tv'); // limpa partidas salvas por versões antigas
    } catch {
      /* ignora */
    }
  }

  get joinUrl() {
    const base = `${location.origin}${location.pathname}`;
    const q = new URLSearchParams({ sala: this.code });
    const custom = this.params.get('broker');
    const idx = BROKERS.indexOf(this.brokerUrl);
    if (custom) q.set('broker', custom);
    else if (idx >= 0) q.set('s', String(idx));
    return `${base}?${q.toString()}`;
  }

  async start() {
    const { client, url } = this.brokerUrl
      ? await new Promise<{ client: MqttClient; url: string }>((res) => {
          const c = connect(this.brokerUrl);
          c.once('connect', () => res({ client: c, url: this.brokerUrl }));
        })
      : await connectFirst(BROKERS);
    this.client = client;
    this.brokerUrl = url;
    const t = topics(this.code);
    const onConnect = () => {
      this.online = true;
      client.subscribe(t.up, { qos: 0 });
      this.publish();
    };
    onConnect();
    client.on('connect', onConnect);
    client.on('close', () => {
      this.online = false;
      this.notify();
    });
    client.on('message', (topic, payload) => {
      if (topic !== t.up) return;
      try {
        this.handle(JSON.parse(payload.toString()) as UpEnvelope);
      } catch {
        /* mensagem inválida */
      }
    });

    // sinal de vida + detecção de celulares que sumiram
    this.intervals.push(
      setInterval(() => {
        const now = Date.now();
        for (const p of this.game.players) {
          const seen = this.lastSeen.get(p.id) ?? 0;
          if (p.connected && now - seen > PLAYER_TIMEOUT) this.game.disconnect(p.id, now);
        }
        this.changed();
      }, HEARTBEAT),
    );
    this.changed();
  }

  stop() {
    this.intervals.forEach(clearInterval);
    if (this.timer) clearTimeout(this.timer);
    this.client?.end(true);
  }

  subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  private direct(playerId: string, msg: DirectMsg) {
    this.client?.publish(topics(this.code).to(playerId), JSON.stringify(msg), { qos: 0 });
  }

  private handle({ from, msg }: UpEnvelope) {
    if (!from || !msg) return;
    const g = this.game;
    const now = Date.now();
    this.lastSeen.set(from, now);
    const known = g.getPlayer(from);
    if (known && !known.connected) g.resume(from);

    switch (msg.type) {
      case 'ping':
        break;
      case 'join': {
        const res = g.join(msg.name, from);
        if (!res.ok)
          this.direct(from, {
            type: 'error',
            code: res.code,
            message: res.code === 'full' ? 'A sala está cheia (8 jogadores)!' : 'Digite seu nome 😉',
          });
        break;
      }
      case 'vote':
        g.vote(from, msg.themeId, now);
        break;
      case 'answer':
        g.answer(from, msg.index, now);
        break;
      case 'start':
        g.start(from, now);
        break;
      case 'skip':
        g.skip(from, now);
        break;
      case 'playAgain':
        g.playAgain(from, now);
        break;
      case 'endGame':
        g.endGame(from);
        break;
      case 'kick':
        if (g.kick(from, msg.playerId, now)) {
          this.direct(msg.playerId, { type: 'kicked' });
          this.lastSeen.delete(msg.playerId);
        }
        break;
    }
    this.changed();
  }

  view(): PublicState {
    return this.game.view(this.joinUrl, Date.now());
  }

  private publish() {
    if (!this.client?.connected) return;
    this.client.publish(topics(this.code).state, JSON.stringify(this.view()), { qos: 0, retain: true });
  }

  /** Publica o estado e reprograma o timer da fase. */
  changed() {
    this.publish();
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    const deadline = this.game.deadline;
    if (deadline !== null) {
      this.timer = setTimeout(() => {
        this.game.tick(Date.now());
        this.changed();
      }, Math.max(0, deadline - Date.now()) + 20);
    }
    this.notify();
  }
}

export function useHostRoom() {
  const [room] = useState(() => new HostRoom(new URLSearchParams(location.search)));
  const [, force] = useState(0);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const unsub = room.subscribe(() => force((n) => n + 1));
    room.start().catch((e) => setError(String(e)));
    return () => {
      unsub();
      room.stop();
    };
  }, [room]);
  return {
    state: room.client ? room.view() : null,
    online: room.online,
    joinUrl: room.joinUrl,
    code: room.code,
    error,
  };
}
