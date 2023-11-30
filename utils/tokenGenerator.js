import jwt from "jsonwebtoken";
import fetch from "node-fetch";

const { PAYPAL_API_HOST, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const base = "https://api-m.sandbox.paypal.com";

export const generateUserToken = (id) => {
  return jwt.sign({ _id: id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const generatePayPalToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("Oтсутствуют учётные данные API");
    }

    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET
    ).toString("base64");

    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      headers: { Authorization: `Basic ${auth}` },
      body: "grant_type=client_credentials",
    });

    const data = await response.json();

    return data.access_token;
  } catch (error) {
    console.error("Не удалось создать ключ доступа:", error);
  }
};
