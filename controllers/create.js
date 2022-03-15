const backend = require('../backend/backend');
const BACKEND = require('../backend/backend');
const COMMAND_RUNNER = require('../backend/command_runner');
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
 * POST /autoConvert
 * Convert a random image.
 */
exports.postAutoConvert = (req, res) => {
  if (req.body.val === 'true') {
    backend.setAutoConverting(true);
  } else {
    backend.setAutoConverting(false);
  }
};

/**
 * POST /convertStatus
 * Get the convert status.
 */
exports.postConvertStatus = (req, res) => {
  res.send({
    isConverting: COMMAND_RUNNER.running,
    lastMessage: CONVERT_LISTENER.lastMessage,
    autoConverting: BACKEND.autoConverting,
    lastRandomContent: BACKEND.lastRandomContent,
    lastRandomStyle: BACKEND.lastRandomStyle,
    lastRandomOutput: BACKEND.lastRandomOutput,
  });
};