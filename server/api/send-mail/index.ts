import { renderTemplate } from "~/server/utilities";
import { mailHandler } from "~/server/utilities/mailHandler";

const templateDir = "assets/templates/email/";

export default defineEventHandler(async (event) => {
  const { context, template, to, subject } = await readBody(event);
  const info = renderTemplate(`${templateDir}/${template}.hbs`, context);

  const mailOptions = {
    from: "no_reply@quivi.mx",
    to,
    subject,
    html: info,
  };

  mailHandler.sendMail(mailOptions, (error: any, info: any) => {
    if (error) {
      console.log("Error occurred:", error.message);
    } else {
      console.log("Email sent successfully!");
      console.log("Message ID:", info.messageId);
    }
  });

  return mailOptions;
});
