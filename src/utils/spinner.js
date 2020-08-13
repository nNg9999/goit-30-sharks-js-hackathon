const refs = {
  spinner: document.querySelector('#js-spinner'),
};
export default {
  show() {
    refs.spinner.classList.remove('hidden');
  },
  hide() {
    refs.spinner.classList.add('hidden');
  },
};