import toastr from 'toastr';
import 'toastr/build/toastr.css';
toastr.options = {
  closeButton: false,
  debug: false,
  newestOnTop: false,
  progressBar: false,
  positionClass: 'toast-top-right',
  preventDuplicates: false,
  onclick: null,
  showDuration: '300',
  hideDuration: '1000',
  timeOut: '5000',
  extendedTimeOut: '1000',
  showEasing: 'swing',
  hideEasing: 'linear',
  showMethod: 'fadeIn',
  hideMethod: 'fadeOut',
};
export default {
  showInfo(text) {
    toastr['info'](text || 'Please enter some information');
  },
  showError(text) {
    toastr['error'](
      text || 'Something is going wrong. Please,try again. Prepare to die!',
    );
  },
  showNoMatches(text) {
    toastr['error'](text || 'No matches found');
  },
};