import newfetchShowDetails from '../../services/movies-api-service';

// console.log(newfetchShowDetails);

import myFilmLibraryPageTemplate from './myFilmLibraryPage.hbs';
import filmLibraryItemsTemplate from './filmLibraryItems.hbs';
import debounce from 'lodash.debounce';

import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

import notify from '../../utils/notify';
import spinner from '../../utils/spinner';



export default function (root, ...rest) {
  // Создаем всю разметку 
  const markup = myFilmLibraryPageTemplate();
  root.insertAdjacentHTML('beforeend', markup);


  const refs = {
    userInput: document.querySelector('#name-input'),
    moviesList: document.querySelector('#movies-list'),
    watched: document.querySelector('watched'),
    queue: document.querySelector('queue'),
  };

  refs.userInput.addEventListener('input', debounce(searchFormHandler, 500));

  function searchFormHandler(e) {
    clearListItems();

    const searchQuery = refs.userInput.value || '';

    if (searchQuery) {
      fetchMovies(searchQuery);
    }

  }

  function fetchMovies(searchQuery) {
    spinner.show();
    newfetchShowDetails.fetchShowWithQuery(searchQuery)
      .then(data => {
        console.log(data);
        renderListItems(data);
      })
      .catch(notify.showError('ERROR!'));
  }

  function renderListItems(items) {
    spinner.hide();

    let markup = '';

    markup = filmLibraryItemsTemplate(items);
    notify.showInfo('привет!!');

    refs.moviesList.insertAdjacentHTML('beforeend', markup);
  }

  function clearListItems() {
    refs.moviesList.innerHTML = '';
  }



  refs.userInput.addEventListener('click', handlerClickWatched);

  function handlerClickWatched(e) {
    clearListItems();
    console.log('handlerClickWatched');
  }

}
