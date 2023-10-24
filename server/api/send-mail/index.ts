import { renderTemplate } from "~/server/utilities";
import { mailHandler } from "~/server/utilities/mailHandler";

const templateDir = "assets/templates/email/";

export default defineEventHandler(async () => {
  const info = renderTemplate(`${templateDir}/test.hbs`, {
    name: "si que si",
    description: "esto es una prueba",
  });

  const mailOptions = {
    from: "no_reply@quivi.mx",
    to: "martin.ru@outlook.com",
    subject: "test",
    html: info,
  };

  mailHandler.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error occurred:", error.message);
    } else {
      console.log("Email sent successfully!");
      console.log("Message ID:", info.messageId);
    }
  });

  return mailOptions;
});
