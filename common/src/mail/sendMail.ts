import nodemailer, { Transporter } from 'nodemailer';
import { customMail } from './customMail';
import dotenv from 'dotenv';
dotenv.config();

interface GmailType {
  subject: string;
  title: string;
  content: string;
}

// Configure the transporter with type annotations
const transporter: Transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.USERNAME_GMAIL as string,
    pass: process.env.PASSWORD_GMAIL as string,
  }
});

export const sendMail = async (
  GMAIL_TYPE: GmailType,
  code: number | string,
  email: string
): Promise<void> => {
  try {
    await transporter.sendMail({
      from: '"no-reply" <thanh.161003@gmail.com>',
      to: email,
      subject: GMAIL_TYPE.subject,
      text: 'Hello',
      html: customMail(GMAIL_TYPE.title, GMAIL_TYPE.content, code),
    });
  } catch (error) {
    throw new Error(String(error));
  }
};