// Broker MQTT local (WebSocket) para desenvolvimento e testes, sem depender da internet.
// Uso: node scripts/broker.mjs [porta=8883]
import { createServer } from 'aedes-server-factory';
import aedesPkg from 'aedes';

export async function startBroker(port = 8883) {
  const aedes = aedesPkg.createBroker ? await aedesPkg.createBroker() : aedesPkg();
  const server = createServer(aedes, { ws: true });
  await new Promise((res) => server.listen(port, res));
  return {
    url: `ws://localhost:${port}`,
    close: () => new Promise((res) => server.close(() => aedes.close(res))),
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.argv[2]) || 8883;
  const b = await startBroker(port);
  console.log(`Broker MQTT local em ${b.url}`);
  console.log(`Abra a TV com: http://localhost:5173/?broker=${b.url}`);
}
