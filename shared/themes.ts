export interface Theme {
  id: string;
  name: string;
  emoji: string;
  /** cor de fundo do cartão do tema (hex) */
  color: string;
}

export const THEMES: Theme[] = [
  { id: 'filmes', name: 'Filmes', emoji: '🎬', color: '#ef4444' },
  { id: 'animes-classicos', name: 'Animes Clássicos', emoji: '🐉', color: '#f97316' },
  { id: 'animes-modernos', name: 'Animes Modernos', emoji: '⚔️', color: '#ec4899' },
  { id: 'desenhos-classicos', name: 'Desenhos Clássicos', emoji: '📺', color: '#eab308' },
  { id: 'mundo-geek', name: 'Mundo Geek', emoji: '🤓', color: '#6366f1' },
  { id: 'games', name: 'Games', emoji: '🎮', color: '#8b5cf6' },
  { id: 'consoles', name: 'Consoles', emoji: '🕹️', color: '#0ea5e9' },
  { id: 'musica', name: 'Música', emoji: '🎸', color: '#d946ef' },
  { id: 'celebridades', name: 'Celebridades', emoji: '🌟', color: '#f59e0b' },
  { id: 'blind-items', name: 'Blind Items', emoji: '🕶️', color: '#64748b' },
  { id: 'natureza', name: 'Natureza', emoji: '🌿', color: '#22c55e' },
  { id: 'animais', name: 'Animais', emoji: '🦁', color: '#f97316' },
  { id: 'historia', name: 'História', emoji: '🏛️', color: '#a16207' },
  { id: 'paises', name: 'Países', emoji: '🌍', color: '#06b6d4' },
  { id: 'culturas', name: 'Culturas', emoji: '🎎', color: '#e11d48' },
  { id: 'religiao', name: 'Religião', emoji: '🕊️', color: '#0284c7' },
  { id: 'brasil', name: 'Brasil', emoji: '🇧🇷', color: '#16a34a' },
  { id: 'carros', name: 'Carros', emoji: '🏎️', color: '#dc2626' },
  { id: 'disney', name: 'Disney', emoji: '🏰', color: '#2563eb' },
  { id: 'pixar', name: 'Pixar', emoji: '💡', color: '#0891b2' },
  { id: 'dreamworks', name: 'DreamWorks', emoji: '🌙', color: '#7c3aed' },
  { id: 'warner', name: 'Warner Bros.', emoji: '🐰', color: '#1d4ed8' },
];

export const MUSIC_SUBS: Record<string, string> = {
  rock: 'Rock',
  pop: 'Pop',
  kpop: 'K-pop',
  metal: 'Metal',
  mpb: 'MPB',
  sertanejo: 'Sertanejo',
  brega: 'Brega',
  dance: 'Dance Classics',
  disco: 'Disco',
  anos80: 'Anos 80',
  anos2000: 'Anos 2000',
};

export const themeById = (id: string) => THEMES.find((t) => t.id === id);
