'use strict';

import api from '../../../services/movies-api-service';
import spinner from '../../../utils/spinner';
import notify from '../../../utils/notify';

import searchPage from './searchAndPlaginationHomePage.hbs';
import methods from '../InitialHomePage/initialHomePage';
import './searchAndPlaginationHomePage.scss';

import icon from '../../../images/icon.png';

let inputValue = '';

export default function (root, ...rest) {
  const markup = searchPage({ icon });
  root.insertAdjacentHTML('beforeend', markup);
  methods.fetchPopularMoviesList();

  const debounce = require('lodash.debounce');

  const refs = {
    input: document.querySelector('.js-searchInput'),
    gallery: document.querySelector('#js-film-gallery'),
    prevBtn: document.querySelector('#prevBtn'),
    nextBtn: document.querySelector('#nextBtn'),
    pageNumber: document.querySelector('#paginationPageNumber'),
  };

  refs.input.addEventListener('input', debounce(searchForm, 500));
  // refs.input.addEventListener('keypress', searchForm);
  refs.prevBtn.addEventListener('click', prevPageHandler);
  refs.nextBtn.addEventListener('click', nextPageHandler);

  function searchForm(e) {
    e.preventDefault();

    methods.resetPage();
    refs.pageNumber.textContent = methods.pageNumber;

    inputValue = e.target.value;
    const page = methods.pageNumber;

    clearMovies();

    spinner.show();

    inputValue
      ? api
          .fetchShowWithQuery(inputValue, page)
          .then(movies =>
            movies.length > 0
              ? methods.createCardFunc(movies)
              : notify.showError(),
          )
          .catch(error => {
            console.log(error);
            notify.showError();
          })
          .finally(() => spinner.hide())
      : methods.fetchPopularMoviesList();

    e.target.value = '';
  }

  function nextPageHandler() {
    methods.incrementPage();
    refs.pageNumber.textContent = methods.pageNumber;

    const query = inputValue;
    const page = methods.pageNumber;

    clearMovies();

    query
      ? (spinner.show(),
        api
          .fetchShowWithQuery(query, page)
          .then(movies => methods.createCardFunc(movies))
          .catch(error => {
            console.log(error);
            notify.showError();
          })
          .finally(() => spinner.hide()))
      : methods.fetchPopularMoviesList();
  }

  function prevPageHandler() {
    if (methods.pageNumber <= 1) {
      return;
    }

    methods.decrementPage();
    refs.pageNumber.textContent = methods.pageNumber;

    const query = inputValue;
    const page = methods.pageNumber;

    clearMovies();

    query
      ? (spinner.show(),
        api
          .fetchShowWithQuery(query, page)
          .then(movies => methods.createCardFunc(movies))
          .catch(error => {
            console.log(error);
            notify.showError();
          })
          .finally(() => spinner.hide()))
      : methods.fetchPopularMoviesList();
  }

  function clearMovies() {
    refs.gallery.innerHTML = '';
    methods.renderFilms = [];
  }
}
