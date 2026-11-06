import { useEffect, useRef, useState } from 'preact/hooks';
import type { ClientMsg, PublicState, ServerMsg } from '../../shared/types';

const ID_KEY = 'quizparty:id';
const NAME_KEY = 'quizparty:name';

export const storage = {
  get id() {
    try {
      return localStorage.getItem(ID_KEY);
    } catch {
      return null;
    }
  },
  set id(v: string | null) {
    try {
      if (v) localStorage.setItem(ID_KEY, v);
      else localStorage.removeItem(ID_KEY);
    } catch {
      /* ignora */
    }
  },
  get name() {
    try {
      return localStorage.getItem(NAME_KEY) ?? '';
    } catch {
      return '';
    }
  },
  set name(v: string) {
    try {
      localStorage.setItem(NAME_KEY, v);
    } catch {
      /* ignora */
    }
  },
};

export interface Connection {
  state: PublicState | null;
  online: boolean;
  meId: string | null;
  myChoice: number | null;
  error: string | null;
  kicked: boolean;
  /** diferença relógio servidor − relógio local (ms) */
  offset: number;
  send: (msg: ClientMsg) => void;
  clearError: () => void;
}

/** WebSocket com reconexão automática. role 'tv' anuncia a TV; 'player' tenta retomar pelo id salvo. */
export function useConnection(role: 'tv' | 'player', onMessage?: (msg: ServerMsg) => void): Connection {
  const [state, setState] = useState<PublicState | null>(null);
  const [online, setOnline] = useState(false);
  const [meId, setMeId] = useState<string | null>(null);
  const [myChoice, setMyChoice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [kicked, setKicked] = useState(false);
  const [offset, setOffset] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const cbRef = useRef(onMessage);
  cbRef.current = onMessage;

  useEffect(() => {
    let closed = false;
    let retry = 0;
    let timer: ReturnType<typeof setTimeout>;

    const connect = () => {
      const proto = location.protocol === 'https:' ? 'wss' : 'ws';
      const ws = new WebSocket(`${proto}://${location.host}/ws`);
      wsRef.current = ws;
      ws.onopen = () => {
        retry = 0;
        setOnline(true);
        if (role === 'tv') ws.send(JSON.stringify({ type: 'hello', role: 'tv' } satisfies ClientMsg));
        else if (storage.id) ws.send(JSON.stringify({ type: 'resume', playerId: storage.id } satisfies ClientMsg));
      };
      ws.onmessage = (ev) => {
        const msg = JSON.parse(ev.data) as ServerMsg;
        switch (msg.type) {
          case 'state':
            setOffset(msg.state.serverNow - Date.now());
            setState(msg.state);
            if (msg.meId !== undefined) setMeId(msg.meId);
            setMyChoice(msg.myChoice ?? null);
            break;
          case 'joined':
            storage.id = msg.playerId;
            setMeId(msg.playerId);
            setKicked(false);
            setError(null);
            break;
          case 'error':
            if (msg.code === 'unknown') {
              storage.id = null;
              setMeId(null);
            } else setError(msg.message);
            break;
          case 'kicked':
            storage.id = null;
            setMeId(null);
            setKicked(true);
            break;
        }
        cbRef.current?.(msg);
      };
      ws.onclose = () => {
        setOnline(false);
        if (closed) return;
        retry++;
        timer = setTimeout(connect, Math.min(4000, 400 * retry));
      };
    };
    connect();

    // ao voltar para a aba (tela desbloqueada), reconecta na hora
    const onVisible = () => {
      if (document.visibilityState === 'visible' && wsRef.current?.readyState !== WebSocket.OPEN) {
        clearTimeout(timer);
        wsRef.current?.close();
        connect();
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      closed = true;
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
      wsRef.current?.close();
    };
  }, [role]);

  return {
    state,
    online,
    meId,
    myChoice,
    error,
    kicked,
    offset,
    send: (msg) => {
      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg));
    },
    clearError: () => setError(null),
  };
}

/** Segundos restantes da fase atual (atualiza ~10x por segundo). */
export function useCountdown(deadline: number | null, offset: number) {
  const [now, setNow] = useState(() => Date.now() + offset);
  useEffect(() => {
    if (deadline === null) return;
    const id = setInterval(() => setNow(Date.now() + offset), 100);
    setNow(Date.now() + offset);
    return () => clearInterval(id);
  }, [deadline, offset]);
  if (deadline === null) return { msLeft: 0, secLeft: 0 };
  const msLeft = Math.max(0, deadline - now);
  return { msLeft, secLeft: Math.ceil(msLeft / 1000) };
}
