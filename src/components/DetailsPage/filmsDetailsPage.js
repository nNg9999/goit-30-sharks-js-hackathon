import APIservice from '../../services/movies-api-service';
import notify from '../../utils/notify';
import spinner from '../../utils/spinner';
import './detailsPage.scss';

import detailPageTemplate from './detailsPage.hbs';
import trailerTemplate from './trailer.hbs';
import storage from '../../utils/storage';

export default function (root, ...rest) {
  const id = storage.get('selectFilm');
  function dataWithCutDate(data) {
    return {
      ...data,
      release_date: data.release_date.slice(0, 4),
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
    if (filmsQueue !== null) {
      filmsQueue.forEach(el => {
        if (el.id === id) {
          changeButtonQueue();
        }
      });
    }
    if (filmsWatched !== null) {
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
      .then(data => {
        renderDetails(dataWithCutDate(data));
        monitorButtonStatusText(id);

        document
          .getElementById('watch')
          .addEventListener('click', () => watchChange(dataWithCutDate(data)));
        document
          .getElementById('queue')
          .addEventListener('click', () => queueChange(dataWithCutDate(data)));
        document.getElementById('go-home').addEventListener('click', () => {
          root.innerHTML = '';
          location.pathname = '/';
        });
        fetchTrailer(id);
      })
      .catch(error => {
        console.log(error);
        notify.showError();
      })
      .finally(() => spinner.hide());
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

  function renderDetails(details) {
    spinner.hide();
    let markup = '';
    markup = detailPageTemplate(details);
    root.insertAdjacentHTML('beforeend', markup);
  }

  function watchChange(film) {
    console.log(film);
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
}
