import { render } from 'preact';
import './styles.css';

// Com ?sala=XXXXX é um celular (veio do QR Code); sem, é a TV.
// Cada tela carrega só o próprio código: a TV não baixa a parte do celular e
// o celular não baixa o banco de perguntas (que só a TV usa).
const isPhone = new URLSearchParams(location.search).has('sala');
const root = document.getElementById('app')!;

if (isPhone) {
  void import('./phone/Phone').then(({ Phone }) => render(<Phone />, root));
} else {
  document.documentElement.classList.add('tv');
  void import('./tv/TV').then(({ TV }) => render(<TV />, root));
}
