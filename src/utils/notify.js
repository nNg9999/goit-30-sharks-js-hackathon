import { defaults, info, error } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
defaults.addClass = 'center';
defaults.delay = 2000;
defaults.closer = false;
defaults.sticker = false;
defaults.maxTextHeight = null;
export default {
  showInfo(text) {
    info({
      text: text || 'Please enter some information',
    });
  },
  showNoMatches(text) {
    error({
      text: text || 'No matches found',
    });
  },
  showError(text) {
    error({
      text: text || 'Something is going wrong. Please,try again',
    });
  },
};