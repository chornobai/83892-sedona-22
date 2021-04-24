const menu = document.querySelector ('.main-nav__list');
const buttonMenu = document.querySelector ('.page-header__toggle');

buttonMenu.addEventListener('click', function(evt){
  evt.preventDefault();
  if (buttonMenu.classList.contains('page-header__toggle--close')){
    buttonMenu.classList.add('page-header__toggle--open');
    buttonMenu.classList.remove('page-header__toggle--close');
    menu.classList.add('main-nav__list--close');
  } else {
    menu.classList.remove('main-nav__list--close');
    buttonMenu.classList.add('page-header__toggle--close');
  }
})

