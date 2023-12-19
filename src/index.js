import './styles.css';
import ImageApi from './fetch-images';
import { showNotification, showLoadButton, hideLoadButton } from './dom-helpers';
import SimpleLightbox from 'simplelightbox';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');
const imgApi = new ImageApi();

searchForm.addEventListener('submit', handleSearch);
loadBtn.addEventListener('click', onLoadMore);
loadBtn.classList.add('is-hidden');

async function handleSearch(event) {
  event.preventDefault();
  const query = event.currentTarget.elements.searchQuery.value;

  if (!query) return;

  try {
    imgApi.query = query;
    imgApi.resetPage();
    imgApi.resethitsCounter();

    const imgResponse = await imgApi.fetchImages();

    if (imgResponse.totalHits === 0) {
      showNotification('failure', 'Sorry, there are no images matching your search query. Please try again.');
      hideLoadButton(loadBtn);
    } else {
      showNotification('success', `We found ${imgResponse.totalHits} images!`);
      showLoadButton(loadBtn);
      createImageCards(imgResponse.hits);
    }

    if (imgApi.viewedHits === imgApi.totalHits && imgResponse.totalHits !== 0) {
      showNotification('info', "You've reached the end of search results.");
      hideLoadButton(loadBtn);
    }
  } catch (error) {
    console.error(error.message);
  }
}

async function onLoadMore() {
  try {
    const imgResponse = await imgApi.fetchImages();

    if (imgApi.viewedHits === imgApi.totalHits) {
      showNotification('info', "You've reached the end of search results.");
      hideLoadButton(loadBtn);
    }

    createImageCards(imgResponse.hits);
    autoScroll();
  } catch (error) {
    console.error(error.message);
  }
}

function createImageCards(imageCards) {
  const fragment = document.createDocumentFragment();

  imageCards.forEach(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
    const card = document.createElement('div');
    card.classList.add('photo-card');
    card.innerHTML = `
      <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item"><b>Likes: <span>${likes}</span></b></p>
        <p class="info-item"><b>Views: <span>${views}</span></b></p>
        <p class="info-item"><b>Comments: <span>${comments}</span></b></p>
        <p class="info-item"><b>Downloads: <span>${downloads}</span></b></p>
      </div>
    `;
    fragment.appendChild(card);
  });

  gallery.appendChild(fragment);
  new SimpleLightbox('.gallery a');
}

function autoScroll() {
  const { height: cardHeight } = document.querySelector('.gallery').firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}