const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
require("dotenv").config();

let transporter = nodemailer.createTransport({
  service: "Gmail",
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const registerEmail = async (userEmail) => {
  try {
    let mailGenerator = new Mailgen({
      theme: "default",
      product: { name: "Grocery", link: `${process.env.EMAIL_MAIN_URL}` },
    });

    const email = {
      body: {
        name: userEmail,
        intro: "Welcome to Grocery. We're very excited to have you on board.",
        action: {
          instructions: "Your order is being processed",
          button: {
            color: "#1a73e8",
            text: "Order placed successfully",
            link: ``,
          },
        },
        outro: [
          `Need help, or have any questions? Just reply to this email, we\'d love to help.`,
        ],
      },
    };

    let emailBody = mailGenerator.generate(email);
    let message = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: "Welcome to Grocery",
      html: emailBody,
    };

    await transporter.sendMail(message);
    return true;
  } catch (error) {
    if (error) throw error;
  }
};

module.exports = {
  contactMail,
  registerEmail,
};
