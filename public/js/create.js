import {showTriptych} from './triptych.js';

let timer = 0;

/* eslint-env jquery, browser */
$(document).ready(() => {
  setInterval(queryStatus, 100);
  $('#randomImageButton').on('click', ()=>{
    $.ajax({
      url: '/convertRandom',
      type: 'POST',
      success: (started) => {}
    });
  });

  const randomImage = $('#randomImage');
  randomImage.on('click', ()=>{
    const outputImage = randomImage.data('output-image');
    const styleImage = randomImage.data('style-image');
    const contentImage = randomImage.data('content-image');
    if (outputImage && styleImage && contentImage) {
      showTriptych(outputImage, styleImage, contentImage);
    }
  });
});

function queryStatus() {
  $.ajax({
    url: '/convertStatus',
    type: 'POST',
    success: (data) => {
      if (data.lastRandomOutput) {
        const outputPath = `/outputImages/${data.lastRandomOutput}?time=${timer}`;
        $('#randomImage').attr('src', outputPath);
        $('#randomImage').data('output-image', outputPath);

        if (data.lastRandomStyle) {
          $('#randomImage').data('style-image', data.lastRandomStyle);
        }
        if (data.lastRandomContent) {
          $('#randomImage').data('content-image', data.lastRandomContent);
        }
      }
      if (data.isConverting) {
        $('#randomImageText').text('Converting' + '.'.repeat(timer % 5));
      } else {
        $('#randomImageText').text('Not converting.')
      }
    }
  });
  timer ++;
}