'use strict';

const searchButton = document.querySelector('.js-search__btn');
const request = document.querySelector('.js-inputText');
const results = document.querySelector('.results__container');
let series = [];
let seriesFav = [];

function getData() {
  const userValue = request.value;

  fetch('//api.tvmaze.com/search/shows?q=' + userValue)
    .then((response) => response.json())
    .then((data) => {
      cleanResultDiv();
      series = data;
      console.log(series);
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
  const serieToInclude = series[ev.currentTarget.id];
  const id = serieToInclude.show.id;

  if (!seriesFav.includes(serieToInclude)) {
    seriesFav.push(serieToInclude);
    const favContainer = document.querySelector('.fav__container');
    const containerAddedToFav = paintSerie(serieToInclude, id, favContainer, 'eachSerieFav__container');
    containerAddedToFav.addEventListener('click', removeFav);
    localStorage.removeItem('favSeries');
    if (seriesFav.length > 0) {
      setLocalStorage(seriesFav);
    }
  }
}

function removeFav(ev) {
  ev.currentTarget.remove();

  //Creamos un array de indices auxiliar para ver que IDs tenemos y hacer un indexOf
  let ind = [];
  for (let serieFav of seriesFav) {
    ind.push(parseInt(serieFav.show.id));
  }
  const serieToRemove = ind.indexOf(parseInt(ev.currentTarget.id));
  seriesFav.splice(serieToRemove, 1);
  localStorage.removeItem('favSeries');
  if (seriesFav.length > 0) {
    setLocalStorage(seriesFav);
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
    const containerAddedToFav = paintSerie(serie, serie.show.id, favContainer, 'eachSerieFav__container');
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

function createDiv(title, img, index, containerName) {
  const eachSerie__container = document.createElement('div');
  eachSerie__container.classList.add(containerName);
  eachSerie__container.id = index;
  eachSerie__container.appendChild(img);
  eachSerie__container.appendChild(title);

  return eachSerie__container;
}

function cleanResultDiv() {
  while (results.firstChild) {
    results.removeChild(results.firstChild);
  }
}

searchButton.addEventListener('click', getData);

//Borrar antes de subir
searchButton.click();

//getlocal
getLocalStorage();
