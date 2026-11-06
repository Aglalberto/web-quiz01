import { render } from 'preact';
import './styles.css';
import { TV } from './tv/TV';
import { Phone } from './phone/Phone';

const isPhone = location.pathname.startsWith('/play');
if (!isPhone) document.documentElement.classList.add('tv');

render(isPhone ? <Phone /> : <TV />, document.getElementById('app')!);
