import Notiflix from 'notiflix';

export function showNotification(type, message) {
  Notiflix.Notify[type](message);
}

export function showLoadButton(button) {
  button.classList.remove('is-hidden');
}

export function hideLoadButton(button) {
  button.classList.add('is-hidden');
}