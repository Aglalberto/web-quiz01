import { useEffect, useRef, useState } from 'preact/hooks';
import type { MqttClient } from 'mqtt';
import type { ClientMsg, DirectMsg, PublicState, UpEnvelope } from '../../shared/types';
import { BROKERS, brokerFromUrl, connect, randomId, topics } from './mqtt';

const NAME_KEY = 'quizparty:name';
const idKey = (room: string) => `quizparty:id:${room}`;
const PING_EVERY = 4_000;
const TV_SILENCE = 10_000; // sem notícias da TV por 10 s = TV desconectada

function lsGet(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function lsSet(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* ignora */
  }
}

export const savedName = {
  get: () => lsGet(NAME_KEY) ?? '',
  set: (v: string) => lsSet(NAME_KEY, v),
};

export interface Connection {
  room: string;
  state: PublicState | null;
  /** conectado ao broker */
  online: boolean;
  /** a TV está respondendo */
  tvOnline: boolean;
  meId: string;
  /** já enviou o nome nesta sala */
  joined: boolean;
  error: string | null;
  kicked: boolean;
  offset: number;
  send: (msg: ClientMsg) => void;
  join: (name: string) => void;
  clearError: () => void;
  rejoin: () => void;
}

/** Conexão do celular com a sala (via broker MQTT). */
export function usePlayerConnection(): Connection {
  const params = new URLSearchParams(location.search);
  const room = (params.get('sala') ?? '').toUpperCase();
  const brokerUrl = brokerFromUrl(params) ?? BROKERS[0];

  const [meId, setMeId] = useState(() => {
    let id = lsGet(idKey(room));
    if (!id) {
      id = randomId(16);
      lsSet(idKey(room), id);
    }
    return id;
  });
  const [state, setState] = useState<PublicState | null>(null);
  const [online, setOnline] = useState(false);
  const [lastLive, setLastLive] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [joined, setJoined] = useState(() => lsGet(`${idKey(room)}:joined`) === '1');
  const [error, setError] = useState<string | null>(null);
  const [kicked, setKicked] = useState(false);
  const [offset, setOffset] = useState(0);
  const clientRef = useRef<MqttClient | null>(null);
  const meRef = useRef(meId);
  meRef.current = meId;

  const t = topics(room);

  const send = (msg: ClientMsg) => {
    const c = clientRef.current;
    if (!c?.connected) return;
    const env: UpEnvelope = { from: meRef.current, msg };
    c.publish(t.up, JSON.stringify(env), { qos: 0 });
  };

  useEffect(() => {
    if (!room) return;
    const client = connect(brokerUrl);
    clientRef.current = client;
    let directTopic = t.to(meRef.current);

    client.on('connect', () => {
      setOnline(true);
      directTopic = t.to(meRef.current);
      client.subscribe([t.state, directTopic], { qos: 0 });
      send({ type: 'ping' });
    });
    client.on('close', () => setOnline(false));
    client.on('offline', () => setOnline(false));
    client.on('message', (topic, payload, packet) => {
      try {
        const data = JSON.parse(payload.toString());
        if (topic === t.state) {
          const s = data as PublicState;
          setState(s);
          // mensagens "retidas" podem ser antigas: só as ao vivo provam que a TV está ligada
          if (!packet.retain) {
            setLastLive(Date.now());
            setOffset(s.serverNow - Date.now());
          }
        } else if (topic === directTopic) {
          const msg = data as DirectMsg;
          if (msg.type === 'error') setError(msg.message);
          if (msg.type === 'kicked') {
            setKicked(true);
            setJoined(false);
            lsSet(`${idKey(room)}:joined`, null);
          }
        }
      } catch {
        /* ignora */
      }
    });

    const ping = setInterval(() => send({ type: 'ping' }), PING_EVERY);
    const tick = setInterval(() => setNow(Date.now()), 1000);
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      if (!client.connected) client.reconnect();
      else send({ type: 'ping' });
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(ping);
      clearInterval(tick);
      document.removeEventListener('visibilitychange', onVisible);
      client.end(true);
    };
  }, [room, brokerUrl, meId]);

  return {
    room,
    state,
    online,
    tvOnline: online && now - lastLive < TV_SILENCE,
    meId,
    joined,
    error,
    kicked,
    offset,
    send,
    join: (name: string) => {
      setError(null);
      setJoined(true);
      lsSet(`${idKey(room)}:joined`, '1');
      send({ type: 'join', name });
    },
    clearError: () => setError(null),
    rejoin: () => {
      // novo id para voltar como jogador novo
      const id = randomId(16);
      lsSet(idKey(room), id);
      lsSet(`${idKey(room)}:joined`, null);
      setKicked(false);
      setJoined(false);
      setMeId(id);
    },
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
