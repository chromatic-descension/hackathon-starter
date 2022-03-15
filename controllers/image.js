const moment = require('moment');

const backend = require('../backend/backend');
const getDb = require('../utils/db');
const fixPath = require('../utils/fixPath');

/**
 * GET /randomImage
 * Random image.
 */
exports.getRandomImage = async (req, res) => {
  const image = await backend.getRandomOutput();
  res.render('partials/image', packageOutput(image));
};

/**
 * GET /outputImage
 * Get a rendered output image.
 */
exports.getOutputImage = async (req, res) => {
  const fileName = req.query.fileName;
  const image = await backend.getOutputImage(fileName);
  if (image) {
    res.render('partials/image', packageOutput(image));
  } else {
    res.sendStatus(404);
  }
};

/**
 * POST /recentOutputs
 * Get the most recent output image details.
 */
exports.getRecentOutputs = async (req, res) => {
  const outputs = await backend.getMostRecentOutputs();
  res.send(outputs.map(output => output.fileName)); 
};

function packageOutput(image) {
  return {
    // dateCreated: `Created ${moment(image._id.getTimestamp()).format('LL')}`,
    dateCreated: `Created ${moment(image._id.getTimestamp()).fromNow()}`,
    outputImage: fixPath.getOutputPath(image),
    styleImage: fixPath.getStylePath(image),
    contentImage: fixPath.getContentPath(image),
  };
}