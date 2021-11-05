/**
 * GET /
 * Current image rendering.
 */
exports.getCurrentCreate = (req, res) => {
  res.render('create', {
    title: 'Create',
  });
};
