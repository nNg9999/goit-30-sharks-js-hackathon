import searchAndPlaginationHomePage from './searchAndPlaginationHomePage.hbs';

export default function (root, ...rest) {
  // Создаем всю разметку 


  // function createLibraryCard(imgPath, filmTitle, movieId, voteAverage) {
  //   const markup = filmLibraryItems();

  //   return root.insertAdjacentHTML('beforeend', markup);
  // }



  const markup = searchAndPlaginationHomePage();
  root.insertAdjacentHTML('beforeend', markup);




}
