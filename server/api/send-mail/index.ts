import { renderTemplate } from "../../utilities";
import { mailHandler } from "../../utilities/mailHandler";

const templateDir = "app/assets/templates/email/";

export default defineEventHandler(async (event) => {
  const { context, template, to, subject } = await readBody(event);

  if (!template) return;

  if (context) {
    context.appUrl = process.env.APP_URL;
  }
  const info = renderTemplate(`${templateDir}/${template}.hbs`, context);

  const mailOptions = {
    from: "no_reply@quivi.mx",
    to,
    subject,
    html: info,
  };

  const response = await new Promise((resolve, reject) => {
    mailHandler.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        console.log("Error occurred:", error.message);
        reject(error);
      } else {
        console.log("Email sent successfully!");
        console.log("Message ID:", info.messageId);
        return resolve(info);
      }
    });
  });

  return response;
});
