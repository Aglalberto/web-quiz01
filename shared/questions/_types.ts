/**
 * Formato de uma pergunta do banco.
 * - `a`: resposta CORRETA
 * - `w`: exatamente 3 alternativas ERRADAS (plausíveis, distintas de `a`)
 * - `fact`: curiosidade curta mostrada na revelação (opcional)
 * - `sub`: subcategoria (usado em Música: rock, pop, kpop, metal, mpb, sertanejo, brega, dance, disco, anos80, anos2000)
 * O servidor embaralha as alternativas a cada partida.
 */
export interface RawQuestion {
  q: string;
  a: string;
  w: [string, string, string];
  fact?: string;
  sub?: string;
}
