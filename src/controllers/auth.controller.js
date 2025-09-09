import bcrypt from "bcrypt";
import UserModel from '#src/models/user.model.js';
import { AuthError, ConflictError } from "#src/utils/error.class.js";

export async function register(req, res) {
  const { login, password, full_name, email } = req.body;

  const existingUser = await UserModel.findByLogin(login);
  if (existingUser) {
    throw new ConflictError("User already exists");
  }

  const user = await UserModel.create({ login, password, full_name, email });

  const { password: _, ...userData } = user;

  res.status(201).json({
    message: "User registered successfully",
    user: userData,
  });
}

export async function login(req, res) {
  const { login, password } = req.body;

  const user = await UserModel.findByLogin(login);
  if (!user) {
    throw new AuthError("Invalid login or password");
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    throw new AuthError("Invalid login or password");
  }

  const { password: _, ...userData } = user;

  res.json({
    message: "Login successful",
    user: userData,
  });
}
