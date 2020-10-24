'use strict';

const searchButton = document.querySelector('.js-search__btn');
const request = document.querySelector('.js-inputText');
const results = document.querySelector('.results__container');
let series = [];
let seriesFav = [];
let indexFavContainers = 0;

function getData() {
  const userValue = request.value;
  console.log(userValue);
  fetch('//api.tvmaze.com/search/shows?q=' + userValue)
    .then((response) => response.json())
    .then((data) => {
      cleanDiv();
      series = data;
      for (let i = 0; i < series.length; i++) {
        paintSerie(series[i], i, results, 'eachSerie__container');
      }
      listenImages();
    });
}

function paintSerie(serie, index, container, containerName) {
  const tittle = createTitle(serie.show.name);
  const img = createImg(serie);
  const divContainer = createDiv(tittle, img, index, containerName);
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
  if (!seriesFav.includes(series[ev.currentTarget.id])) {
    seriesFav.push(series[ev.currentTarget.id]);
    const favContainer = document.querySelector('.fav__container');
    const serieToInclude = series[ev.currentTarget.id];
    const containerAddedToFav = paintSerie(serieToInclude, indexFavContainers, favContainer, 'eachSerieFav__container');
    indexFavContainers++;
    // console.log(containerAddedToFav);

    containerAddedToFav.addEventListener('click', removeFav);
  }
  setLocalStorage();
}

function removeFav(ev) {
  ev.currentTarget.remove();
  seriesFav.splice(series[ev.currentTarget.id], 1);
}

function setLocalStorage() {
  localStorage.setItem('favSeries', JSON.stringify(series));
}

function getLocalStorage() {
  const localfavSeries = localStorage.getItem('favSeries');
  const localfavSeriesJson = JSON.parse(localfavSeries);
  if (localfavSeriesJson === null) {
    getData();
  } else {
    favSeries = localfavSeriesJson;
    paintSerie();
    listenImages();
  }
}
/*

































*/

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

function createDiv(title, img, index, containerName) {
  const eachSerie__container = document.createElement('div');
  eachSerie__container.classList.add(containerName);
  eachSerie__container.id = index;
  eachSerie__container.appendChild(img);
  eachSerie__container.appendChild(title);

  return eachSerie__container;
}

function cleanDiv() {
  while (results.firstChild) {
    results.removeChild(results.firstChild);
  }
}

searchButton.addEventListener('click', getData);

//Borrar antes de subir
searchButton.click();

//getlocal
//getLocalStorage();
