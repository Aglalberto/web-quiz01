import { useEffect, useState } from 'preact/hooks';
import type { PublicState } from '../../shared/types';

export interface DrawStep {
  at: number; // ms desde o início da roleta
  idx: number; // índice do tema destacado
}

/**
 * Sequência da “roleta” do sorteio: começa rápida e vai desacelerando até parar no
 * tema sorteado. É determinística, então todos os celulares mostram a mesma coisa.
 */
export function drawSteps(count: number, finalIdx: number, totalMs: number): DrawStep[] {
  const times: number[] = [];
  let t = 0;
  let gap = 70;
  while (t + gap <= totalMs * 0.9) {
    times.push(t);
    t += gap;
    gap *= 1.13;
  }
  times.push(Math.min(t, totalMs * 0.9));
  const n = times.length;
  return times.map((at, k) => ({ at, idx: (((finalIdx - (n - 1 - k)) % count) + count) % count }));
}

/** Tempo (ms) desde o início da fase atual, no relógio do servidor; atualiza a cada `every` ms. */
export function usePhaseElapsed(state: PublicState, offset: number, every: number, active: boolean) {
  const start = state.deadline !== null && state.duration !== null ? state.deadline - state.duration : Date.now();
  const calc = () => Date.now() + offset - start;
  const [elapsed, setElapsed] = useState(calc);
  useEffect(() => {
    setElapsed(calc());
    if (!active) return;
    const id = setInterval(() => setElapsed(calc()), every);
    return () => clearInterval(id);
  }, [start, offset, every, active]);
  return elapsed;
}
