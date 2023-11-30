import fetch from "node-fetch";
import { generatePayPalToken } from "../utils/tokenGenerator.js";

const handleResponse = async (response) => {
  try {
    const jsonResponse = await response.json();

    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
};

const createOrder = async (payload) => {
  const accessToken = await generatePayPalToken();

  const response = await fetch(`${process.env.PAYPAL_CHECKOUT_API}`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(response);
};

const captureOrder = async (orderID) => {
  const accessToken = await generatePayPalToken();

  const response = await fetch(
    `${process.env.PAYPAL_CHECKOUT_API}/${orderID}/capture`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return handleResponse(response);
};

const PayPalController = {
  async create(req, res) {
    try {
      const { payload } = req.body;
      const { jsonResponse, httpStatusCode } = await createOrder(payload);

      res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
      console.error("Не удалось оформить заказ:", error);

      res.status(500).json({ error: "Не удалось оформить заказ." });
    }
  },

  async capture(req, res) {
    try {
      const { orderID } = req.params;
      const { jsonResponse, httpStatusCode } = await captureOrder(orderID);

      res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
      console.error("Не удалось оформить заказ:", error);

      res.status(500).json({ error: "Не удалось получить данные заказа." });
    }
  },
};

export default PayPalController;
