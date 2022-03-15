import { showTriptych } from './triptych.js';

const QUERY_MS_SLOW = 1000;
const QUERY_MS_FAST = 200;

let interval = null;
let timer = 0;
let fast = false;

/* eslint-env jquery, browser */
$(document).ready(() => {
  setupQueryStatus(QUERY_MS_SLOW);
  $('#randomImageButton').on('click', () => {
    $.ajax({
      url: '/convertRandom',
      type: 'POST',
      success: (started) => { }
    });
  });

  $('#autoConvertToggle').change(()=>{
    const val = $('#autoConvertToggle').prop('checked');
    $.ajax({
      url: '/autoConvert',
      type: 'POST',
      data: {val},
      success: (data) => {}
    });
  })

  const randomImage = $('#randomImage');
  randomImage.on('click', () => {
    const outputImage = randomImage.data('output-image');
    const styleImage = randomImage.data('style-image');
    const contentImage = randomImage.data('content-image');
    if (outputImage && styleImage && contentImage) {
      showTriptych(outputImage, styleImage, contentImage);
    }
  });
});

function setupQueryStatus(ms) {
  if (interval) clearInterval(interval);
  interval = setInterval(queryStatus, ms);
}

function queryStatus() {
  $.ajax({
    url: '/convertStatus',
    type: 'POST',
    success: (data) => {
      if (data.lastRandomOutput && data.lastMessage) {
        const outputPath = `/outputImages/${data.lastRandomOutput}?time=${timer}`;
        $('#randomImage').attr('src', outputPath);
        $('#randomImage').data('output-image', outputPath);
        if (data.autoConverting && !$('#autoConvertToggle').prop('checked')) {
          $('#autoConvertToggle').bootstrapToggle('on');
        }
        if (data.lastRandomStyle) {
          $('#randomImage').data('style-image', data.lastRandomStyle);
        }
        if (data.lastRandomContent) {
          $('#randomImage').data('content-image', data.lastRandomContent);
        }
      }
      if (data.isConverting) {
        if (!fast) {
          fast = true;
          setupQueryStatus(QUERY_MS_FAST);
        }
        $('#randomImageText').text('Converting' + '.'.repeat(timer % 5));
        $('#randomImageButtonLoadingIcon').show();
        $('#randomImageButtonWaitingIcon').hide();
        $('#randomImageButton').attr("disabled", true);
      } else {
        if (fast) {
          fast = false;
          setupQueryStatus(QUERY_MS_SLOW);
        }
        $('#randomImageText').text('Not converting.')
        $('#randomImageButtonLoadingIcon').hide();
        $('#randomImageButtonWaitingIcon').show();
        $('#randomImageButton').attr("disabled", false);
      }
    }
  });
  timer++;
}