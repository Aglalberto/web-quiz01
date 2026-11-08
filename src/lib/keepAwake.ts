// Mantém a tela da TV ligada durante o jogo (sem ninguém tocar no controle).
// 1) Screen Wake Lock API, quando o navegador suporta (precisa de HTTPS — o GitHub Pages é).
// 2) Reserva: um vídeo minúsculo, mudo e invisível tocando em loop. A maioria das Smart TVs
//    não entra em proteção de tela enquanto há vídeo tocando.
import media from 'nosleep.js/src/media.js';

type Sentinel = { release: () => Promise<void>; addEventListener?: (t: string, f: () => void) => void };

export function keepScreenAwake() {
  let sentinel: Sentinel | null = null;
  const nav = navigator as Navigator & { wakeLock?: { request: (t: 'screen') => Promise<Sentinel> } };

  const requestLock = async () => {
    if (!nav.wakeLock || document.visibilityState !== 'visible') return;
    try {
      sentinel = await nav.wakeLock.request('screen');
      sentinel.addEventListener?.('release', () => (sentinel = null));
    } catch {
      /* sem permissão ou sem suporte: o vídeo cobre */
    }
  };

  const video = document.createElement('video');
  video.muted = true;
  video.loop = true;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('aria-hidden', 'true');
  // tela cheia, atrás de tudo e praticamente transparente: algumas TVs ignoram vídeos minúsculos
  Object.assign(video.style, {
    position: 'fixed',
    left: '0',
    top: '0',
    width: '100vw',
    height: '100vh',
    objectFit: 'cover',
    opacity: '0.01',
    zIndex: '-1',
    pointerEvents: 'none',
  });
  const webm = document.createElement('source');
  webm.src = media.webm;
  webm.type = 'video/webm';
  const mp4 = document.createElement('source');
  mp4.src = media.mp4;
  mp4.type = 'video/mp4';
  video.append(webm, mp4);
  document.body.appendChild(video);

  const playVideo = () => {
    const p = video.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  };

  const onVisible = () => {
    if (document.visibilityState !== 'visible') return;
    if (!sentinel) void requestLock();
    playVideo();
  };

  void requestLock();
  playVideo();
  document.addEventListener('visibilitychange', onVisible);
  // alguns navegadores pausam o vídeo ou soltam a trava sozinhos: reforça de tempos em tempos
  const timer = setInterval(onVisible, 30_000);

  return () => {
    clearInterval(timer);
    document.removeEventListener('visibilitychange', onVisible);
    void sentinel?.release().catch(() => {});
    video.pause();
    video.remove();
  };
}
