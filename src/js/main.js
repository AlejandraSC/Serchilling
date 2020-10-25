'use strict';

const searchButton = document.querySelector('.js-search__btn');
const request = document.querySelector('.js-inputText');
const results = document.querySelector('.results__container');
const deleteButton = document.querySelector('.deleteButton');

let series = [];
let seriesFav = [];

function getData() {
  const userValue = request.value;
  fetch('//api.tvmaze.com/search/shows?q=' + userValue)
    .then((response) => response.json())
    .then((data) => {
      cleanResultDiv(results);
      series = data;
      for (let i = 0; i < series.length; i++) {
        const ind = getFavInd();
        const id = series[i].show.id;
        if (ind.indexOf(parseInt(series[i].show.id)) != -1) {
          paintSerie(series[i], id, results, 'eachSerie__container', true);
        } else {
          paintSerie(series[i], id, results, 'eachSerie__container', false);
        }
      }
      listenImages();
    });
}

function paintSerie(serie, index, container, containerName, isFav) {
  const tittle = createTitle(serie.show.name);
  const img = createImg(serie);
  const divContainer = createDiv(tittle, img, index, containerName, isFav);
  container.appendChild(divContainer);
  return divContainer;
}

function listenImages() {
  const seriesImg = document.querySelectorAll('.eachSerie__container');
  for (const serieImg of seriesImg) {
    serieImg.addEventListener('click', favSeries);
  }
}

function favSeries(ev) {
  console.log(ev.currentTarget);

  const serieToInclude = series.find((name) => name.show.id == ev.currentTarget.id);
  const id = serieToInclude.show.id;

  let ind = getFavInd();

  if (ind.indexOf(parseInt(id)) == -1) {
    seriesFav.push(serieToInclude);
    const favContainer = document.querySelector('.fav__container');
    const containerAddedToFav = paintSerie(serieToInclude, id, favContainer, 'eachSerieFav__container');
    containerAddedToFav.addEventListener('click', removeFav);
    localStorage.removeItem('favSeries');
    if (seriesFav.length > 0) {
      setLocalStorage(seriesFav);
    }
    ev.currentTarget.classList.add('alreadyFav');
  }
}

function getFavInd() {
  let ind = [];
  for (let serieFav of seriesFav) {
    ind.push(parseInt(serieFav.show.id));
  }
  return ind;
}

function removeFav(ev) {
  ev.currentTarget.remove();
  //Creamos un array de indices auxiliar para ver que IDs tenemos y hacer un indexOf
  let ind = getFavInd();

  const serieToRemove = ind.indexOf(parseInt(ev.currentTarget.id));
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

function setLocalStorage(seriesFav) {
  localStorage.setItem('favSeries', JSON.stringify(seriesFav));
}

function getLocalStorage() {
  const localfavSeries = localStorage.getItem('favSeries');
  const localfavSeriesJson = JSON.parse(localfavSeries);
  if (localfavSeriesJson === null) {
    getData();
  } else {
    seriesFav = localfavSeriesJson;
    paintLocalstoreSeries();
  }
}

function paintLocalstoreSeries() {
  for (let serie of seriesFav) {
    const favContainer = document.querySelector('.fav__container');
    const containerAddedToFav = paintSerie(serie, serie.show.id, favContainer, 'eachSerieFav__container', false);
    containerAddedToFav.addEventListener('click', removeFav);
  }
}

function createImg(serie) {
  const resultImg__container = document.createElement('img');
  resultImg__container.classList.add('resultImg');
  resultImg__container.classList.add('js-resultImg');
  //seleccionamos la imagen, si no existe creamos una con el nombre
  if (serie.show.image) {
    resultImg__container.src = serie.show.image.original;
  } else {
    resultImg__container.src = '//via.placeholder.com/210x295/ffffff/666666/?text=' + serie.show.name;
  }
  return resultImg__container;
}

function createTitle(name) {
  const resultTitle__paragr = document.createElement('p');
  resultTitle__paragr.classList.add('resultTitle');
  const resultTitle__content = document.createTextNode(name);
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

function cleanResultDiv(divToclean) {
  while (divToclean.firstChild) {
    divToclean.removeChild(divToclean.firstChild);
  }
}

function deleteFav() {
  console.log('Is working');
  localStorage.removeItem('favSeries');
  seriesFav = [];
  const favContainer = document.querySelector('.fav__container');
  cleanResultDiv(favContainer);

  const eachSerie__containers = document.querySelectorAll('.eachSerie__container');
  for (const container of eachSerie__containers) {
    container.classList.remove('alreadyFav');
  }
}

searchButton.addEventListener('click', getData);
deleteButton.addEventListener('click', deleteFav);

getLocalStorage();
