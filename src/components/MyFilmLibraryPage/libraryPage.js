import myFilmLibraryPageTemplate from './myFilmLibraryPage.hbs';
import filmLibraryItemsTemplate from './filmLibraryItems.hbs';

import storage from '../../utils/storage';
import './myFilmLibraryPage.scss';
import navigation from '../Header/navigation';

export default function (root, ...rest) {
  const markup = myFilmLibraryPageTemplate();
  root.insertAdjacentHTML('beforeend', markup);

  const refs = {
    userInput: document.querySelector('#name-input'),
    moviesListWatched: document.querySelector('#js-watched'),
    moviesListQueue: document.querySelector('#js-queue'),
    watched: document.querySelector('.watched'),
    queue: document.querySelector('.queue'),
    moviesListItem: document.querySelector('.movie-list__item'),
  };

  // refs.moviesListItem.addEventListener('click', navigation.activeDetailsPage);
  function createLibraryCardFunc(fragment = '') {
    return filmLibraryItemsTemplate(fragment);
  }

  function drawQueueFilmList() {
    let fragments = '';
    fragments = storage.get('filmsQueue');

    if (fragments !== null && fragments.length > 0) {
      fragments.map(element => {
        const markup = createLibraryCardFunc(element);
        refs.moviesListQueue.insertAdjacentHTML('beforeend', markup);
      });
    } else {
      const markup = createPlug('queue');
      refs.moviesListQueue.insertAdjacentHTML('beforeend', markup);
    }
  }

  function drawWatchedFilmList() {
    let fragments = '';
    fragments = storage.get('filmsWatched');

    if (fragments !== null && fragments.length > 0) {
      fragments.forEach(element => {
        const markup = createLibraryCardFunc(element);
        refs.moviesListWatched.insertAdjacentHTML('beforeend', markup);
      });
    } else {
      const markup = createPlug('watched');
      refs.moviesListWatched.insertAdjacentHTML('beforeend', markup);
    }
  }

  function createPlug(text) {
    return `<div>
      You do not have to ${text} queue movies to watch.Add them.
    </div>`;
  }

  function clearListItems() {
    refs.moviesListWatched.innerHTML = '';
    refs.moviesListQueue.innerHTML = '';
  }

  function showWatched() {
    refs.watched.classList.add('active');
    refs.queue.classList.remove('active');
  }

  function hidenWatched() {
    refs.watched.classList.remove('active');
    refs.queue.classList.add('active');
  }

  refs.watched.addEventListener('click', handlerClickWatched);
  refs.queue.addEventListener('click', handlerClickQueue);

  function handlerClickWatched(e) {
    e.preventDefault();
    const movieId = e.target.getAttribute('id');
    // location.pathname = '/details';
    // navigation.activeDetailsPage(movieId, true);
    clearListItems();
    drawWatchedFilmList();
    navigation.activeDetailsPage(movieId, true);
    showWatched();
  }

  function handlerClickQueue(e) {
    e.preventDefault();
    const movieId = e.target.getAttribute('id');
    // navigation.activeDetailsPage(movieId, true);
    clearListItems();
    drawQueueFilmList();
    // navigation.activeDetailsPage(movieId, true);
    hidenWatched();
  }
  drawWatchedFilmList();
  showWatched();
}



