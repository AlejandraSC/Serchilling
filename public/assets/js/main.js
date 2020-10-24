'use strict';

const searchButton = document.querySelector('.js-search__btn');
const request = document.querySelector('.js-inputText');
const results = document.querySelector('.results__container');
let series = [];
let favoritLis = [];
let indexFavContainers = 0;

function getData() {
  const userValue = request.value;
  fetch('//api.tvmaze.com/search/shows?q=' + userValue)
    .then((response) => response.json())
    .then((data) => {
      series = data;

      for (let i = 0; i < series.length; i++) {
        paintSerie(series[i], i, results);
      }
      listenImages();
    });
}

function paintSerie(serie, index, container) {
  const tittle = createTitle(serie.show.name);
  const img = createImg(serie);
  const divContainer = createDiv(tittle, img, index);

  container.appendChild(divContainer);
}

function listenImages() {
  const seriesImg = document.querySelectorAll('.eachSerie__container');
  for (const serieImg of seriesImg) {
    serieImg.addEventListener('click', favSeries);
  }
}

function favSeries(ev) {
  const fav = document.querySelector('.fav__container');
  const serieToInclude = series[ev.currentTarget.id];
  favoritLis.push(serieToInclude);
  paintSerie(serieToInclude, indexFavContainers, fav);
  indexFavContainers++;
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
  const resultTitle__content = document.createTextNode(name);
  resultTitle__paragr.appendChild(resultTitle__content);
  return resultTitle__paragr;
}

function createDiv(title, img, index) {
  const eachSerie__container = document.createElement('div');
  eachSerie__container.classList.add('eachSerie__container');
  eachSerie__container.id = index;
  eachSerie__container.appendChild(title);
  eachSerie__container.appendChild(img);
  return eachSerie__container;
}

searchButton.addEventListener('click', getData);

//Borrar antes de subir
searchButton.click();

//# sourceMappingURL=main.js.map
