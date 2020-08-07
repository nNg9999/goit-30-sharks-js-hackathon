import APIservice from '../../services/movies-api-service';
import notify from '../../utils/notify';
import spinner from '../../utils/spinner';
import './detailsPage.scss';

import detailPageTemplate from './detailsPage.hbs';

export default function (root, ...rest) {
  const id = 475557;

  function dataWithCutDate(data) {
    return {
      ...data,
      release_date: data.release_date.slice(0, 4),
      genres: putCommas(data),
    };
  }

  function changeButtonQueue() {
    const ref = document.getElementById('queue');
    if ((ref.innerText = 'Add to queue')) {
      ref.innerText = 'Delete from queue';
    } else ref.innerText = 'Add to queue';
  }

  function changeButtonWatched() {
    const ref = document.getElementById('watch');
    if ((ref.innerText = 'Add to watched')) {
      ref.innerText = 'Delete from watched';
    } else ref.innerText = 'Add to watched';
  }

  function monitorButtonStatusText(id) {
    const filmsQueue = JSON.parse(localStorage.getItem('filmsQueue'));
    const filmsWatched = JSON.parse(localStorage.getItem('filmsWatched'));
    if (filmsQueue.length > 0) {
      filmsQueue.forEach(el => {
        if (el.id === id) {
          changeButtonQueue();
        }
      });
    }
    if (filmsWatched.length > 0) {
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
        document.getElementById('watch').addEventListener('click', () => {
          changeButtonWatched();
        });
      })
      .catch(notify.showError('ERROR!'));
  }

  function renderDetails(details) {
    spinner.hide();
    let markup = '';
    markup = detailPageTemplate(details);
    root.insertAdjacentHTML('beforeend', markup);
  }

  fetchDetails(id);
}

// Для добавления/удаления фильма из списка просмотренных
function watchChange(id) {
  spinner.show();
  APIservice.fetchShowDetails(id)
    .then(data => {
      const film = dataWithCutDate(data);
      const ref = document.getElementById('watch');
      const filmToWatch = JSON.parse(localStorage.getItem('filmsWatched'));
      if (ref.innerText == 'Add to watched') {
        localStorage.setItem(
          'filmsWatched',
          JSON.stringify([
            ...filmToWatch,
            {
              id: film.id,
              title: film.title,
              vote: film.vote_average,
              poster: film.poster_path,
            },
          ]),
        );
      } else {
        const newFilmToWatch = filmToWatch.filter(el => el.id !== id);
        localStorage.setItem('filmsWatched', JSON.stringify(newFilmToWatch));
      }
      changeButtonWatched();
    })
    .catch(notify.showError('ERROR!'))
    .finally(spinner.hide());
}

// Для добавления/удаления фильма из очереди
function queueChange(id) {
  spinner.show();
  APIservice.fetchShowDetails(id)
    .then(data => {
      const film = dataWithCutDate(data);
      const ref = document.getElementById('queue');
      const filmToQueue = JSON.parse(localStorage.getItem('filmsQueue'));
      if (ref.innerText == 'Add to queue') {
        localStorage.setItem(
          'filmsQueue',
          JSON.stringify([
            ...filmToQueue,
            {
              id: film.id,
              title: film.title,
              vote: film.vote_average,
              poster: film.poster_path,
            },
          ]),
        );
      } else {
        const newFilmToQueue = filmToQueue.filter(el => el.id !== id);
        localStorage.setItem('filmsWatched', JSON.stringify(newFilmToQueue));
      }
      changeButtonWatched();
    })
    .catch(notify.showError('ERROR!'))
    .finally(spinner.hide());
}
