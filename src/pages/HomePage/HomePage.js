import initialHomePage from '../../components/HomePage/InitialHomePage/initialHomePage';
import DetailsPage from '../DetailsPage/DetailsPage';

export default function (root) {
    initialHomePage(root);

    eventsHandlers(root);
}

function eventsHandlers(root) {
    const goTopLink = document.querySelector('.go-top');

    goTopLink.addEventListener('click', () => {
        root.innerHTML = '';
        DetailsPage(root);
        location.pathname = '/details';
    })
}
