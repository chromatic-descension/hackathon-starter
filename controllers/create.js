/**
 * GET /
 * Create page.
 */
exports.getCreate = (req, res) => {
  res.render('create', {
    title: 'Create',
  });
};
