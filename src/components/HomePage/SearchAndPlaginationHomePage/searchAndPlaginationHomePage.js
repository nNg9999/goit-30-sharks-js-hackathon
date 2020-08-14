'use strict';
import api from '../../../services/movies-api-service';
import spinner from '../../../utils/spinner';
import notify from '../../../utils/notify';
import searchPage from './searchAndPlaginationHomePage.hbs';
import initialHomePage from '../InitialHomePage/initialHomePage';
import './searchAndPlaginationHomePage.scss';
import icon from '../../../images/icon.png';
const debounce = require('lodash.debounce');


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
  };
  refs.input.addEventListener('input', debounce(searchForm, 1500));
  refs.prevBtn.addEventListener('click', prevPageHandler);
  refs.nextBtn.addEventListener('click', nextPageHandler);
  function searchForm(e) {
    e.preventDefault();
    initialHomePage.inputValue = e.target.value;
    initialHomePage.resetPage();
    initialHomePage.makeInvisible();
    refs.nextBtn.addEventListener('click', nextPageHandler);

    if (!refs.prevBtn.classList.contains('non-active')) {
      refs.prevBtn.classList.add('non-active');
    };

    resetPageNumber();
    clearGallery();
    selectFetch(initialHomePage.inputValue);

    e.target.value = '';
  }
  function nextPageHandler() {
    initialHomePage.incrementPage();
    if (refs.prevBtn.classList.contains('non-active')) {
      refs.prevBtn.classList.remove('non-active');
    }
    resetPageNumber();
    initialHomePage.makeInvisible();
    clearGallery();
    selectFetch(initialHomePage.inputValue);
    // const history = window.location.search = (`?query=${initialHomePage.inputValue}&page=${initialHomePage.pageNumber}`);
    // const history = new URLSearchParams(location.href).set("page", `${initialHomePage.pageNumber}`);
    // console.log(history);
    // console.log("initialHomePage.inputValue", initialHomePage.inputValue);
    // console.log("initialHomePage.pageNumber", initialHomePage.pageNumber);
    // location.search = `?query=${initialHomePage.inputValue}&page=${initialHomePage.pageNumber}`;
    // initialHomePage.inputValue ? location.search = `?query=${initialHomePage.inputValue}&page=${initialHomePage.pageNumber}`
    // : location.search = `?page=${initialHomePage.pageNumber}`;
  }
  function prevPageHandler() {
    if (initialHomePage.pageNumber <= 1) {
      return;
    }
    if (refs.nextBtn.classList.contains('non-active')) {
      refs.nextBtn.classList.remove('non-active');
    }
    initialHomePage.decrementPage();
    initialHomePage.makeInvisible();
    resetPageNumber();
    clearGallery();
    selectFetch(initialHomePage.inputValue);
    refs.nextBtn.addEventListener('click', nextPageHandler);
    if (initialHomePage.pageNumber <= 1) {
      refs.prevBtn.classList.add('non-active');
    }
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
        if (total_pages > 1 && refs.nextBtn.classList.contains('non-active')) {
          refs.nextBtn.classList.remove('non-active');
        }
        if (total_pages === initialHomePage.pageNumber) {
          notify.showInfo('This is the last page');
          refs.nextBtn.classList.add('non-active');
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