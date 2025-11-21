import crypto from 'crypto';
import axios from 'axios';
import Stripe from 'stripe';
import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import eventBus from '../utils/events.js';

// --------------------------------------------
// Ensure STRIPE_SECRET exists
// --------------------------------------------

if (!process.env.STRIPE_SECRET) {
  throw new Error('STRIPE_SECRET is missing in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET);

// --------------------------------------------------------
// PAYSTACK: Initialize Transaction
// --------------------------------------------------------
export const initPaystackPayment = async ({ amountKobo, email, metadata = {} }) => {
  const url = 'https://api.paystack.co/transaction/initialize';
  const payload = { email, amount: amountKobo, metadata };

  const resp = await axios.post(url, payload, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` }
  });

  return resp.data;
};

// --------------------------------------------------------
// POST /api/payments/init
// User initiates payment (Paystack or Stripe)
// --------------------------------------------------------
export const initPayment = async (req, res) => {
  try {
    const { provider = 'paystack', amount, bookingId, currency = 'NGN', returnUrl } = req.body;

    const amountCents = Math.round(Number(amount) * 100);

    const payment = await Payment.create({
      user: req.user.id,
      booking: bookingId || null,
      amount: amountCents,
      currency,
      provider,
      status: 'pending',
      metadata: req.body.metadata || {}
    });

    // PAYSTACK PAYMENT ------------------------------------------------
    if (provider === 'paystack') {
      const paystackResp = await initPaystackPayment({
        amountKobo: amountCents,
        email: req.user.email || req.body.email,
        metadata: {
          paymentId: payment._id.toString(),
          bookingId
        }
      });

      return res.status(201).json({
        payment,
        paystack: paystackResp.data
      });
    }

    // STRIPE PAYMENT --------------------------------------------------
    if (provider === 'stripe') {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency,
            product_data: { name: req.body.description || 'Course purchase' },
            unit_amount: amountCents
          },
          quantity: 1
        }],
        mode: 'payment',
        success_url: returnUrl || `${process.env.CLIENT_URL}/payments/success`,
        cancel_url: returnUrl || `${process.env.CLIENT_URL}/payments/cancel`,
        metadata: {
          paymentId: payment._id.toString(),
          bookingId
        }
      });

      return res.status(201).json({
        payment,
        stripeSession: session
      });
    }

    // DEFAULT RETURN ---------------------------------------------------
    return res.status(201).json({ payment });

  } catch (err) {
    console.error('initPayment error:', err);
    res.status(500).json({ message: err.message || 'Payment initiation failed' });
  }
};

// --------------------------------------------------------
// GET /api/payments/verify (Paystack verification)
// --------------------------------------------------------
export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.query;
    if (!reference) return res.status(400).json({ message: "Reference required" });

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` } }
    );

    const data = response.data.data;
    const status = data.status;

    if (status === 'success') {
      const paymentId = data.metadata?.paymentId;
      const bookingId = data.metadata?.bookingId;

      const payment = await Payment.findByIdAndUpdate(
        paymentId,
        {
          status: 'success',
          providerReference: reference,
          providerPayload: response.data
        },
        { new: true }
      );

      if (bookingId) {
        await Booking.findByIdAndUpdate(bookingId, { status: 'confirmed' });
      }

      eventBus.emit('payment:success', { payment, providerPayload: response.data });
    }

    return res.json({ status });

  } catch (err) {
    console.error('verifyPayment error:', err);
    res.status(500).json({ message: err.message });
  }
};

// --------------------------------------------------------
// PAYSTACK WEBHOOK
// --------------------------------------------------------
export const paystackWebhook = async (req, res) => {
  try {
    const rawBody = req.body;
    const signature = req.headers['x-paystack-signature'];
    const secret = process.env.PAYSTACK_SECRET;

    // Validate signature
    const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');
    if (hash !== signature) {
      console.warn('Paystack signature mismatch');
      return res.status(400).send('Invalid signature');
    }

    const payload = JSON.parse(rawBody.toString());
    const { event, data } = payload;

    if (event === 'charge.success') {
      const paymentId = data.metadata?.paymentId;
      const bookingId = data.metadata?.bookingId;

      const payment = await Payment.findByIdAndUpdate(paymentId, {
        status: 'success',
        providerReference: data.reference,
        providerPayload: payload
      }, { new: true });

      if (bookingId) {
        await Booking.findByIdAndUpdate(bookingId, { status: 'confirmed' });
      }

      eventBus.emit('payment:success', { payment, providerPayload: payload });
    }

    return res.json({ received: true });

  } catch (err) {
    console.error('paystackWebhook error:', err);
    return res.status(500).send('server error');
  }
};

// --------------------------------------------------------
// STRIPE WEBHOOK
// --------------------------------------------------------
export const stripeWebhook = async (req, res) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers['stripe-signature'];
  const rawBody = req.body;

  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('Stripe webhook signature failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Checkout success event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const metadata = session.metadata || {};

    const payment = await Payment.findByIdAndUpdate(metadata.paymentId, {
      status: 'success',
      providerReference: session.payment_intent,
      providerPayload: event
    }, { new: true });

    if (metadata.bookingId) {
      await Booking.findByIdAndUpdate(metadata.bookingId, { status: 'confirmed' });
    }

    eventBus.emit('payment:success', { payment, providerPayload: event });
  }

  return res.json({ received: true });
};

// --------------------------------------------------------
// GET /api/payments/:id/status
// --------------------------------------------------------
export const getPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Not found' });

    return res.json({
      status: payment.status,
      payment
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};