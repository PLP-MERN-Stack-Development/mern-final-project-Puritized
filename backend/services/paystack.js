import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET;
const PAYSTACK_BASE = process.env.PAYSTACK_BASE || "https://api.paystack.co";

export async function initializePayment({ email, amount, metadata, callback_url }) {
  // amount in kobo (NGN) or cents depending on currency — ensure conversion on frontend/backend
  const body = {
    email,
    amount,
    metadata: metadata || {},
    callback_url,
  };

  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return res.json();
}

export async function verifyPayment(reference) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      "Content-Type": "application/json",
    },
  });

  return res.json();
}