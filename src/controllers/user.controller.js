import UserModel from "#src/models/user.model.js";
import { sanitizeUser } from "#src/utils/sanitize.utils.js";
import { ForbiddenError, ValidationError } from "#src/utils/error.class.js";

export async function list(req, res) {
  const users = await UserModel.findAll();

  res.status(200).json(users.map(sanitizeUser));
}

export async function get(req, res) {
  const user = await UserModel.find(req.params.user_id);
  if (!user) throw new ValidationError("User not found");

  res.status(200).json(sanitizeUser(user));
}

export async function create(req, res) {
  const { login, password, full_name, email, role } = req.body;

  if (!login || !password || !email) {
    throw new ValidationError("Missing required fields");
  }

  if (req.user.role !== "admin") throw new ForbiddenError();

  const user = await UserModel.create({ login, password, full_name, email, role });

  res.status(201).json({
    message: "User created successfully",
    user: sanitizeUser(user),
  });
}

export async function update(req, res) {
  const { user_id } = req.params;
  const updates = req.body;

  const updatedUser = await UserModel.update(user_id, updates);

  res.status(200).json({
    message: "User updated successfully",
    user: sanitizeUser(updatedUser),
  });
}

export async function avatar(req, res) {

  // TODO add smth to upload files

  res.status(200).json({
    message: "Avatar upload not implemented yet"
  });
}

export async function remove(req, res) {
  const { user_id } = req.params;
  await UserModel.delete(user_id);

  res.status(200).json({
    message: "User deleted successfully"
  });
}
