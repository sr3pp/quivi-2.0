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
