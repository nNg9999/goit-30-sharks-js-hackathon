import newfetchShowDetails from '../../services/movies-api-service';

import myFilmLibraryPageTemplate from './myFilmLibraryPage.hbs';
import filmLibraryItemsTemplate from './filmLibraryItems.hbs';
import debounce from 'lodash.debounce';

import notify from '../../utils/notify';
import spinner from '../../utils/spinner';

import storage from '../../utils/storage';

export default function (root, ...rest) {
  // Создаем всю разметку 

  // const markup = myFilmLibraryPageTemplate();
  // root.insertAdjacentHTML('beforeend', markup);

  function createLibraryCard(imgPath, filmTitle, movieId, voteAverage) {

    const markup = filmLibraryItems();

    return root.insertAdjacentHTML('beforeend', markup);
  }

  // createLibraryCard();


  function drawQueueFilmList(params) {

  }

  function drawWatchedFilmList(params) {

  }

  storage.save('filmsQueue', "filmsQueue");
  storage.get("filmsQueue");


  const markup = myFilmLibraryPageTemplate();
  root.insertAdjacentHTML('beforeend', markup);

  const refs = {
    userInput: document.querySelector('#name-input'),
    moviesListWatched: document.querySelector('#movies-list-watched'),
    moviesListQueue: document.querySelector('#movies-list-queue'),
    watched: document.querySelector('watched'),
    queue: document.querySelector('queue'),
  };

  refs.userInput.addEventListener('input', debounce(searchFormHandler, 500));

  function searchFormHandler(e) {
    clearListItems();

    const searchQuery = refs.userInput.value || '';

    if (searchQuery) {
      fetchMovies(searchQuery);
    }

  }

  function fetchMovies(searchQuery) {
    spinner.show();
    newfetchShowDetails.fetchShowWithQuery(searchQuery)
      .then(data => {
        console.log(data);
        renderListItems(data);
      })
      .catch(notify.showError('ERROR!'));
  }

  function renderListItems(items) {
    spinner.hide();

    let markup = '';

    markup = filmLibraryItemsTemplate(items);
    notify.showInfo('привет!!');

    refs.moviesList.insertAdjacentHTML('beforeend', markup);
  }

  function clearListItems() {
    refs.moviesList.innerHTML = '';
  }



  refs.userInput.addEventListener('click', handlerClickWatched);

  function handlerClickWatched(e) {
    clearListItems();
    console.log('handlerClickWatched');
  }

}
