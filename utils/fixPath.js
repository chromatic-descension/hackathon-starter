exports.getContentPath = (image) => {
  const path = image.contentPath ? image.contentPath : image.path;
  const contentName = path.replace(/^.*[\\\/]/, '');
  return `/contentImages/${contentName}`;
}

exports.getStylePath = (image) => {
  const path = image.stylePath ? image.stylePath : image.path;
  const styleParts = path.split('/');
  const nParts = styleParts.length;
  return `/styleImages/${styleParts[nParts - 2]}/${styleParts[nParts - 1]}`;
}

exports.getOutputPath = (image) => {
  return `/outputImages/${image.fileName}`;
}