# 🎉 Quiz Party

Quiz multiplayer para festas, com até **8 jogadores**. A **TV** mostra o jogo e cada **celular** é o controle: os jogadores leem o QR Code, digitam o nome e jogam.

Roda direto pelo **GitHub Pages**. Não precisa instalar nada nem manter servidor: basta abrir o link no navegador da TV.

- O primeiro a entrar vira o **host** 👑. Ele começa a partida, pode pular uma etapa, remover jogadores e iniciar outra partida, tudo pelo celular. O host também joga.
- A cada rodada, **3 temas** são sorteados e todos votam no celular. O tema vencedor rende **3 perguntas**.
- Todos respondem ao mesmo tempo, com 15 segundos por pergunta. Cada acerto vale +1.
- Vence quem chegar primeiro a **15 acertos**. Se dois ou mais chegarem juntos, há **morte súbita** ☠️.
- O jogo mostra sequências de acertos 🔥, sons no celular e confete.
- São **740 perguntas** em 22 temas. O tema Música tem 11 gêneros, com 10 perguntas cada.

A TV é só tela: não há nada para clicar nela.

---

## 📺 Como jogar

1. No **navegador da Smart TV**, abra: **https://aglalberto.github.io/web-quiz01/**
2. Aparece o QR Code com o código da sala.
3. Cada jogador aponta a câmera do celular para o QR, digita o nome e entra.
4. O host toca em **COMEÇAR!** no celular.

Todos os aparelhos precisam de **internet**, mas não precisam estar na mesma rede: dá para jogar até com o 4G do celular.

**Se a TV recarregar a página**, a partida continua de onde parou: a mesma sala, os mesmos jogadores e o mesmo placar. Para começar uma sala nova do zero, abra o endereço com `?nova` no final (`.../web-quiz01/?nova`).

### Como funciona por dentro

A própria TV é o “servidor”: as regras do jogo rodam no navegador dela. TV e celulares trocam mensagens por um **servidor MQTT público e gratuito**, que funciona como um carteiro (EMQX, HiveMQ, Eclipse ou Mosquitto). A TV usa o primeiro que responder e informa qual é no QR Code.

---

## 🚀 Publicação (GitHub Pages)

A cada `push`, o GitHub Actions roda os testes, gera o site e publica (`.github/workflows/pages.yml`).

**Configuração única:** no GitHub, abra *Settings › Pages* e, em **Source**, escolha **GitHub Actions**.

## ⚙️ Opções na URL da TV

| Parâmetro | Exemplo | Para quê |
|---|---|---|
| `vitoria` | `?vitoria=10` | Acertos para vencer (padrão 15) |
| `nova` | `?nova` | Ignora a partida salva e cria outra sala |
| `fast` | `?fast=1` | Tempos curtos (para testes) |
| `broker` | `?broker=ws://localhost:8883` | Usa outro servidor MQTT (para testes) |

---

## 🛠️ Desenvolvimento

```sh
npm install
npm run broker     # servidor MQTT local (ws://localhost:8883)
npm run dev        # abra http://localhost:5173/?broker=ws://localhost:8883
npm test           # testes da lógica do jogo e do banco de perguntas
npm run build      # gera dist/ (o site)
npm run e2e        # partida completa automatizada no navegador (gera ./screenshots)
```

Estrutura:

- `shared/game.ts`: regras do jogo (máquina de estados pura e testável)
- `shared/questions/*.ts`: perguntas, um arquivo por tema (`{ q, a: correta, w: [3 erradas], fact }`)
- `shared/themes.ts`: lista de temas (nome, emoji, cor)
- `src/net/host.ts`: a “sala” que roda na TV (regras + comunicação + salvamento)
- `src/net/client.ts`: conexão do celular
- `src/tv/`: tela da TV
- `src/phone/`: tela do celular (controle)

Para adicionar perguntas, edite o arquivo do tema em `shared/questions/` e rode `npm test`. A publicação acontece sozinha no próximo `push`.

O visual foi feito para funcionar em navegadores de Smart TV mais antigos (Chromium 69+): Tailwind v3, código compilado para ES2017 e sem `gap` em layouts flex na tela da TV.
