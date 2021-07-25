import './css/styles.css';
import API from './js/fetchPictures';
import { Notify } from "notiflix";
import cardsTpl from './templates/cards.hbs';
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.css';

let lightbox = new SimpleLightbox('.gallery a');
let pageNumber;
let name;

const refs = {
  searchForm: document.querySelector('.search-form'),
  cards: document.querySelector('.gallery'),
  buttonLoadMore: document.querySelector('.load-more'),
};

refs.buttonLoadMore.addEventListener("click", OnMore);
refs.searchForm.addEventListener('submit', onSearch);

  
async function onSearch(e) {
  pageNumber = 1;
  e.preventDefault();
  name = e.currentTarget.elements.searchQuery.value;

  if (name.trim() === "") {
   
    Notify.failure("Sorry, there are no images matching your search query. Please try again."); return;
  }
  
  try {
    const cards = await API.fetchPictures(name, pageNumber);
    
    clearimagesContainer();

    const totalHits = cards.totalHits;
    
    if (totalHits > 0) {
      refs.buttonLoadMore.classList.remove('is-hidden');
      renderCardsimages(cards);
      Notify.info(`Hooray! We found ${totalHits} images.`);
      lightbox.refresh();
    }
    else
    {refs.buttonLoadMore.classList.add('is-hidden');
     Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      }
  }
  catch (error) {
    console.log(error);
  }
}

function renderCardsimages(cards) {
  const markup = cardsTpl(cards);
  refs.cards.insertAdjacentHTML('beforeend', markup);
}

function clearimagesContainer() {
  refs.cards.innerHTML = '';
}

async function OnMore() {
  
  let count=0;
  const cards = await API.fetchPictures(name, ++pageNumber);
  renderCardsimages(cards);
 lightbox.refresh();
  count = pageNumber * cards.hits.length;
  console.log("Общее кол-во", count );
  console.log("всего на странице", cards.totalHits );

  
  if (count ===0 || count >= cards.totalHits)
   {
   refs.buttonLoadMore.classList.add('is-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
  
// плавная прокрутка страницы
  const { height: cardHeight } = document
  .querySelector('.gallery')
  .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });

}

