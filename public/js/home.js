import {showTriptych} from './triptych.js';

/* eslint-env jquery, browser */
$(document).ready(() => {

  window.onscroll = function() {
    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
     getRandomImage();
    }
   }

  for (let i = 0; i < 15; i++) {
    getRandomImage();
  }
});


function getRandomImage() {
  fetch('/randomImage').then((response) => {
    return response.text();
  }).then((html) => {
    const image = new DOMParser().parseFromString(html, 'text/html').querySelector('body > :first-child');
    addImage(image);
  }).catch((err) => {
    console.warn('Something went wrong.', err);
  });
}

function addImage(image) {
  const count = $('.image-column').length;
  let lowestCol = null;
  let lowestY = Infinity;
  for (let i=0; i<count; i++ ){
    const col = $(`#imageColumn${i}`);
    const bottom = col.get(0).getBoundingClientRect().bottom;
    if (bottom < lowestY) {
      lowestY = bottom;
      lowestCol = col;
    }
  }
  lowestCol.append(image);

  $(image).on('click', ()=>{
    const img = $(image).find('img');
    const outputImage = img.data('output-image');
    const styleImage = img.data('style-image');
    const contentImage = img.data('content-image');
    showTriptych(outputImage, styleImage, contentImage);
  });
}

function nextImageRow() {
  const wrapper = $('#image-row-wrapper');
  if (wrapper.children().length === 0 || wrapper.children().last().children().length >= 3) {
    const row = ($('<div/>').addClass('row').addClass('image-row'));
    wrapper.append(row);
    return row;
  }
  return wrapper.children().last();
}