const BACKEND = require('../backend/backend');
const CONVERT_LISTENER = require('../backend/convert_listener');

/**
 * GET /create
 * Create page.
 */
exports.getCreate = (req, res) => {
  res.render('create', {
    title: 'Create',
  });
};

/**
 * POST /convertRandom
 * Convert a random image.
 */
exports.postConvertRandom = (req, res) => {
  if (CONVERT_LISTENER.connected) {
    res.send(false);
  } else {
    res.send(true);
    BACKEND.transformRandomImages();
  }
};

/**
 * POST /convertStatus
 * Get the convert status.
 */
exports.postConvertStatus = (req, res) => {
  res.send({
    isConverting: CONVERT_LISTENER.connected,
    lastMessage: CONVERT_LISTENER.lastMessage,
    lastRandomContent: BACKEND.lastRandomContent,
    lastRandomStyle: BACKEND.lastRandomStyle,
    lastRandomOutput: BACKEND.lastRandomOutput,
  });
};