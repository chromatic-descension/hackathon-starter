exports.getContentPath = (fullPath) => {
    const contentName = fullPath.replace(/^.*[\\\/]/, '');
    return `/contentImages/${contentName}`;
  }
  
exports.getStylePath = (fullPath) => {
    const styleParts = fullPath.split('/');
    const nParts = styleParts.length;
    return `/styleImages/${styleParts[nParts-2]}/${styleParts[nParts-1]}`;
}