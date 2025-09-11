import bcrypt from "bcrypt";
import SessionModel from "#src/models/sessions.model.js";
import UserModel from "#src/models/user.model.js";
import { AuthError, ConflictError } from "#src/utils/error.class.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "#src/utils/jwt.utils.js";

export async function register(req, res) {
  const { login, password, full_name, email } = req.body;

  const existingUser = await UserModel.findByLogin(login);
  if (existingUser) throw new ConflictError("User already exists");

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
  if (!user) throw new AuthError("Invalid login or password");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new AuthError("Invalid login or password");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const existingSession = await SessionModel.findByUser(user.id);

  if (existingSession) {
    await SessionModel.update({ user_id: user.id, refresh_token: refreshToken, expires_at: expiresAt });
  } else {
    await SessionModel.create({ user_id: user.id, refresh_token: refreshToken, expires_at: expiresAt });
  }

  const { password: _, ...userData } = user;

  res.status(200).json({
    message: "Login successful",
    accessToken,
    refreshToken,
    user: userData,
  });
}

export async function refresh(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new AuthError("No refresh token provided");

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AuthError("Invalid refresh token");
  }

  const session = await SessionModel.validateToken(payload.id, refreshToken);
  if (!session) throw new AuthError("Refresh token expired or invalid");

  const newAccessToken = generateAccessToken({ id: payload.id, role: payload.role });
  const newRefreshToken = generateRefreshToken({ id: payload.id });

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await SessionModel.update({ user_id: payload.id, refresh_token: newRefreshToken, expires_at: expiresAt });

  res.status(200).json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
}

export async function logout(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new AuthError("No refresh token provided");

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AuthError("Invalid refresh token");
  }

  await SessionModel.deleteByUser(payload.id);

  res.status(200).json({
    message: "Logout successful"
  });
}
