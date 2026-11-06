import mqtt, { type MqttClient } from 'mqtt';

/**
 * Servidores MQTT públicos e gratuitos (WebSocket seguro). Funcionam como “carteiro”:
 * a TV e os celulares trocam mensagens por eles, sem precisar de servidor próprio.
 * A TV escolhe o primeiro que responder e passa o índice no QR Code.
 */
export const BROKERS = [
  'wss://broker.emqx.io:8084/mqtt',
  'wss://broker.hivemq.com:8884/mqtt',
  'wss://mqtt.eclipseprojects.io:443/mqtt',
  'wss://test.mosquitto.org:8081/mqtt',
];

const PREFIX = 'quizparty-br/v1';

export const topics = (room: string) => ({
  state: `${PREFIX}/${room}/state`,
  up: `${PREFIX}/${room}/up`,
  to: (playerId: string) => `${PREFIX}/${room}/to/${playerId}`,
});

/** URL do broker: ?broker=… (testes) ou índice ?s=N da lista */
export function brokerFromUrl(params: URLSearchParams): string | null {
  const custom = params.get('broker');
  if (custom) return custom;
  const idx = params.get('s');
  if (idx !== null && BROKERS[Number(idx)]) return BROKERS[Number(idx)];
  return null;
}

export function randomId(len = 12) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  const cryptoObj = typeof crypto !== 'undefined' ? crypto : undefined;
  if (cryptoObj?.getRandomValues) {
    const buf = new Uint8Array(len);
    cryptoObj.getRandomValues(buf);
    for (const b of buf) out += chars[b % chars.length];
  } else {
    for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

/** Código da sala: letras fáceis de ler (sem 0/O, 1/I/L) */
export function roomCode() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 5; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export function connect(url: string): MqttClient {
  const client = mqtt.connect(url, {
    clientId: `qp_${randomId(10)}`,
    keepalive: 20,
    reconnectPeriod: 1500,
    connectTimeout: 8000,
    clean: true,
    resubscribe: true,
  });
  client.on('error', () => {
    /* reconexão automática cuida disso */
  });
  return client;
}

/** Tenta os brokers em ordem e devolve o primeiro que conectar. */
export function connectFirst(urls: string[], timeoutMs = 7000): Promise<{ client: MqttClient; url: string }> {
  return new Promise((resolve, reject) => {
    let i = 0;
    const next = () => {
      if (i >= urls.length) {
        i = 0; // recomeça a lista até conseguir
      }
      const url = urls[i++];
      const client = connect(url);
      const timer = setTimeout(() => {
        client.end(true);
        next();
      }, timeoutMs);
      client.once('connect', () => {
        clearTimeout(timer);
        resolve({ client, url });
      });
    };
    if (!urls.length) reject(new Error('sem brokers'));
    else next();
  });
}
