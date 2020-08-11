import pathPage from '../../pages/path';
import storage from '../../utils/storage';

import '../../sass/base.scss';

const refs = {
  logo: document.querySelector('.logotype'),
  homeLink: document.querySelector('.home-link'),
  libraryLink: document.querySelector('.library-link'),
};

function activeHomePage() {
  location.pathname = pathPage.home;
}

function activeLibraryPage() {
  location.pathname = pathPage.library;
}

if (location.pathname === pathPage.home) {
  refs.homeLink.classList.add('link-active');
  refs.libraryLink.classList.remove('link-active');
} else {
  refs.homeLink.classList.remove('link-active');
  refs.libraryLink.classList.add('link-active');
}

refs.logo.addEventListener('click', activeHomePage);
refs.homeLink.addEventListener('click', activeHomePage);
refs.libraryLink.addEventListener('click', activeLibraryPage);

export default {
  activeDetailsPage(movieId, itsLibraryFilm) {
    location.pathname = pathPage.details;
    storage.save('selectFilm', movieId);

    refs.libraryLink.addEventListener('click', activeLibraryPage);
  },
};
