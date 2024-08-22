import { getContent } from "~/server/utilities";
import { mailHandler } from "~/server/utilities/mailHandler";
import { Sale } from "~/server/Models";
import { join } from "pathe";

const baseDir = process.cwd();

export default defineEventHandler(async (event) => {
  const data = await readBody(event);
  const _config = getContent(
    join(baseDir, "content", "_config", "contact.json"),
  );

  const mainData = {
    type: data.type,
    orderId: data.order_id,
    transactionId: data.transaction.id,
    amount: data.transaction.amount,
  };

  //console.log("the webhook post: -------------", mainData);

  if (data.type === "charge.succeeded") {
    //update order status
    try {
      const sale = await Sale.findOneAndUpdate(
        { order_no: mainData.orderId },
        {
          status: true,
          "payment.status": true,
          "payment.transaction": mainData.transactionId,
        },
      );
      console.log("sale updated: ", sale);
    } catch (error) {
      console.log("Error updating order status: ", error);
      createError("Error updating order status");
    }

    const mailOptions = {
      from: "no_reply@quivi.mx",
      to: _config.email,
      subject: data.type,
      text: `
      Order ID: ${mainData.orderId}
      Transaction ID: ${mainData.transactionId}
      Amount: ${mainData.amount}
      `,
    };

    await new Promise((resolve, reject) => {
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

    return {
      message: "webhook received as post",
    };
  }
});
