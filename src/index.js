import './css/styles.css';
import API from './js/fetchPictures';
import { Notify } from "notiflix";
//import Notiflix from 'notiflix';
import cardsTpl from './templates/cards.hbs';
import SimpleLightbox from "simplelightbox";


const refs = {
  searchForm: document.querySelector('.search-form'),
  cards: document.querySelector('.gallery'),
  buttonLoadMore: document.querySelector('.load-more'),
};

refs.buttonLoadMore.addEventListener("click", OnMore);
refs.searchForm.addEventListener('submit', onSearch);
let page = 1;
let name;
  
async function onSearch(e) {
  e.preventDefault();
  name = e.currentTarget.elements.searchQuery.value;
  if (name.trim() === "") { Notify.failure("Sorry, there are no images matching your search query. Please try again."); return;}
  try {
    const cards = await API.fetchPictures(name, page);
     clearimagesContainer();
    if (cards.data.total > 0) {
      refs.buttonLoadMore.classList.remove('is-hidden');
      renderCardsimages(cards);
       Notify.info(`Hooray! We found ${cards.data.total} images.`);
    }
    else
    {
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
  const cards = await API.fetchPictures(name, ++page);
  renderCardsimages(cards);
  Notify.info(`Hooray! We found ${cards.data.total} images.`);

  //Box();

}
//---------------------------------------------------



// 1 - fetch картинки
// 2 - рисуем
// 3 - рефреш либы

async function Box()
{
  let gallery = new SimpleLightbox('.gallery a');
gallery.on('show.simplelightbox', function () {
	// do something…
  console.log("eddeded");
});

}
