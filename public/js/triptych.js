let index = 0;

export function showTriptych(outputImage, styleImage, contentImage) {
  const trip = $('#triptych');

  // Set the images.
  index = 0;
  updateImages(contentImage, outputImage, styleImage);

  // Set the label to the artist name.
  try {
    const artistName = styleImage.split('/')[2].replace('_', ' ');
    $("#triptychLabel").text(artistName);
  } finally { }

  trip.modal('handleUpdate');
  trip.modal();

  
  $('#triptych-body').unbind('click').on('click', () => {
    index ++;
    updateImages(contentImage, outputImage, styleImage);
  });
}

function updateImages(contentImage, outputImage, styleImage) {
  const trip = $('#triptych');
  const images = trip.find('.triptych-img');

  const content = $(images[(0+index)%3]);
  const output = $(images[(1+index)%3]);
  const style = $(images[(2+index)%3]);

  content.css('background-image',`url(${contentImage})`)
  output.css('background-image',`url(${outputImage})`)
  style.css('background-image',`url(${styleImage})`)

  content.find('.triptych-fake-img').attr('src',contentImage);
  output.find('.triptych-fake-img').attr('src',outputImage);
  style.find('.triptych-fake-img').attr('src',styleImage);
}