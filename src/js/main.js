'use strict';

const request = document.querySelector('.js-inputText');
const results = document.querySelector('.results__container');
const searchButton = document.querySelector('.js-search__btn');
searchButton.addEventListener('click', getData);
const deleteButton = document.querySelector('.deleteButton');
deleteButton.addEventListener('click', deleteAllFav);

let series = [];
let seriesFav = [];

//LOCAL STORAGE
getLocalStorage();

function getLocalStorage() {
  const localfavSeries = localStorage.getItem('favSeries');
  const localfavSeriesJson = JSON.parse(localfavSeries);
  if (localfavSeriesJson !== null) {
    seriesFav = localfavSeriesJson;
    paintLocalstoreSeries();
  }
}

function paintLocalstoreSeries() {
  for (let serie of seriesFav) {
    const favContainer = document.querySelector('.fav__container');
    const containerAddedToFav = paintSerie(serie, serie.show.id, favContainer, 'eachSerieFav__container', false, 'resultFavTitle');
    containerAddedToFav.addEventListener('click', removeFav);
  }
}

function setLocalStorage(seriesFav) {
  localStorage.setItem('favSeries', JSON.stringify(seriesFav));
}

//PAINT RESULT
function getData() {
  const userValue = request.value;
  fetch('//api.tvmaze.com/search/shows?q=' + userValue)
    .then((response) => response.json())
    .then((data) => {
      cleanDiv(results);
      series = data;
      const favArray = getFavInd();
      for (let i = 0; i < series.length; i++) {
        const idSerie = parseInt(series[i].show.id);

        if (favArray.indexOf(idSerie) != -1) {
          paintSerie(series[i], idSerie, results, 'eachSerie__container', true, 'resultTitle');
        } else {
          paintSerie(series[i], idSerie, results, 'eachSerie__container', false, 'resultTitle');
        }
      }
      listenImages();
    });
}

function paintSerie(serie, index, mainContainer, containerName, isFav, containerTitle) {
  const tittle = createTitle(serie.show.name, containerTitle);
  const img = createImg(serie);
  const divContainer = createDiv(tittle, img, index, containerName, isFav);
  mainContainer.appendChild(divContainer);
  return divContainer;
}

function listenImages() {
  const seriesImg = document.querySelectorAll('.eachSerie__container');
  for (const serieImg of seriesImg) {
    serieImg.addEventListener('click', favSeries);
  }
}

//INCLUDE OR REMOVE FAV FROM RESULTS
function favSeries(ev) {
  const serieToInclude = series.find((name) => name.show.id == ev.currentTarget.id);
  const id = serieToInclude.show.id;

  let favArray = getFavInd();

  if (favArray.indexOf(parseInt(id)) == -1) {
    seriesFav.push(serieToInclude);
    ev.currentTarget.classList.add('alreadyFav');

    const favContainer = document.querySelector('.fav__container');
    const containerAddedToFav = paintSerie(serieToInclude, id, favContainer, 'eachSerieFav__container', false, 'resultFavTitle');
    containerAddedToFav.addEventListener('click', removeFav);
    localStorage.removeItem('favSeries');
    if (seriesFav.length > 0) {
      setLocalStorage(seriesFav);
    }
  } else {
    removeFavFromResult(ev.currentTarget.id);
  }
}

function removeFavFromResult(id) {
  const eachSerieFav__containers = document.querySelectorAll('.eachSerieFav__container');
  for (const container of eachSerieFav__containers) {
    if (container.id == id) {
      container.remove();
    }
  }

  let favArray = getFavInd();
  const serieToRemove = favArray.indexOf(id);
  seriesFav.splice(serieToRemove, 1);
  localStorage.removeItem('favSeries');
  if (seriesFav.length > 0) {
    setLocalStorage(seriesFav);
  }

  const eachSerie__containers = document.querySelectorAll('.eachSerie__container');
  for (const container of eachSerie__containers) {
    if (container.id == id) {
      container.classList.remove('alreadyFav');
    }
  }
}

//REMOVE FAV FROM FAV
function removeFav(ev) {
  ev.currentTarget.remove();
  let favArray = getFavInd();

  const serieToRemove = favArray.indexOf(parseInt(ev.currentTarget.id));
  seriesFav.splice(serieToRemove, 1);
  localStorage.removeItem('favSeries');
  if (seriesFav.length > 0) {
    setLocalStorage(seriesFav);
  }

  const eachSerie__containers = document.querySelectorAll('.eachSerie__container');
  for (const container of eachSerie__containers) {
    if (container.id == parseInt(ev.currentTarget.id)) {
      container.classList.remove('alreadyFav');
    }
  }
}

//DELETE ALL FAVS
function deleteAllFav() {
  localStorage.removeItem('favSeries');
  seriesFav = [];

  const favContainer = document.querySelector('.fav__container');
  cleanDiv(favContainer);

  const eachSerie__containers = document.querySelectorAll('.eachSerie__container');
  for (const container of eachSerie__containers) {
    container.classList.remove('alreadyFav');
  }
}

//AUX FUNCTION
function getFavInd() {
  let ind = [];
  for (let serieFav of seriesFav) {
    ind.push(parseInt(serieFav.show.id));
  }
  return ind;
}

//MODIFY THE HTML DOM
function createImg(serie) {
  const resultImg__container = document.createElement('img');
  resultImg__container.classList.add('resultImg');
  resultImg__container.classList.add('js-resultImg');
  if (serie.show.image) {
    resultImg__container.src = serie.show.image.original;
  } else {
    resultImg__container.src = '//via.placeholder.com/210x295/ffffff/666666/?text=' + serie.show.name;
  }
  return resultImg__container;
}

function createTitle(title, containerTextTittle) {
  const resultTitle__paragr = document.createElement('p');
  resultTitle__paragr.classList.add(containerTextTittle);
  const resultTitle__content = document.createTextNode(title);
  resultTitle__paragr.appendChild(resultTitle__content);
  return resultTitle__paragr;
}

function createDiv(title, img, index, containerName, isFav) {
  const eachSerie__container = document.createElement('div');
  eachSerie__container.classList.add(containerName);
  if (isFav) {
    eachSerie__container.classList.add('alreadyFav');
  }
  eachSerie__container.id = index;
  eachSerie__container.appendChild(img);
  eachSerie__container.appendChild(title);
  return eachSerie__container;
}

function cleanDiv(divToclean) {
  while (divToclean.firstChild) {
    divToclean.removeChild(divToclean.firstChild);
  }
}
