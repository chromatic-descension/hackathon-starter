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
  const col = $('<div/>').addClass('col-md-4').append(image);
  const row = nextImageRow();
  row.append(col);

  col.on('click', ()=>{
    const img = col.find('img');
    const outputImage = img.data('output-image');
    const styleImage = img.data('style-image');
    const contentImage = img.data('content-image');
    showTriptych(outputImage, styleImage, contentImage);
  });
}

function nextImageRow() {
  const wrapper = $('#image-row-wrapper');
  if (wrapper.children().length === 0 || wrapper.children().last().children().length >= 3) {
    const row = ($('<div/>').addClass('row'));
    wrapper.append(row);
    return row;
  }
  return wrapper.children().last();
}

function showTriptych(outputImage, styleImage, contentImage) {
  trip = $('#triptych');

  // Set the images.
  images = trip.find('img');
  $(images[0]).attr('src', contentImage);
  $(images[1]).attr('src', styleImage);
  $(images[2]).attr('src', outputImage);

  // Set the label to the artist name.
  try {
    console.log(styleImage);
    const artistName = styleImage.split('/')[2].replace('_',' ');
    $("#triptychLabel").text(artistName);
  } finally {}

  trip.modal('handleUpdate');
  trip.modal();
}