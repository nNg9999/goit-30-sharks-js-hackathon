const baseURL = 'https://api.themoviedb.org/3';
const apiKey = '338897da6433601e8c5026c6fd0b5ca7';
const pathImage = "https://image.tmdb.org/t/p/w500";
const noPoster =
  'https://moviereelist.com/wp-content/uploads/2019/07/poster-placeholder.jpg';
const noImage =
  'https://thumbs.dreamstime.com/b/no-image-available-icon-photo-camera-flat-vector-illustration-132483141.jpg';

const fetchShowDetails = showId => {

  return fetch(`${baseURL}/movie/${showId}?api_key=${apiKey}&language=ru`)
    .then(res => res.json());
};

const fetchShowCast = showId => {
  return fetch(`${baseURL}/movie/${showId}/credits?api_key=${apiKey}`)
    .then(res => res.json())
    .then(res => res.cast);
};

const fetchShowReviews = showId => {
  return fetch(
    `${baseURL}/movie/${showId}/reviews?api_key=${apiKey}&language=en-US&page=1`,
  )
    .then(res => res.json())
    .then(res => res.data);

};

const fetchShowWithQuery = (searchQuery, pageNumber) => {
  return fetch(`${baseURL}/search/movie?api_key=${apiKey}&language=en-US&query=${searchQuery}&page=${pageNumber}&include_adult=false`)
    .then(res => res.json());
};

const fetchShowWithTrending = (pageNumber) => {
  return fetch(`${baseURL}/trending/movie/week?api_key=${apiKey}&language=en-US&page=${pageNumber}&include_adult=false`)
    .then(res => res.json());
}

export default {
  pathImage,
  noPoster,
  noImage,
  fetchShowDetails,
  fetchShowWithQuery,
  fetchShowWithTrending,
  fetchShowCast,
  fetchShowReviews,
};
