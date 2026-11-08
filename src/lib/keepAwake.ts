// Mantém a tela da TV ligada durante o jogo, sem ninguém tocar no controle.
//
// Smart TVs (LG webOS, Samsung Tizen…) não entram em proteção de tela enquanto há um VÍDEO
// TOCANDO E VISÍVEL. Por isso a TV mostra uma faixa de luz animada na borda de baixo que é um
// vídeo de verdade (public/fundo.mp4, 320×180, 8 s em loop, ~40 KB). Ela é fininha porque a
// LG desenha vídeos numa camada própria, por cima da página: assim nunca cobre o jogo.
//
// Camadas de proteção:
//  1) faixa de vídeo visível, muda e em loop, com retomada automática se o navegador pausar;
//  2) Screen Wake Lock API, quando o navegador suporta (precisa de HTTPS — o GitHub Pages é);
//  3) se alguém apertar OK no controle, aproveita o gesto para tela cheia + reforçar 1 e 2.

type Sentinel = { release: () => Promise<void>; addEventListener?: (t: string, f: () => void) => void };

export interface AwakeStatus {
  wakeLock: string;
  video: string;
  restarts: number;
  browser: string;
  since: number;
}

export function keepScreenAwake(video: HTMLVideoElement, onStatus?: (s: AwakeStatus) => void) {
  const nav = navigator as Navigator & { wakeLock?: { request: (t: 'screen') => Promise<Sentinel> } };
  let sentinel: Sentinel | null = null;
  const status: AwakeStatus = {
    wakeLock: nav.wakeLock ? 'pedindo…' : 'não suportado',
    video: 'carregando…',
    restarts: 0,
    browser: (navigator.userAgent.match(/(Chrome|Chromium|Safari|Firefox)\/[\d.]+/) ?? ['?'])[0],
    since: Date.now(),
  };
  const report = () => onStatus?.({ ...status });

  let pending = false;
  const requestLock = async () => {
    if (!nav.wakeLock || sentinel || pending || document.visibilityState !== 'visible') return;
    pending = true;
    // algumas TVs (ex.: LG webOS 22) recebem o pedido e nunca respondem
    const noAnswer = setTimeout(() => {
      if (!sentinel) {
        status.wakeLock = 'sem resposta da TV (ignorado)';
        report();
      }
    }, 5000);
    try {
      sentinel = await nav.wakeLock.request('screen');
      status.wakeLock = 'ativo ✅';
      sentinel.addEventListener?.('release', () => {
        sentinel = null;
        status.wakeLock = 'liberado (pedindo de novo)';
        report();
      });
    } catch (e) {
      status.wakeLock = `negado (${(e as Error)?.name ?? 'erro'})`;
    } finally {
      pending = false;
      clearTimeout(noAnswer);
    }
    report();
  };

  const play = () => {
    video.muted = true;
    const p = video.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  };

  let lastTime = -1;
  const check = () => {
    if (document.visibilityState !== 'visible') return;
    if (video.error) status.video = `erro ${video.error.code}`;
    else if (video.paused || video.ended) {
      status.video = 'pausado → dando play';
      status.restarts++;
      play();
    } else if (video.currentTime === lastTime) {
      status.video = 'travado → reiniciando';
      status.restarts++;
      video.currentTime = 0;
      play();
    } else status.video = `tocando ✅ (${video.currentTime.toFixed(1)} s)`;
    lastTime = video.currentTime;
    void requestLock();
    report();
  };

  // qualquer pausa inesperada → play imediato
  const onPause = () => setTimeout(play, 300);
  video.addEventListener('pause', onPause);
  video.addEventListener('ended', play);
  video.addEventListener('stalled', play);

  // se alguém apertar um botão do controle, usa o gesto para tela cheia e reforço
  const onGesture = () => {
    const el = document.documentElement as HTMLElement & { webkitRequestFullscreen?: () => void };
    try {
      if (!document.fullscreenElement) (el.requestFullscreen?.() ?? el.webkitRequestFullscreen?.())?.catch?.(() => {});
    } catch {
      /* ignora */
    }
    play();
    void requestLock();
  };
  window.addEventListener('keydown', onGesture);
  window.addEventListener('pointerdown', onGesture);
  document.addEventListener('visibilitychange', check);

  play();
  void requestLock();
  const timer = setInterval(check, 10_000);
  setTimeout(check, 1500);

  return () => {
    clearInterval(timer);
    video.removeEventListener('pause', onPause);
    video.removeEventListener('ended', play);
    video.removeEventListener('stalled', play);
    window.removeEventListener('keydown', onGesture);
    window.removeEventListener('pointerdown', onGesture);
    document.removeEventListener('visibilitychange', check);
    void sentinel?.release().catch(() => {});
  };
}
