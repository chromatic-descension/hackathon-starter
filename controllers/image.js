/**
 * GET /randomImage
 * Random image.
 */

const moment = require('moment');
const getDb = require('../utils/db');

exports.randomImage = async (req, res) => {
  const db = await getDb();
  const image = await db.collection('outputImages').aggregate([{ '$sample': { size: 1 } }]).next();

  res.render('partials/image', {
    outputImage: `/outputImages/${image.fileName}`,
    dateCreated: `Created ${moment(image._id.getTimestamp()).format('LL')}`,
    styleImage: getStylePath(image.stylePath),
    contentImage: getContentPath(image.contentPath),
  });
};

function getContentPath(fullPath) {
  const contentName = fullPath.replace(/^.*[\\\/]/, '');
  return `/contentImages/${contentName}`;
}

function getStylePath(fullPath) {
  const styleParts = fullPath.split('/');
  const nParts = styleParts.length;
  return `/styleImages/${styleParts[nParts-2]}/${styleParts[nParts-1]}`;
}