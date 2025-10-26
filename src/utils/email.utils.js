import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendEmail({ to, subject, html, text }) {
  return resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
    text
  });
}

export async function sendPasswordResetEmail(to, token) {
  const resetUrl = `${process.env.FRONTEND_URL}/password-reset/${token}`;
  return sendEmail({
    to,
    subject: "Password Reset",
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    text: `Open this link to reset your password: ${resetUrl}`
  });
}

export async function sendEmailVerification(to, token) {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  return sendEmail({
    to,
    subject: "Verify Your Email",
    html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email address.</p>`,
    text: `Open this link to verify your email: ${verifyUrl}`
  });
}

