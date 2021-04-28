const menu = document.querySelector ('.main-nav__list');
const buttonMenu = document.querySelector ('.page-header__toggle--open');

buttonMenu.addEventListener('click', function(evt){
  evt.preventDefault();
  buttonMenu.classList.toggle('page-header__toggle--close');
  menu.classList.toggle('main-nav__list--close');
});
