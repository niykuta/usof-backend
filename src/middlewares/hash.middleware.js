import bcrypt from 'bcrypt';

export async function hashPassword(req, res, next) {
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 12);
    }
    next();
  } catch (err) {
    next(err);
  }
}
