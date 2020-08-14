import APIservice from '../../services/movies-api-service';
import notify from '../../utils/notify';
import spinner from '../../utils/spinner';
import './detailsPage.scss';
import detailPageTemplate from './detailsPage.hbs';
import storage from '../../utils/storage';

import similarMoviesTemplate from './movieTemplate.hbs';
import trailerTemplate from './trailer.hbs';
import noPoster from '../../images/noPoster.jpg';

import initialHomePage from '../HomePage/InitialHomePage/initialHomePage';

import Glide from '@glidejs/glide';
import '../../../node_modules/@glidejs/glide/dist/css/glide.core.min.css';
import '../../../node_modules/@glidejs/glide/dist/css/glide.theme.min.css';

export default function (root, ...rest) {
  const id = Number(storage.get('selectFilm'));

  function dataWithCutDate(data) {
    return {
      ...data,
      release_date: data.release_date ? data.release_date.slice(0, 4) : '',
      genres: putCommas(data),
    };
  }
  function changeButtonQueue() {
    const ref = document.getElementById('queue');
    if (ref.dataset.value === 'add') {
      ref.dataset.value = 'delete';
      ref.classList.add('deleteStyle-queue');
      ref.innerText = 'Delete from queue';
    } else {
      ref.dataset.value = 'add';
      ref.innerText = 'Add to queue';
      ref.classList.remove('deleteStyle-queue');
    }
  }
  function changeButtonWatched() {
    const ref = document.getElementById('watch');
    if (ref.dataset.value === 'add') {
      ref.dataset.value = 'delete';
      ref.classList.add('deleteStyle-watched');
      ref.innerText = 'Delete from watched';
    } else {
      ref.innerText = 'Add to watched';
      ref.dataset.value = 'add';
      ref.classList.remove('deleteStyle-watched');
    }
  }
  function monitorButtonStatusText(id) {
    const filmsQueue = JSON.parse(localStorage.getItem('filmsQueue'));
    const filmsWatched = JSON.parse(localStorage.getItem('filmsWatched'));
    if (filmsQueue !== null && filmsQueue.length !== 0) {
      filmsQueue.forEach(el => {
        if (el.id === id) {
          changeButtonQueue();
        }
      });
    }
    if (filmsWatched !== null && filmsWatched.length !== 0) {
      filmsWatched.forEach(el => {
        if (el.id === id) {
          changeButtonWatched();
        }
      });
    }
  }
  function putCommas(data) {
    return data.genres.reduce(function (acc, value, index, arr) {
      if (index !== arr.length - 1) {
        return `${acc} ${value.name},`;
      } else return `${acc} ${value.name}`;
    }, '');
  }
  function fetchDetails(id) {
    spinner.show();
    APIservice.fetchShowDetails(id)
      .then(res => dataWithCutDate(res))
      .then(data => {
        renderDetails(data);
        monitorButtonStatusText(id);
        document
          .getElementById('watch')
          .addEventListener('click', () => watchChange(data));
        document
          .getElementById('queue')
          .addEventListener('click', () => queueChange(data));
        document.getElementById('go-back').addEventListener('click', () => {
          root.innerHTML = '';
          history.back();
        })
        fetchTrailer(id);

      })
      .catch(error => {
        console.log(error);
        notify.showError();
      })
      .finally(() => spinner.hide());
  }

  function renderDetails(details) {
    spinner.hide();

    let markup = '';
    markup = detailPageTemplate(details);
    root.insertAdjacentHTML('beforeend', markup);
    fetchSimilarFilms(id);
    new Glide('#glide', {
      perView: 6,
    }).mount();
  }
  function watchChange(film) {
    const ref = document.getElementById('watch');
    let filmToWatch = JSON.parse(localStorage.getItem('filmsWatched'));
    if (filmToWatch === null) {
      filmToWatch = [];
    }
    if (ref.dataset.value === 'add') {
      localStorage.setItem(
        'filmsWatched',
        JSON.stringify([
          ...filmToWatch,
          {
            id: film.id,
            title: film.title ? film.title : film.name,
            vote: film.vote_average,
            poster: film.backdrop_path,
            date: film.release_date,
          },
        ]),
      );
    } else {
      const newFilmToWatch = filmToWatch.filter(el => el.id !== film.id);
      localStorage.setItem('filmsWatched', JSON.stringify(newFilmToWatch));
    }
    changeButtonWatched();
  }
  function queueChange(film) {
    const ref = document.getElementById('queue');
    let filmToQueue = JSON.parse(localStorage.getItem('filmsQueue'));
    if (filmToQueue === null) {
      filmToQueue = [];
    }
    if (ref.dataset.value === 'add') {
      localStorage.setItem(
        'filmsQueue',
        JSON.stringify([
          ...filmToQueue,
          {
            id: film.id,
            title: film.title ? film.title : film.name,
            vote: film.vote_average,
            poster: film.backdrop_path,
            date: film.release_date,
          },
        ]),
      );
    } else {
      const newFilmToQueue = filmToQueue.filter(el => el.id !== film.id);
      localStorage.setItem('filmsQueue', JSON.stringify(newFilmToQueue));
    }
    changeButtonQueue();
  }
  fetchDetails(id);



  function fetchSimilarFilms(id) {
    APIservice.fetchSimilarShows(id).then(movies => {
      movies.length > 0 ? createMovieMarkup(movies)
        : createMovieDefault();
    });
  }

  function createMovieMarkup(movies) {
    const markup = movies
      .map(movie => similarMoviesTemplate(createFilmObjectForTemplate(movie)))
      .join(' ');
    const list = document.querySelector('.glide__slides');
    list.insertAdjacentHTML('beforeend', markup);
  }

  function createMovieDefault() {
    const markup = `<p>No similar movies</p>`;
    const list = document.querySelector('.glide__slides');
    list.insertAdjacentHTML('beforeend', markup);
  }

  function createFilmObjectForTemplate(film) {
    const pathToPoster = film.backdrop_path
      ? `${APIservice.pathImage}${film.backdrop_path}`
      : noPoster;
    const title = film.title ? film.title : film.name;
    const id = film.id;
    const year = film.release_date ? `(${film.release_date.slice(0, 4)})` : '';
    return {
      pathToPoster,
      title,
      id,
      year,
    };
  }

  function fetchTrailer(id) {
    spinner.show();
    APIservice.fetchShowVideos(id)
      .then(({ results }) => renderTrailer(results[0]))
      .catch(error => {
        console.log(error);
        notify.showError();
      })
      .finally(() => spinner.hide());
  }

  function renderTrailer(obj) {
    const markup = trailerTemplate(obj);
    const filmDetails = document.querySelector('#js-filmDetails__right');
    filmDetails.insertAdjacentHTML('beforeend', markup);
  }

}
