import bcrypt from "bcrypt";
import UserModel from "#src/models/user.model.js";
import ResetModel from "#src/models/reset.model.js";
import EmailVerificationModel from "#src/models/emailVerification.model.js";
import { AuthError, ConflictError, ValidationError } from "#src/utils/error.class.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, setRefreshTokenCookie, clearRefreshTokenCookie } from "#src/utils/jwt.utils.js";
import { generateResetToken, hashResetToken } from "#src/utils/token.utils.js";
import { sendPasswordResetEmail, sendEmailVerification } from "#src/utils/email.utils.js";

export async function register(req, res) {
  const { login, password, full_name, email } = req.body;

  const existingUser = await UserModel.findByLogin(login);
  if (existingUser) throw new ConflictError("User already exists");

  const user = await UserModel.create({ login, password, full_name, email });

  const verificationToken = generateResetToken().token;
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await EmailVerificationModel.create({
    user_id: user.id,
    token: verificationToken,
    expires_at: expiresAt
  });

  await sendEmailVerification(user.email, verificationToken);

  console.log('Verification token:', verificationToken);

  const { password: _, ...userData } = user;

  res.status(201).json({
    message: "User registered successfully. Please check your email to verify your account.",
    user: userData,
  });
}

export async function login(req, res) {
  const { login, password } = req.body;

  const user = await UserModel.findByLogin(login);
  if (!user) throw new AuthError("Invalid login or password");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new AuthError("Invalid login or password");

  if (!user.email_verified) throw new AuthError("Please verify your email before logging in");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  console.log('Login tokens:', { accessToken, refreshToken });

  setRefreshTokenCookie(res, refreshToken);

  const { password: _, ...userData } = user;

  res.status(200).json({
    message: "Login successful",
    accessToken,
    user: userData,
  });
}

export async function refresh(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) throw new AuthError("No refresh token provided");

  const payload = verifyRefreshToken(refreshToken);

  const user = await UserModel.find(payload.id);
  if (!user) throw new AuthError("User not found");

  const newAccessToken = generateAccessToken({ id: user.id, role: user.role });

  console.log('Refreshed access token:', { accessToken: newAccessToken });

  res.status(200).json({
    accessToken: newAccessToken
  });
}

export async function logout(req, res) {
  clearRefreshTokenCookie(res);

  res.status(200).json({
    message: "Logout successful"
  });
}

export async function reset(req, res) {
  const { email } = req.body;
  if (!email) throw new ValidationError("Email is required");

  const user = await UserModel.findByEmail(email);
  if (!user) throw new ValidationError("User with this email does not exist");

  const { token, tokenHash } = generateResetToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await ResetModel.deleteByUser(user.id);
  await ResetModel.create({ user_id: user.id, token: tokenHash, expires_at: expiresAt });

  await sendPasswordResetEmail(user.email, token);

  res.status(200).json({
    message: "Password reset email sent",
  });
}

export async function confirm(req, res) {
  const { confirm_token } = req.params;
  const { newPassword } = req.body;

  if (!confirm_token) {
    throw new ValidationError("Reset token is required");
  }

  if (!newPassword) {
    throw new ValidationError("New password is required");
  }

  if (newPassword.length < 8) {
    throw new ValidationError("Password must be at least 8 characters long");
  }

  const tokenHash = hashResetToken(confirm_token);
  const resetEntry = await ResetModel.findByToken(tokenHash);

  if (!resetEntry) throw new AuthError("Invalid or expired token");

  if (new Date(resetEntry.expires_at) < new Date()) {
    await ResetModel.delete(resetEntry.id);
    throw new AuthError("Token expired");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await UserModel.update(resetEntry.user_id, { password: hashedPassword });

  await ResetModel.delete(resetEntry.id);

  res.status(200).json({
    message: "Password reset successful",
  });
}

export async function verify(req, res) {
  const { token } = req.params;

  const verification = await EmailVerificationModel.findByToken(token);
  if (!verification) throw new AuthError("Invalid or expired verification token");

  await UserModel.verifyEmail(verification.user_id);
  await EmailVerificationModel.deleteByUserId(verification.user_id);

  res.status(200).json({
    message: "Email verified successfully",
  });
}
