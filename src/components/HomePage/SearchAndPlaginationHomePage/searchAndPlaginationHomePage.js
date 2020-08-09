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
let totalPages = null;

export default function (root) {
  const markup = searchPage({ icon });
  root.insertAdjacentHTML('beforeend', markup);
  initialHomePage.fetchPopularMoviesList();

  const refs = {
    input: document.querySelector('.js-searchInput'),
    form: document.querySelector('.serach-form'),
    gallery: document.querySelector('#js-film-gallery'),
    prevBtn: document.querySelector('#prevBtn'),
    nextBtn: document.querySelector('#nextBtn'),
    pageNumber: document.querySelector('#paginationPageNumber'),
    paginationWrapper: document.querySelector('.paginationWrapper'),
  };

  refs.input.addEventListener('input', debounce(searchForm, 1500));
  refs.prevBtn.addEventListener('click', prevPageHandler);
  refs.nextBtn.addEventListener('click', nextPageHandler);

  function searchForm(e) {
    e.preventDefault();
    inputValue = e.target.value;
    initialHomePage.resetPage();
    resetPageNumber();
    clearGallery();
    selectFetch(inputValue);
    e.target.value = '';
  }

  function nextPageHandler() {
    if (totalPages <= initialHomePage.pageNumber) {
      notify.showNoMatches();
      return;
    }
    initialHomePage.incrementPage();
    resetPageNumber();
    clearGallery();
    selectFetch(inputValue);
  }

  function prevPageHandler() {
    if (initialHomePage.pageNumber <= 1) {
      return;
    }
    initialHomePage.decrementPage();
    resetPageNumber();
    clearGallery();
    selectFetch(inputValue);
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
        totalPages = total_pages;
        totalPages > 0
          ? (refs.paginationWrapper.classList.remove('invisible'),
            initialHomePage.createCardFunc(results),
            initialHomePage.createRenderFilmsArray(results))
          : (notify.showNoMatches(),
            refs.paginationWrapper.classList.add('invisible'));
      })
      .catch(error => notify.showError())
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
