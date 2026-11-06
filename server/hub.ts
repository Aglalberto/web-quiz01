import type { WebSocket } from 'ws';
import { Game } from '../shared/game';
import type { ClientMsg, ServerMsg } from '../shared/types';

interface Conn {
  ws: WebSocket;
  role: 'tv' | 'player' | 'unknown';
  playerId: string | null;
  alive: boolean;
}

/** Liga as conexões WebSocket à máquina de estados do jogo. */
export class Hub {
  private conns = new Set<Conn>();
  private timer: ReturnType<typeof setTimeout> | null = null;
  private heartbeat: ReturnType<typeof setInterval>;

  constructor(
    private game: Game,
    private joinUrl: () => string,
    private now: () => number = Date.now,
  ) {
    // detecta celulares que apagaram a tela / perderam o Wi-Fi
    this.heartbeat = setInterval(() => {
      for (const c of this.conns) {
        if (!c.alive) {
          c.ws.terminate();
          continue;
        }
        c.alive = false;
        try {
          c.ws.ping();
        } catch {
          /* ignora */
        }
      }
    }, 10_000);
  }

  close() {
    clearInterval(this.heartbeat);
    if (this.timer) clearTimeout(this.timer);
  }

  add(ws: WebSocket) {
    const conn: Conn = { ws, role: 'unknown', playerId: null, alive: true };
    this.conns.add(conn);
    ws.on('pong', () => (conn.alive = true));
    ws.on('message', (data) => {
      conn.alive = true;
      let msg: ClientMsg;
      try {
        msg = JSON.parse(String(data));
      } catch {
        return;
      }
      this.handle(conn, msg);
    });
    // quem acabou de abrir a página já vê a sala (contagem de jogadores etc.)
    this.send(conn, { type: 'state', state: this.game.view(this.joinUrl(), this.now()) });
    ws.on('close', () => {
      this.conns.delete(conn);
      if (conn.playerId && !this.isConnected(conn.playerId)) {
        this.game.disconnect(conn.playerId, this.now());
        this.changed();
      }
    });
  }

  private isConnected(playerId: string) {
    for (const c of this.conns) if (c.playerId === playerId) return true;
    return false;
  }

  private send(conn: Conn, msg: ServerMsg) {
    if (conn.ws.readyState === conn.ws.OPEN) conn.ws.send(JSON.stringify(msg));
  }

  private handle(conn: Conn, msg: ClientMsg) {
    const g = this.game;
    const now = this.now();
    const me = conn.playerId;
    switch (msg.type) {
      case 'hello':
        conn.role = 'tv';
        break;
      case 'resume': {
        if (g.resume(msg.playerId)) {
          conn.role = 'player';
          conn.playerId = msg.playerId;
          this.send(conn, { type: 'joined', playerId: msg.playerId });
        } else {
          this.send(conn, { type: 'error', code: 'unknown', message: 'Jogador não encontrado' });
          return;
        }
        break;
      }
      case 'join': {
        const res = g.join(msg.name, msg.playerId);
        if (!res.ok) {
          this.send(conn, {
            type: 'error',
            code: res.code,
            message: res.code === 'full' ? 'A sala está cheia (8 jogadores)!' : 'Digite seu nome 😉',
          });
          return;
        }
        conn.role = 'player';
        conn.playerId = res.id;
        this.send(conn, { type: 'joined', playerId: res.id });
        break;
      }
      case 'vote':
        if (me) g.vote(me, msg.themeId, now);
        break;
      case 'answer':
        if (me) g.answer(me, msg.index, now);
        break;
      case 'start':
        if (me) g.start(me, now);
        break;
      case 'skip':
        if (me) g.skip(me, now);
        break;
      case 'playAgain':
        if (me) g.playAgain(me, now);
        break;
      case 'endGame':
        if (me) g.endGame(me);
        break;
      case 'kick':
        if (me && g.kick(me, msg.playerId, now)) {
          for (const c of this.conns) {
            if (c.playerId === msg.playerId) {
              this.send(c, { type: 'kicked' });
              c.playerId = null;
              c.role = 'unknown';
            }
          }
        }
        break;
      default:
        return;
    }
    this.changed();
  }

  /** Re-envia o estado e reprograma o timer da fase. */
  changed() {
    this.broadcast();
    this.schedule();
  }

  private schedule() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    const deadline = this.game.deadline;
    if (deadline === null) return;
    const wait = Math.max(0, deadline - this.now());
    this.timer = setTimeout(() => {
      this.timer = null;
      this.game.tick(this.now());
      this.changed();
    }, wait + 20);
  }

  private broadcast() {
    const state = this.game.view(this.joinUrl(), this.now());
    for (const c of this.conns) {
      if (c.role !== 'player' || !c.playerId) this.send(c, { type: 'state', state });
      else {
        this.send(c, {
          type: 'state',
          state,
          meId: c.playerId,
          myChoice: this.game.choiceOf(c.playerId),
        });
      }
    }
  }
}
