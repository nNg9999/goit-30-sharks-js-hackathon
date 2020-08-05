import detailPageTemplate from './detailsPage.hbs';

export default function (root, ...rest) {
  // Создаем всю разметку 
  const markup = detailPageTemplate();
  root.insertAdjacentHTML('beforeend', markup);





}