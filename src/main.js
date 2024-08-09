import { searchImagesByQuery } from './js/pixabay-api.js';
import { createListMarkup } from './js/render-functions.js';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const searchForm = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery-list');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.btn-primary');

const params = {
  q: '',
  page: 1,
  per_page: 15,
  maxPage: 0,
};

function hide() {
  loadMoreBtn.classList.add('is-hidden');
}
function show() {
  loadMoreBtn.classList.remove('is-hidden');
}
function disable() {
  loadMoreBtn.disabled = true;
}

function enable() {
  loadMoreBtn.disabled = false;
}

searchForm.addEventListener('submit', onSubmitBtn);

hide();

async function onSubmitBtn(event) {
  event.preventDefault();

  galleryList.innerHTML = '';
  loader.classList.remove('hidden');

  const form = event.currentTarget;
  params.q = form.elements.query.value.trim();

  if (params.q === '') {
    iziToast.error({
      position: 'topRight',
      message: 'Please fill the input',
    });
    form.reset();
    loader.classList.add('hidden');
    hide();
    return;
  }

  params.page = 1;
  //   show();
  disable();

  try {
    const { total, hits } = await searchImagesByQuery(params);
    params.maxPage = Math.ceil(total / params.per_page);
    createListMarkup(hits);
    if (params.maxPage > 1) {
      show();
      enable();
      loadMoreBtn.addEventListener('click', onLoadMore);
    } else {
      hide();
    }
    if (hits.length === 0) {
      iziToast.error({
        position: 'topRight',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
      loader.classList.add('hidden');
      return;
    }
  } catch (err) {
    onFetchError(err);
  } finally {
    form.reset();
    loader.classList.add('hidden');
  }
}
function onFetchError(error) {
  galleryList.innerHTML = '';
  iziToast.error({
    position: 'topRight',
    message: `${error}`,
  });
}

async function onLoadMore() {
  params.page += 1;
  disable();
  loader.classList.remove('hidden');
  try {
    const response = await searchImagesByQuery(params);
    createListMarkup(response.hits);

    const elem = document.querySelector('.scrol');
    const rect = elem.getBoundingClientRect();
    window.scrollBy({
      top: rect.height * 2,
      behavior: 'smooth',
    });
  } catch (err) {
    onFetchError(err);
  } finally {
    loader.classList.add('hidden');
    if (params.page === params.maxPage) {
      hide();
      iziToast.info({
        message: 'You have reached the end of search results.',
        position: 'topRight',
        messageColor: '#ffffff',
        backgroundColor: '#4e75ff',
      });
      loadMoreBtn.removeEventListener('click', onLoadMore);
    } else {
      enable();
    }
  }
}
