// server/middlewares/validate.js
function validateIdParam(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  next();
}

function validateTitle(req, res, next) {
  const { title } = req.body || {};
  if (typeof title !== 'string') {
    return res.status(400).json({ error: 'title is required' });
  }
  const t = title.trim();
  if (t.length < 1) {
    return res.status(400).json({ error: 'title is required' });
  }
  if (t.length > 255) {
    return res.status(400).json({ error: 'title is too long (max 255)' });
  }
  req.body.title = t; // chuẩn hoá để handler dùng luôn
  next();
}

module.exports = { validateIdParam, validateTitle };
