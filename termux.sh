#!/data/data/com.termux/files/usr/bin/bash
# Instalador do Quiz Party para Android (Termux).
# Uso (uma vez):  curl -L https://raw.githubusercontent.com/Aglalberto/web-quiz01/HEAD/termux.sh | bash
# Depois, para jogar, é só digitar:  quiz

# Tudo dentro de uma função: o bash lê o script inteiro antes de executar
# (evita que o "pkg" consuma o resto do script quando vem por "curl | bash").
main() {
  set -e
  echo ""
  echo "🎉 Instalando o Quiz Party..."
  echo ""

  echo "📦 Atualizando o Termux (pode demorar alguns minutos)..."
  yes | pkg upgrade -y </dev/null >/dev/null 2>&1 || true
  pkg install -y nodejs git net-tools </dev/null

  cd "$HOME"
  if [ -d web-quiz01/.git ]; then
    echo "🔄 Atualizando o jogo..."
    git -C web-quiz01 pull --ff-only
  else
    echo "⬇️  Baixando o jogo..."
    git clone https://github.com/Aglalberto/web-quiz01.git
  fi

  # cria o comando "quiz"
  cat > "$PREFIX/bin/quiz" <<'QUIZ'
#!/data/data/com.termux/files/usr/bin/bash
cd "$HOME/web-quiz01" || { echo "Jogo não encontrado. Rode o instalador de novo."; exit 1; }
echo "🔄 Procurando atualizações..."
timeout 20 git pull --ff-only -q 2>/dev/null || echo "   (sem internet agora — usando a versão já baixada)"
command -v termux-wake-lock >/dev/null 2>&1 && termux-wake-lock
echo "   Para desligar o jogo: toque em CTRL e depois na tecla C."
node release/server.cjs
QUIZ
  chmod +x "$PREFIX/bin/quiz"

  echo ""
  echo "✅ Pronto! Para começar o jogo, digite:  quiz"
  echo ""
}

main "$@"
