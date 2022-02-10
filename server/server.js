const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Stripe = require("stripe");
const { registerEmail } = require("./config/email");
const stripe = Stripe(
  "sk_test_51KOkp5JBBvEMWQdYNHGtWh2NguNaYXRyqnWXDioOyY6FJw9yF6XAZx8HJy1iUZQqH41gWiu6oCAZ3D9IEjz4kEWG00eGNsfu52"
);

const app = express();

require("dotenv").config();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/api/test", (req, res) => {
  res.status(200).send("working");
});

app.get("/email/:email", async (req, res) => {
  const { email } = req.params;
  await registerEmail(email);

  res.status(200).json({ success: true });
});

app.get("/buy/:amount", async (req, res) => {
  //   console.log("initiate");
  let { amount } = req.params;
  try {
    if (!amount) {
      return res.send(400).json({ message: "Invalid data" });
    }

    amount = parseFloat(amount).toFixed(3);

    const payment = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "CAD",
      payment_method_types: ["card"],
      metadata: { amount },
    });

    const clientSecret = payment.client_secret;

    res.json({ message: "Payment initiated", clientSecret });
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ message: "Failed to initiate payment" });
  }
});

const start = async () => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}!`);
  });
};

start();
