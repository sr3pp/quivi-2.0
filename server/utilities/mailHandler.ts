import nodemailer from "nodemailer";

const config = {
  email: {
    host: process.env.EMAIL_HOST,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};

export const mailHandler = nodemailer.createTransport({
  secure: true,
  tls: {
    rejectUnauthorized: false,
  },
  host: config.email.host,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});
