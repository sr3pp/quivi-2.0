import nodemailer from "nodemailer";

const { public: conf } = useRuntimeConfig();

const config = {
  email: {
    host: conf.email.host,
    user: conf.email.user,
    pass: conf.email.pass,
    port: conf.email.port,
  },
};

export const mailHandler = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port, // Add this line
  secure: process.env.NODE_ENV === "production", // true for 465, false for 587
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
