import headerTemplate from './header.hbs';
import './header.scss';

const refs = {
  header: document.querySelector('#js-header'),
};
const markup = headerTemplate();
refs.header.insertAdjacentHTML('beforeend', markup);

console.log(headerTemplate());
