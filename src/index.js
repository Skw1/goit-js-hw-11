import './styles.css';
import ImageApi from './fetch-images';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');
const imageApi = new ImageApi();

searchForm.addEventListener('submit', search);
loadBtn.addEventListener('click', onLoadMore);
loadBtn.classList.add('is-hidden');

async function search(event) {
  event.preventDefault();
  const query = event.currentTarget.elements.searchQuery.value;

  if (!query) return;

  try {
    imageApi.query = query;
    imageApi.resetPage();
    imageApi.resethitsCounter();

    const imgResponse = await imageApi.fetchImages();

    if (imgResponse.totalHits === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      loadBtn.classList.add('is-hidden');
    } else {
      Notiflix.Notify.success(`We found ${imgResponse.totalHits} images!`);
      loadBtn.classList.remove('is-hidden');
      createImageCard(imgResponse.hits);
    }

    if (imageApi.viewedHits === imageApi.totalHits && imgResponse.totalHits !== 0) {
      Notiflix.Notify.info("You've reached the end of search results.");
      loadBtn.classList.add('is-hidden');
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function onLoadMore() {
  try {
    const imgResponse = await imageApi.fetchImages();

    if (imageApi.viewedHits === imageApi.totalHits) {
      Notiflix.Notify.info("You've reached the end of search results.");
      loadBtn.classList.add('is-hidden');
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
        <p class="info-item"><b>Likes: <span>${likes}</span></b></p>
        <p class="info-item"><b>Views: <span>${views}</span></b></p>
        <p class="info-item"><b>Comments: <span>${comments}</span></b></p>
        <p class="info-item"><b>Downloads: <span>${downloads}</span></b></p>
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
