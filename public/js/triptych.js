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