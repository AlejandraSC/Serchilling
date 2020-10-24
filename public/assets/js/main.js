'use strict';

const searchButton = document.querySelector('.js-search__btn');
const request = document.querySelector('.js-inputText');
const results = document.querySelector('.results__container');

//Recoger lo que ha escrito el usuario y PINTAR SERIE BUSCADA (PASARLO A UNA FUNCIÓN NUEVA PARA QUE QUEDE MÁS LIMPIOFunction paintRequest)

function getData() {
  const userValue = request.value;
  fetch('//api.tvmaze.com/search/shows?q=' + userValue)
    .then((response) => response.json())
    .then((series) => {
      for (let serie of series) {
        //Titulo serie
        const resultTitle__paragr = document.createElement('p');
        const resultTitle__content = document.createTextNode(serie.show.name);
        resultTitle__paragr.appendChild(resultTitle__content);
        console.log(resultTitle__paragr);

        //foto serie
        const resultImg__container = document.createElement('img');
        resultImg__container.classList.add('resultImg');
        resultImg__container.classList.add('js-resultImg');
        resultImg__container.src = serie.show.image.original;
        console.log(resultImg__container);

        // Incluir en div
        includeInMyDiv(resultTitle__paragr, resultImg__container);

        listenImages();
      }
    });
}

function includeInMyDiv(title, img) {
  const eachSerie__container = document.createElement('div');
  eachSerie__container.classList.add('eachSerie__container');
  eachSerie__container.appendChild(title);
  eachSerie__container.appendChild(img);
  results.appendChild(eachSerie__container);
}

function listenImages() {
  const seriesImg = document.querySelectorAll('.js-resultImg');
  for (const serieImg of seriesImg) {
    serieImg.addEventListener('click', favSeries);
  }
}

//SERIES FAVORITAS
/*function favSeries(ev) {
  const fav = document.querySelector('.fav__container');
  console.log('escucho evento');
  console.log(ev.path[0].src);
  const favSerie = document.createElement('img');
  favSerie.src = ev.path[0].src;
  fav.appendChild(favSerie);
}
*/

function favSeries(ev) {
  const fav = document.querySelector('.fav__container');
  console.log('escucho evento');
}

searchButton.addEventListener('click', getData);

/*
resultImg__container.addEventListener('click', favourites);

1. Escuchar el evento click de cada imágen 
2. Identificar el elemento clicado
3. guardar en un Array cuales son las favoritas 
4. Añadir la clase de favorito (Borde cambia a rojo)
5. Quitar la clase de favorito

*/

//Borrar antes de subir
searchButton.click();

//# sourceMappingURL=main.js.map
