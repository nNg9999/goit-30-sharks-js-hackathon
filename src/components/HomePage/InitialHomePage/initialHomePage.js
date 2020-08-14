import spinner from '../../../utils/spinner';
import notify from '../../../utils/notify';
import apiService from '../../../services/movies-api-service';
import navigation from '../../Header/navigation';
import initialHomePageTemplate from './initialHomePage.hbs';
import noPoster from '../../../images/noPoster.jpg';
import './initialHomePage.scss';

export default {
  renderFilms: [],
  pageNumber: 1,
  totalPages: 0,
  key: '',

  incrementPage() {
    this.pageNumber += 1;
  },

  decrementPage() {
    this.pageNumber -= 1;
  },

  resetPage() {
    this.pageNumber = 1;
  },

  makeInvisible() {
    if (!pagination.classList.contains('invisible')) {
      pagination.classList.add('invisible');
    }
  },

  fetchPopularMoviesList() {
    spinner.show();
    apiService
      .fetchShowWithTrending(this.pageNumber)
      .then(({ results, total_pages }) => {
        this.checkConditionsForRender(results, total_pages);
      })
      .catch(error => {
        console.log(error);
        notify.showError();
      })
      .finally(() => spinner.hide());
  },

  checkConditionsForRender(films, numberOfPages) {
    const pagination = document.querySelector('#pagination');
    this.totalPages = numberOfPages;

    if (this.totalPages === 0) {
      notify.showNoMatches();
      return;
    }

    if (this.totalPages >= this.pageNumber) {
      pagination.classList.remove('invisible');
    }

    this.createRenderFilmsArray(films);
    this.createCardFunc(films);
  },

  createRenderFilmsArray(films) {
    this.renderFilms = [...films];
  },

  createCardFunc(films) {
    const markup = films
      .map(film =>
        initialHomePageTemplate(this.createFilmObjectForTemplate(film)),
      )
      .join(' ');
    const gallery = document.querySelector('#js-film-gallery');
    gallery.insertAdjacentHTML('beforeend', markup);
    gallery.addEventListener('click', this.clickHandler);
  },

  createFilmObjectForTemplate(film) {
    const pathToPoster = film.backdrop_path
      ? `${apiService.pathImage}${film.backdrop_path}`
      : noPoster;
    const title = film.title ? film.title : film.name;
    const id = film.id;
    const vote = film.vote_average;
    const year = film.release_date ? `(${film.release_date.slice(0, 4)})` : '';
    return {
      pathToPoster,
      title,
      id,
      year,
      vote,
    };
  },

  clickHandler(e) {
    const clickedFilm = e.target;
    const clickedFilmId = clickedFilm.dataset.id;
    navigation.activeDetailsPage(clickedFilmId, false);
  },
};
