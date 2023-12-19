import './styles.css';
import ImageApi from './fetch-images';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

const imageApi = new ImageApi();

searchForm.addEventListener('submit', onSearch);
loadMoreButton.addEventListener('click', onLoadMore);
loadMoreButton.classList.add('is-hidden');

function showMessage(type, message) {
  Notiflix.Notify[type](message);
}

async function onSearch(event) {
  event.preventDefault();

  imageApi.query = event.currentTarget.elements.searchQuery.value;
  imageApi.resetPage();
  imageApi.resethitsCounter();

  if (!imageApi.query) return;

  try {
    const imgResponse = await imageApi.fetchImages();

    if (imgResponse.totalHits === 0) {
      showMessage('failure', 'Sorry, there are no images matching your search query. Please try again.');
      loadMoreButton.classList.add('is-hidden');
    } else {
      showMessage('success', `We found ${imgResponse.totalHits} images!`);
      loadMoreButton.classList.remove('is-hidden');
      createImageCard(imgResponse.hits);
    }

    if (imageApi.viewedHits === imageApi.totalHits && imgResponse.totalHits !== 0) {
      showMessage('info', "You've reached the end of search results.");
      loadMoreButton.classList.add('is-hidden');
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function onLoadMore() {
  try {
    const imgResponse = await imageApi.fetchImages();

    if (imageApi.viewedHits === imageApi.totalHits) {
      showMessage('info', "You've reached the end of search results.");
      loadMoreButton.classList.add('is-hidden');
    }

    createImageCard(imgResponse.hits);
    autoScroll();
  } catch (error) {
    console.log(error.message);
  }
}

function createImageCard(imageCard) {
  const markupList = imageCard.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
    <div class="photo-card">
      <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes: <span>${likes}</span></b>
        </p>
        <p class="info-item">
          <b>Views: <span>${views}</span></b>
        </p>
        <p class="info-item">
          <b>Comments: <span>${comments}</span></b>
        </p>
        <p class="info-item">
          <b>Downloads: <span>${downloads}</span></b>
        </p>
      </div>
    </div>`).join('');

  gallery.insertAdjacentHTML('beforeend', markupList);
  new SimpleLightbox('.gallery a');
}

function autoScroll() {
  const { height: cardHeight } = document.querySelector('.gallery').firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
