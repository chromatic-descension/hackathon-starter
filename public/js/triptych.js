export function showTriptych(outputImage, styleImage, contentImage) {
    const trip = $('#triptych');
  
    // Set the images.
    const images = trip.find('img');
    $(images[0]).attr('src', contentImage);
    $(images[1]).attr('src', styleImage);
    $(images[2]).attr('src', outputImage);
  
    // Set the label to the artist name.
    try {
      const artistName = styleImage.split('/')[2].replace('_',' ');
      $("#triptychLabel").text(artistName);
    } finally {}
  
    trip.modal('handleUpdate');
    trip.modal();
  }