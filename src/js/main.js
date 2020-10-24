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
      console.log(series);
      for (let serie of series) {
        //Titulo serie
        const resultTitle__paragr = document.createElement('p');
        const resultTitle__content = document.createTextNode(serie.show.name);
        resultTitle__paragr.appendChild(resultTitle__content);
        //foto serie
        const resultImg__container = document.createElement('img');
        resultImg__container.classList.add('resultImg');
        resultImg__container.classList.add('js-resultImg');
        //seleccionamos la imagen, si no existe creamos una con el nombre
        if (serie.show.image) {
          resultImg__container.src = serie.show.image.original;
        } else {
          resultImg__container.src = '//via.placeholder.com/210x295/ffffff/666666/?text=' + serie.show.name;
        }
        // Incluir en div
        includeInMyDiv(resultTitle__paragr, resultImg__container);
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

searchButton.addEventListener('click', getData);

//Borrar antes de subir
searchButton.click();
