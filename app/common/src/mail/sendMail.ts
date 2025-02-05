import nodemailer, { Transporter } from 'nodemailer';
import { customMail } from './customMail';
import env from '../configs/env';

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
    user: 'thanh.161003@gmail.com',
    pass: 'vibi yivt nohj voej',
  }
});

console.log('🚀 ~ env.SMTP_USER:', env.SMTP_USER)
console.log('🚀 ~ env.SMTP_PASS:', env.SMTP_PASS)
console.log('🚀 ~ env.JWT_ACCESS_TOKEN:', env.JWT_ACCESS_TOKEN)



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
    throw new Error(error as string);
  }
};