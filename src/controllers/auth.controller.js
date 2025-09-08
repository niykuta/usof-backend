import UserModel from '#src/models/user.model.js';

export async function register(req, res) {
  const { login, password, full_name, email } = req.body;

  const user = await UserModel.create({ login, password, full_name, email });

  res.json({
    id: user.id,
    login: user.login,
    full_name: user.full_name,
    email: user.email,
    role: user.role
  });
}
