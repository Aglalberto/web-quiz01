# 🎉 Quiz Party

Quiz multiplayer para festas, com até **8 jogadores**. A **TV** mostra o jogo e cada **celular** é o controle: os jogadores leem o QR Code, digitam o nome e jogam.

- O primeiro a entrar vira o **host** 👑. Ele começa a partida, pode pular uma etapa, remover jogadores e iniciar outra partida, tudo pelo celular. O host também joga.
- A cada rodada, **3 temas** são sorteados e todos votam no celular. O tema vencedor rende **3 perguntas**.
- Todos respondem ao mesmo tempo, com 15 segundos por pergunta. Cada acerto vale +1.
- Vence quem chegar primeiro a **15 acertos**. Se dois ou mais chegarem juntos, há **morte súbita** ☠️.
- O jogo mostra sequências de acertos 🔥, sons no celular e confete.
- São **740 perguntas** em 22 temas. O tema Música tem 11 gêneros, com 10 perguntas cada.

A TV é só tela: não há nada para clicar nela.

---

## 📱 Rodar com um celular Android como servidor (Termux)

**Instalação (só uma vez):**

1. Instale o **Termux** pelo [F-Droid](https://f-droid.org/packages/com.termux/). A versão da Play Store é antiga e não funciona.
2. Abra o Termux e digite esta linha (tudo junto):
   ```sh
   curl -L https://raw.githubusercontent.com/Aglalberto/web-quiz01/HEAD/termux.sh | bash
   ```
   O comando instala o Node.js, baixa o jogo e cria o comando `quiz`. Demora alguns minutos.

**Para jogar (sempre):**

1. Conecte o celular servidor, a TV e os celulares dos jogadores **no mesmo Wi-Fi**. Outra opção é ligar o **roteador de internet (hotspot)** no celular servidor e conectar todos nele.
2. No Termux, digite `quiz`.
3. O terminal mostra o endereço, por exemplo `📺 Abra na TV: http://192.168.0.12:3000`.
4. Abra esse endereço no **navegador da TV**. O QR Code aparece e os jogadores entram.
5. Para desligar: toque em **CTRL** (na barra de teclas extras do Termux) e depois em **C**.

Dicas:
- Deixe o Termux aberto, ou em segundo plano, durante o jogo. O comando `quiz` já pede ao Android para não pausar o servidor (*wake lock*). Se o jogo cair quando a tela apaga, tire o Termux da economia de bateria: *Configurações › Apps › Termux › Bateria › Sem restrições*.
- Se o terminal não mostrar o IP, veja em *Configurações › Wi-Fi › (sua rede) › Endereço IP* e abra `http://SEU-IP:3000` na TV.
- O `quiz` baixa as atualizações do jogo sozinho quando há internet.

## 💻 Rodar num PC/notebook

Funciona da mesma forma, com Node.js 18 ou mais novo:

```sh
node release/server.cjs
```

## ⚙️ Opções (variáveis de ambiente)

| Variável | Padrão | Para quê |
|---|---|---|
| `PORT` | `3000` | Porta do servidor |
| `WIN_SCORE` | `15` | Acertos para vencer |
| `PUBLIC_HOST` | automático | Força o IP ou nome usado no QR Code |
| `FAST` | – | `FAST=1` deixa os tempos curtos (para testes) |

Exemplo: `WIN_SCORE=10 node release/server.cjs`

---

## 🛠️ Desenvolvimento

```sh
npm install
npm run dev        # servidor + Vite com hot reload (abra http://localhost:5173)
npm test           # testes da lógica do jogo e do banco de perguntas
npm run build      # gera release/ (site + server.cjs)
npm run e2e        # partida completa automatizada no navegador (gera ./screenshots)
```

Estrutura:

- `shared/game.ts`: regras do jogo (máquina de estados pura, testável e independente do servidor)
- `shared/questions/*.ts`: perguntas, um arquivo por tema (`{ q, a: correta, w: [3 erradas], fact }`)
- `shared/themes.ts`: lista de temas (nome, emoji, cor)
- `server/`: servidor Node (HTTP + WebSocket)
- `src/tv/`: tela da TV
- `src/phone/`: tela do celular (controle)

Para adicionar perguntas, edite o arquivo do tema em `shared/questions/` e rode `npm test && npm run build`.

## ☁️ Próximo passo: Cloudflare

A lógica do jogo (`shared/game.ts`) não depende do servidor Node. Para publicar na internet com Cloudflare Workers + Durable Objects, basta escrever um adaptador equivalente a `server/hub.ts`. Isso fica para quando houver acesso à conta.
