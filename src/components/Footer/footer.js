'use strict';

function handleScroll() {
  const scrolled = window.pageYOffset;
  const coords = document.documentElement.clientHeight;

  if (scrolled > coords) {
    goTopBtn.classList.add('footer__btn-show');
  }
  if (scrolled < coords) {
    goTopBtn.classList.remove('footer__btn-show');
  }
}

function backToTop() {
  if (window.pageYOffset > 0) {
    window.scrollBy(0, -80);
    setTimeout(backToTop, 0);
  }
}

const goTopBtn = document.querySelector('.footer__btn');

window.addEventListener('scroll', handleScroll);
goTopBtn.addEventListener('click', backToTop);
