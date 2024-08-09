import axios from 'axios';

export function searchImagesByQuery({ page, per_page, q }) {
  axios.defaults.baseURL = 'https://pixabay.com/api/';
  const API_KEY = '45177061-dd77212e3ebf23708a837f031';

  return axios
    .get('', {
      params: {
        key: API_KEY,
        q,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page,
      },
    })
    .then(({ data }) => data);
}
