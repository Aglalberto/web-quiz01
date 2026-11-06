import type { RawQuestion } from './_types';
import filmes from './filmes';
import animesClassicos from './animes-classicos';
import animesModernos from './animes-modernos';
import desenhosClassicos from './desenhos-classicos';
import mundoGeek from './mundo-geek';
import games from './games';
import consoles from './consoles';
import musica from './musica';
import celebridades from './celebridades';
import blindItems from './blind-items';
import natureza from './natureza';
import animais from './animais';
import historia from './historia';
import paises from './paises';
import culturas from './culturas';
import religiao from './religiao';
import brasil from './brasil';
import carros from './carros';
import disney from './disney';
import pixar from './pixar';
import dreamworks from './dreamworks';
import warner from './warner';

/** Banco completo, indexado pelo id do tema (ver shared/themes.ts) */
export const BANK: Record<string, RawQuestion[]> = {
  filmes,
  'animes-classicos': animesClassicos,
  'animes-modernos': animesModernos,
  'desenhos-classicos': desenhosClassicos,
  'mundo-geek': mundoGeek,
  games,
  consoles,
  musica,
  celebridades,
  'blind-items': blindItems,
  natureza,
  animais,
  historia,
  paises,
  culturas,
  religiao,
  brasil,
  carros,
  disney,
  pixar,
  dreamworks,
  warner,
};
