import myFilmLibraryPageTemplate from './myFilmLibraryPage.hbs';
import filmLibraryItemsTemplate from './filmLibraryItems.hbs';

import storage from '../../utils/storage';
import './myFilmLibraryPage.scss';
import navigation from '../Header/navigation';


function createNavigationList(root) {
  const markup = myFilmLibraryPageTemplate();
  root.insertAdjacentHTML('beforeend', markup);
}

function createRefs() {
  const refs = {
    moviesListWatched: document.querySelector('#js-watched'),
    moviesListQueue: document.querySelector('#js-queue'),
    watched: document.querySelector('.watched'),
    queue: document.querySelector('.queue'),
    moviesList: document.querySelector('.movie-list'),
  };
  return refs;
}

function createLibraryCardFunc(fragment = '') {
  return filmLibraryItemsTemplate(fragment);
}

function drawQueueFilmList(refs) {
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

function drawWatchedFilmList(refs) {
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
      You do not have any movie in ${text}. Please add.
    </div>`;
}

function clearListItems(refs) {
  refs.moviesListWatched.innerHTML = '';
  refs.moviesListQueue.innerHTML = '';
}

function showWatched(refs) {
  refs.watched.classList.add('active');
  refs.queue.classList.remove('active');
}

function hidenWatched(refs) {
  refs.watched.classList.remove('active');
  refs.queue.classList.add('active');
}

function clickHandlerMovieId(e) {
  const movieId = e.target.dataset.id;
  navigation.activeDetailsPage(movieId, true);
}


export default function (root, ...rest) {
  createNavigationList(root);

  const refs = createRefs();

  refs.watched.addEventListener('click', handlerClickWatched);
  refs.queue.addEventListener('click', handlerClickQueue);
  refs.moviesListWatched.addEventListener('click', clickHandlerMovieId);
  refs.moviesListQueue.addEventListener('click', clickHandlerMovieId);

  function handlerClickWatched(e) {
    clearListItems(refs);
    drawWatchedFilmList(refs);
    showWatched(refs);
  }

  function handlerClickQueue(e) {
    clearListItems(refs);
    drawQueueFilmList(refs);
    hidenWatched(refs);
  }

  drawWatchedFilmList(refs);
  showWatched(refs);
}



