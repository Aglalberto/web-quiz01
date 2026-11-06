import { render } from 'preact';
import './styles.css';
import { TV } from './tv/TV';
import { Phone } from './phone/Phone';

// Com ?sala=XXXXX é um celular (veio do QR Code); sem, é a TV.
const isPhone = new URLSearchParams(location.search).has('sala');
if (!isPhone) document.documentElement.classList.add('tv');

render(isPhone ? <Phone /> : <TV />, document.getElementById('app')!);
