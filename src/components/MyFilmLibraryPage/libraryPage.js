import myFilmLibraryPageTemplate from './myFilmLibraryPage.hbs';
import filmLibraryItemsTemplate from './filmLibraryItems.hbs';
import videoTemplate from './video.hbs';
import db from './db.json';

import storage from '../../utils/storage';
import './myFilmLibraryPage.scss';
import navigation from '../Header/navigation';

export default function (root, ...rest) {
  const markup = myFilmLibraryPageTemplate();
  root.insertAdjacentHTML('beforeend', markup);


  const refs = {
    moviesListWatched: document.querySelector('#js-watched'),
    moviesListQueue: document.querySelector('#js-queue'),
    watched: document.querySelector('.watched'),
    queue: document.querySelector('.queue'),
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
      refs.moviesListWatched.innerHTML = '';
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
      refs.moviesListQueue.innerHTML = '';
      const markup = createPlug('watched');
      refs.moviesListWatched.insertAdjacentHTML('beforeend', markup);
    }
  }

  function createPlug(text) {
    return `<div class="plug">
      You do not have to ${text} movies to watch. Add them.
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
    clearListItems();
    drawWatchedFilmList();
    showWatched();

  }

  function handlerClickQueue(e) {
    clearListItems();
    drawQueueFilmList();
    hidenWatched();
  }

  refs.moviesListWatched.addEventListener('click', clickHandlerMovieId)
  refs.moviesListQueue.addEventListener('click', clickHandlerMovieId)

  function clickHandlerMovieId(e) {
    const movieId = e.target.dataset.id;
    navigation.activeDetailsPage(movieId, true);

  }

  drawWatchedFilmList();
  showWatched();

  function createVideo(db) {
    const markup = videoTemplate(db);
    document.querySelector('main').insertAdjacentHTML('beforeend', markup);
  }

  // createVideo(db);
}



