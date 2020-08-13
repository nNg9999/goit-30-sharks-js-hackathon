import HomePage from './HomePage/HomePage';
import DetailsPage from './DetailsPage/DetailsPage';
import MyFilmLibraryPage from './MyFilmLibraryPage/MyFilmLibraryPage';
import pathPage from './path';
function getCurrentPath() {
  return location.pathname;
}

function init() {
  const root = document.getElementById('root');
  const path = getCurrentPath();

  switch (path) {
    case pathPage.home: {
      HomePage(root);
      break;
    }
    case pathPage.details: {
      DetailsPage(root);
      break;
    }
    case pathPage.library: {
      MyFilmLibraryPage(root);
      break;
    }

    default: {
      break;
    }
  }
}

init();
