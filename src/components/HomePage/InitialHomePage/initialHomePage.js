"use strict";

import initialHomePageTemplate from './initialHomePage.hbs';

export default function (root, ...rest) {
  // Создаем всю разметку 
  const markup = initialHomePageTemplate();
  root.insertAdjacentHTML('beforeend', markup);

}



