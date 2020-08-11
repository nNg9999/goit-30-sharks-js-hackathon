'use strict';
import api from '../../../services/movies-api-service';
import spinner from '../../../utils/spinner';
import notify from '../../../utils/notify';
import searchPage from './searchAndPlaginationHomePage.hbs';
import initialHomePage from '../InitialHomePage/initialHomePage';
import './searchAndPlaginationHomePage.scss';
import icon from '../../../images/icon.png';

const debounce = require('lodash.debounce');

let inputValue = '';

export default function (root) {
  const markup = searchPage({ icon });
  root.insertAdjacentHTML('beforeend', markup);

  initialHomePage.fetchPopularMoviesList();

  const refs = {
    input: document.querySelector('.js-searchInput'),
    gallery: document.querySelector('#js-film-gallery'),
    prevBtn: document.querySelector('#prevBtn'),
    nextBtn: document.querySelector('#nextBtn'),
    pageNumber: document.querySelector('#paginationPageNumber'),
  };

  refs.input.addEventListener('input', debounce(searchForm, 1500));
  refs.prevBtn.addEventListener('click', prevPageHandler);
  refs.nextBtn.addEventListener('click', nextPageHandler);

  function searchForm(e) {
    e.preventDefault();
    inputValue = e.target.value;
    initialHomePage.resetPage();
    initialHomePage.makeInvisible();
    refs.nextBtn.addEventListener('click', nextPageHandler);
    resetPageNumber();
    clearGallery();
    selectFetch(inputValue);
    e.target.value = '';
  }

  function nextPageHandler() {
    initialHomePage.incrementPage();
    resetPageNumber();
    initialHomePage.makeInvisible();
    clearGallery();
    selectFetch(inputValue);
  }

  function prevPageHandler() {
    if (initialHomePage.pageNumber <= 1) {
      return;
    }

    initialHomePage.decrementPage();
    initialHomePage.makeInvisible();
    resetPageNumber();
    clearGallery();
    selectFetch(inputValue);
    refs.nextBtn.addEventListener('click', nextPageHandler);
  }

  function selectFetch(query) {
    query ? fetchMovies(query) : initialHomePage.fetchPopularMoviesList();
  }

  function fetchMovies(query) {
    const { pageNumber } = initialHomePage;
    spinner.show();
    api
      .fetchShowWithQuery(query, pageNumber)
      .then(({ results, total_pages }) => {
        if (total_pages === initialHomePage.pageNumber) {
          notify.showInfo('This is the last page');
          refs.nextBtn.removeEventListener('click', nextPageHandler);
        }
        initialHomePage.checkConditionsForRender(results, total_pages);
      })
      .catch(error => notify.showError(error))
      .finally(() => spinner.hide());
  }

  function resetPageNumber() {
    const { pageNumber } = initialHomePage;
    refs.pageNumber.textContent = pageNumber;
  }

  function clearGallery() {
    refs.gallery.innerHTML = '';
  }
}
