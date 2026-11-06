// Efeitos sonoros sintetizados com WebAudio (sem arquivos). Tocam só nos celulares.
let ctx: AudioContext | null = null;

/** Precisa ser chamado dentro de um toque do usuário (ex.: botão Entrar). */
export function unlockAudio() {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!ctx) ctx = new AC();
    if (ctx.state === 'suspended') void ctx.resume();
  } catch {
    ctx = null;
  }
}

// Qualquer toque na tela também libera o áudio (útil após recarregar a página)
if (typeof window !== 'undefined') {
  const once = () => unlockAudio();
  window.addEventListener('pointerdown', once, { passive: true });
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.18, slideTo?: number) {
  if (!ctx) return;
  const t0 = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

export const sfx = {
  pop: () => tone(520, 0, 0.12, 'triangle', 0.2, 900),
  tap: () => tone(700, 0, 0.08, 'square', 0.08),
  join: () => {
    [523, 659, 784].forEach((f, i) => tone(f, i * 0.08, 0.18, 'triangle'));
  },
  tick: () => tone(1200, 0, 0.05, 'square', 0.06),
  correct: () => {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.25, 'triangle', 0.2));
    tone(1568, 0.38, 0.35, 'sine', 0.12);
  },
  wrong: () => {
    tone(330, 0, 0.22, 'sawtooth', 0.1, 220);
    tone(220, 0.2, 0.35, 'sawtooth', 0.1, 140);
  },
  whoosh: () => tone(200, 0, 0.35, 'sine', 0.12, 900),
  win: () => {
    const notes = [523, 523, 523, 659, 784, 659, 784, 1047];
    notes.forEach((f, i) => tone(f, i * 0.13, 0.22, 'square', 0.1));
    tone(1047, notes.length * 0.13, 0.7, 'triangle', 0.18);
  },
  lose: () => {
    [392, 370, 349, 330].forEach((f, i) => tone(f, i * 0.22, 0.3, 'triangle', 0.14));
  },
};
