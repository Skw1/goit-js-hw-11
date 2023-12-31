import axios from 'axios';

export default class ImageApi {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.viewedHits = 0;
    this.totalHits = 0;
    this.KEY = '41336061-ccc3d5cdbb0cd5c3c85863297';
  }

  async fetchImages() {
    try {
      const response = await axios.get(
        `https://pixabay.com/api/?key=${this.KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`
      );

      this.incrementPage();
      this.hitsCounter(response);
      this.totalHits = response.data.totalHits;

      return response.data;
    } catch (error) {
      console.error('Error fetching images:', error);
      throw error; 
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  hitsCounter(response) {
    this.viewedHits += response.data.hits.length;
  }

  resethitsCounter() {
    this.viewedHits = 0;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}