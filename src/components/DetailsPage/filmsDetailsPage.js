import APIservice from '../../services/movies-api-service';
import notify from '../../utils/notify';
import spinner from '../../utils/spinner';
import './detailsPage.scss';

import detailPageTemplate from './detailsPage.hbs';

export default function (root, ...rest) {
  const id = 475557;
  let watchButton;

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
    if (filmsQueue) {
      filmsQueue.forEach(el => {
        if (el.id === id) {
          changeButtonQueue();
        }
      });
    }
    if (filmsWatched) {
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
      })
      .catch(notify.showError('ERROR!'));
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
    // Убрать этот костыль
    if (filmToWatch === null) {
      filmToWatch = [];
    }
    // ^^^
    if (ref.dataset.value === 'add') {
      localStorage.setItem(
        'filmsWatched',
        JSON.stringify([
          ...filmToWatch,
          {
            id: film.id,
            title: film.title,
            vote: film.vote_average,
            poster: film.poster_path,
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
    // Убрать этот костыль
    if (filmToQueue === null) {
      filmToQueue = [];
    }
    // ^^^
    if (ref.dataset.value === 'add') {
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
      const newFilmToQueue = filmToQueue.filter(el => el.id !== film.id);
      localStorage.setItem('filmsWatched', JSON.stringify(newFilmToQueue));
    }
    changeButtonQueue();
  }

  fetchDetails(id);
}

// // Для добавления/удаления фильма из списка просмотренных
// function watchChange(id) {
//   spinner.show();
//   APIservice.fetchShowDetails(id)
//     .then(data => {
//       const film = dataWithCutDate(data);
//       const ref = document.getElementById('watch');
//       const filmToWatch = JSON.parse(localStorage.getItem('filmsWatched'));
//       if (ref.innerText == 'Add to watched') {
//         localStorage.setItem(
//           'filmsWatched',
//           JSON.stringify([
//             ...filmToWatch,
//             {
//               id: film.id,
//               title: film.title,
//               vote: film.vote_average,
//               poster: film.poster_path,
//             },
//           ]),
//         );
//       } else {
//         const newFilmToWatch = filmToWatch.filter(el => el.id !== id);
//         localStorage.setItem('filmsWatched', JSON.stringify(newFilmToWatch));
//       }
//       changeButtonWatched();
//     })
//     .catch(notify.showError('ERROR!'))
//     .finally(spinner.hide());
// }

// // Для добавления/удаления фильма из очереди
// function queueChange(id) {
//   spinner.show();
//   APIservice.fetchShowDetails(id)
//     .then(data => {
//       const film = dataWithCutDate(data);
//       const ref = document.getElementById('queue');
//       const filmToQueue = JSON.parse(localStorage.getItem('filmsQueue'));
//       if (ref.innerText == 'Add to queue') {
//         localStorage.setItem(
//           'filmsQueue',
//           JSON.stringify([
//             ...filmToQueue,
//             {
//               id: film.id,
//               title: film.title,
//               vote: film.vote_average,
//               poster: film.poster_path,
//             },
//           ]),
//         );
//       } else {
//         const newFilmToQueue = filmToQueue.filter(el => el.id !== id);
//         localStorage.setItem('filmsWatched', JSON.stringify(newFilmToQueue));
//       }
//       changeButtonWatched();
//     })
//     .catch(notify.showError('ERROR!'))
//     .finally(spinner.hide());
// }
