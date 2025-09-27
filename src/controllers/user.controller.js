import UserModel from "#src/models/user.model.js";
import FavoriteModel from "#src/models/favorite.model.js";
import fileService from "#src/services/file.service.js";
import { sanitizeUser } from "#src/utils/sanitize.utils.js";
import { ForbiddenError, ValidationError } from "#src/utils/error.class.js";

export async function list(req, res) {
  const users = await UserModel.findAll();

  res.json(users.map(sanitizeUser));
}

export async function get(req, res) {
  const user = await UserModel.find(req.params.user_id);
  if (!user) throw new ValidationError("User not found");

  res.json(sanitizeUser(user));
}

export async function create(req, res) {
  const { login, password, full_name, email, role } = req.body;

  if (!login || !password || !email) {
    throw new ValidationError("Missing required fields");
  }

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
  if (!req.file) {
    throw new ValidationError("No file uploaded");
  }

  const currentUser = await UserModel.find(req.user.id);

  const avatarUrl = fileService.getFileUrl(req.file.filename, 'avatar');

  await UserModel.update(req.user.id, { profile_picture: avatarUrl });

  if (currentUser.profile_picture) {
    const oldFilename = fileService.extractFilenameFromUrl(currentUser.profile_picture);
    await fileService.deleteFile(oldFilename, 'avatar');
  }

  res.status(200).json({
    message: "Avatar uploaded successfully",
    avatar_url: avatarUrl
  });
}

export async function remove(req, res) {
  const { user_id } = req.params;
  await UserModel.deleteWithCascade(user_id);

  res.status(200).json({
    message: "User deleted successfully"
  });
}

export async function favorites(req, res) {
  const { user_id } = req.params;

  const user = await UserModel.find(user_id);
  if (!user) throw new ValidationError("User not found");

  const isOwner = req.user.id === parseInt(user_id);
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new ForbiddenError("Cannot access other user's favorites");
  }

  const favorites = await FavoriteModel.findByUser(user_id);

  res.json({
    user_id: parseInt(user_id),
    favorites
  });
}
