import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

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

