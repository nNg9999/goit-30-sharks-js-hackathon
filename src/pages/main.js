import HomePage from "./HomePage/HomePage";
import DetailsPage from './DetailsPage/DetailsPage';
import MyFilmLibraryPage from './MyFilmLibraryPage/MyFilmLibraryPage';

function getCurrentPath() {
  return location.pathname;
}

function init() {
  const root = document.getElementById('root');
  const path = getCurrentPath();

  switch (path) {
    case '/': {
      HomePage(root);
      break;
    }
    case '/details': {
      DetailsPage(root);
      break;
    }
    case '/MyFilmLibraryPage': {
      MyFilmLibraryPage(root);
      break;
    }

    default: {
      break;
    }
  }
}

init();
