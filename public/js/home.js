import { showTriptych } from './triptych.js';

/* eslint-env jquery, browser */
$(document).ready(() => {
  getRecentOutputs();
  window.onscroll = async () => {
    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
      await getNextRenderedOutput(recentOutputIndex++);
    }
  }
});

let recentOutputs = null;
let recentOutputIndex = 0;

function getRecentOutputs() {
  $.ajax({
    url: '/recentOutputs',
    type: 'POST',
    success: async (data) => {
      recentOutputs = data;
      for (let i = 0; i < 20; i++) {
        await getNextRenderedOutput(recentOutputIndex++);
      }
    }
  });
}

function addImage(image) {
  const count = $('.image-column').length;
  let lowestCol = null;
  let lowestY = Infinity;
  for (let i = 0; i < count; i++) {
    const col = $(`#imageColumn${i}`);
    const bottom = col.get(0).getBoundingClientRect().bottom;
    if (bottom < lowestY) {
      lowestY = bottom;
      lowestCol = col;
    }
  }
  lowestCol.append(image);

  $(image).on('click', () => {
    const img = $(image).find('img');
    const outputImage = img.data('output-image');
    const styleImage = img.data('style-image');
    const contentImage = img.data('content-image');
    showTriptych(outputImage, styleImage, contentImage);
  });
}

async function getNextRenderedOutput(index) {
  if (recentOutputs == null || index >= recentOutputs.length) return null;

  await fetch('/outputImage?' + new URLSearchParams({fileName: recentOutputs[index]}))
    .then((response) => {
      return response.text();
    }).then((html) => {
      const image = new DOMParser().parseFromString(html, 'text/html').querySelector('body > :first-child');
      addImage(image);
    }).catch((err) => {
      console.warn('Something went wrong.', err);
    });
}