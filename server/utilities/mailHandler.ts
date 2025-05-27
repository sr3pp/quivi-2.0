import nodemailer from "nodemailer";

const { public: conf } = useRuntimeConfig();

const config = {
  email: {
    host: conf.email.host,
    user: conf.email.user,
    pass: conf.email.pass,
  },
};

export const mailHandler = nodemailer.createTransport({
  host: config.email.host,
  port: 465, // Add this line
  secure: true, // true for 465, false for 587
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
