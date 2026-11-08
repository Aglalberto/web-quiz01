// Confete só no celular (a TV não carrega esta biblioteca).
import confetti from 'canvas-confetti';
import { PLAYER_COLORS } from '../../shared/types';

export function burst(big = false) {
  const colors = PLAYER_COLORS.map((c) => c.hex);
  confetti({ particleCount: big ? 220 : 90, spread: big ? 120 : 75, origin: { y: 0.6 }, colors, scalar: big ? 1.3 : 1 });
  if (big) {
    setTimeout(() => confetti({ particleCount: 120, angle: 60, spread: 70, origin: { x: 0 }, colors }), 250);
    setTimeout(() => confetti({ particleCount: 120, angle: 120, spread: 70, origin: { x: 1 }, colors }), 400);
  }
}
